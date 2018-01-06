# coding: utf-8
import socket


class TestHackClient(object):
    def __init__(self):
        self.handler = None

    def setup(self):
        pass

    def attack(self, port):
        self.handler = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.handler.connect(('localhost', port))
        try:
            msg = bytes("client send: test")
            self.handler.sendall(msg)
            data = self.handler.recv(1024)
            print(data)
            print('Received', repr(data))
        except Exception as e:
            self.handler.close()

    def test_scan(self):
        port_list = [80, 8000, 8080, 22, 25, 389, 443, 53, 23, 21, 3306, 3389]
        for port in port_list:
            print port
            self.attack(port=port)
            self.attack(port=port)
            self.attack(port=port)
            self.attack(port=port)
            self.attack(port=port)
            self.attack(port=port)
            self.attack(port=port)
            self.attack(port=port)
            self.attack(port=port)
            self.attack(port=port)
            self.attack(port=port)
            self.attack(port=port)
            self.attack(port=port)
            self.attack(port=port)

    def test_brute(self):
        x = 0
        while x <= 20000:
            x += 1
            print x
            self.attack(port=80)
