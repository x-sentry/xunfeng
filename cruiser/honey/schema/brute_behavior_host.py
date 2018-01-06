# coding: utf-8
from mongoengine import *
import datetime


class BruteBehaviorHost(Document):
    meta = {
        'collection': 'brute_behavior_host',
        'indexes': [
            {
                'fields': ['created'],
                'expireAfterSeconds': 3600
            }
        ]
    }
    """
    破解类型的机器
    特征是：高频率攻击一个端口
    """
    ip = StringField()
    port = StringField()
    service = StringField()
    times = IntField()
    created = DateTimeField(default=datetime.datetime.now)
