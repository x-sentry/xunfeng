# coding: utf-8
from mongoengine import connect


def build_mongodb_client(conf):
    """
    build mongodb client
    :param conf:
    :return:
    """
    connect(
        host=conf['host'],
        port=conf['port'],
        username=conf['username'],
        password=conf['password'],
        db=conf['db'],
    )


if __name__ == "__main__":
    config = {
        'host': "localhost",
        'port': 27017,
        'username': "",
        'password': "",
        'db': "xunfeng",
    }
    build_mongodb_client(config)
