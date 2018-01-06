# coding: utf-8
import socket
import gevent
import threading
import time

from gevent import socket, monkey
from ..schema.scan_behavior_host import ScanBehaviorHost
from ..schema.brute_behavior_host import BruteBehaviorHost
from ..schema.service_in_monitor import ServiceInMonitor

monkey.patch_all()

"""
    ABOUT
    一个fake蜜罐
"""


class Honey(threading.Thread):
    def __init__(self, service, parent):
        self.service = service
        self.parent = parent
        self.redis = parent.redis

        # 单位是秒，过期时间
        self.scan_timeout = self.parent.app['strategy']['scan']['timeout']
        self.brute_timeout = self.parent.app['strategy']['scan']['timeout']

        # 攻击次数
        self.scan_limit = self.parent.app['strategy']['scan']['limit']
        self.brute_limit = self.parent.app['strategy']['scan']['limit']

        self.server_name = service['name']
        self.server_port = service['port']
        self.concurrency = 1000

        # 登记一下服务
        self.register_service()

        try:
            self.server = socket.socket()
            self.server.bind(('0.0.0.0', self.server_port))
            self.server.listen(self.concurrency)
        except Exception as e:
            exit(0)
        threading.Thread.__init__(self)

    def register_service(self):
        print("" + str(self.server_name) + " is running at " + str(self.server_port))

        service_in_monitor = ServiceInMonitor(
            service_name=self.server_name,
            port=str(self.server_port),
            desc=''
        )
        service_in_monitor.save()

    def compute(self, ip):
        self._compute_brute(ip)
        self._compute_scan(ip)

    def _compute_scan(self, ip):
        """
        一定时间内访问本机的端口数量超过限制
        这个应该使用字典的方式，进行存储一个ip可以存储多个端口
        端口的数量，可以作判断的标准
        :param ip:
        :return:
        """
        # 使用ip作为key
        scan_key = str(ip)
        # 先监测是否存在这个key在数据库中
        is_exist = self.redis.hgetall(scan_key)
        # 如果存在，说明出现过，那么先把当前的攻击存储进去
        if is_exist:
            # 字典的存储方式，存入一个服务及其端口号
            self.redis.hset(scan_key, self.server_name, self.server_port)
            port_number = self.redis.hlen(scan_key)
            accessed_services = self.redis.hgetall(scan_key)
            print ip, "访问了本机器", port_number, '次'

            # 监测是否应该触发警报，如果该ip的访问端口数量超过了配置文件中声明的数量
            # 那么进行报警
            if port_number > self.scan_limit:
                print '因此触发了扫描报警'
                scan_host = ScanBehaviorHost.objects(ip=scan_key).first()
                if scan_host:
                    scan_host.accessed_services = accessed_services
                    scan_host.save()
                else:
                    scan_host = ScanBehaviorHost(
                        ip=ip,
                        accessed_services=accessed_services
                    )
                    scan_host.save()

        else:
            self.redis.hset(scan_key, self.server_name, self.server_port)
            self.redis.expire(scan_key, self.scan_timeout)

    def _compute_brute(self, ip):
        """
        一定时间内，攻击的一个端口数量超过限制
        这个存储方式是没有问题的，计算某一个ip攻击特定端口的数量
        可以计算出来暴力破解的数量
        :param ip:
        :return:
        """
        ip = str(ip)
        port = str(self.server_port)
        brute_key = ip + ":" + port

        is_exist = self.redis.get(brute_key)
        if is_exist:
            self.redis.incr(brute_key)

            # 监测是否应该触发警报
            if int(is_exist) > self.brute_limit:
                print '触发了暴力破解报警'
                # 查询该机器是否已经存起来了
                brute_host = BruteBehaviorHost.objects(ip=ip, port=port).first()
                if brute_host:
                    # 如果已经存起来，更新之
                    brute_host.times = int(is_exist)
                    brute_host.save()
                else:
                    # 如果没有存起来，那就先存一下
                    danger_host = BruteBehaviorHost(
                        ip=ip,
                        port=str(self.server_port),
                        service=self.server_name,
                        times=int(is_exist)
                    )
                    danger_host.save()

        else:
            # 如果从来没有记录，那就设置一下，并且设置过期时间
            self.redis.set(brute_key, 1, ex=self.brute_timeout)

    @staticmethod
    def request_handler(connection):
        try:
            while True:
                data = connection.recv(1024)
                connection.send(data)
                if not data:
                    connection.shutdown(socket.SHUT_WR)
        except Exception as e:
            print(e)
        finally:
            connection.close()

    def run(self):
        while True:
            cli, address = self.server.accept()
            ip, port = address
            self.compute(ip)
            gevent.spawn(self.request_handler, cli)
