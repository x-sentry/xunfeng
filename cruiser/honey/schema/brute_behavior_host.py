# coding: utf-8
from mongoengine import *


class BruteBehaviorHost(Document):
    meta = {'collection': 'brute_behavior_host'}
    """
    破解类型的机器
    特征是：高频率攻击一个端口
    """
    ip = StringField()
    port = StringField()
    service = StringField()
    times = IntField()
