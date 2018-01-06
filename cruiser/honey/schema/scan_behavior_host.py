# coding: utf-8
from mongoengine import *
import datetime


class ScanBehaviorHost(Document):
    meta = {
        'collection': 'scan_behavior_host',
        'indexes': [
            {
                'fields': ['created'],
                'expireAfterSeconds': 3600
            }
        ]
    }
    """
    扫描类型的机器
    特征是：高频率扫描多个端口
    """
    ip = StringField()
    accessed_services = DictField()
    created = DateTimeField(default=datetime.datetime.now)
