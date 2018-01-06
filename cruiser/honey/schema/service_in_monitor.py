# coding: utf-8
from mongoengine import *


class ServiceInMonitor(Document):
    meta = {'collection': 'service_in_monitor'}
    """
    本系统所监听的服务数量及其列表
    """
    service_name = StringField(max_length=200, required=True)
    port = StringField(max_length=200, required=True)
    desc = StringField()
