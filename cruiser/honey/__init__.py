# -*- coding: utf-8 -*-

import threading
import time
import os

from core.server import Honey
from common.mongoClient import build_mongodb_client
from common.redisClient import build_redis_client
from schema.service_in_monitor import ServiceInMonitor


class HoneyNetwork(object):
    def __init__(self):
        self.app = None
        self.redis = None
        self.service_list = []

    def inject_base_config(self, conf):
        self.app = conf

    def inject_db_config(self, conf):
        self.redis = build_redis_client(conf['redis'])

    def inject_port_list(self, conf):
        self.service_list = conf

    def run(self):
        ServiceInMonitor.drop_collection()
        for service in self.service_list:
            new_thread = Honey(service, self)
            new_thread.start()
