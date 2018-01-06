# -*- coding: UTF-8 -*-
from pymongo import MongoClient


# 数据库连接
class MongoDB(object):
    def __init__(self, host='localhost', port=27017, db='xunfeng', username='', password=''):
        self.conn = MongoClient(host, port)
        self.coll = self.conn[db]
        self.coll.authenticate(username, password)
