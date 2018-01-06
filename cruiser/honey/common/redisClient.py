#!/usr/bin/env python
# -*- coding:utf-8 -*-
import redis


def build_redis_client(conf):
    """
    build_redis_client
    :param conf:
    :return:
    """
    try:
        pool = redis.ConnectionPool(host=conf['host'], port=conf['port'] or 6379, db=conf['bucket'])
        return redis.Redis(connection_pool=pool)
    except Exception as e:
        raise e


if __name__ == "__main__":
    config = {
        'host': "localhost",
        'port': 6379,
        'username': "",
        'password': "",
        'bucket': 0,
    }
    client = build_redis_client(config)
    client.set("redis.conn.test", "success")
    print client.get("redis.conn.test")
