class Config(object):
    ACCOUNT = 'xunfeng'
    PASSWORD = 'xunfeng123'


class ProductionConfig(Config):
    DB = 'localhost'
    PORT = 27017
    DBUSERNAME = 'xunfeng'
    DBPASSWORD = 'xunfeng123'
    DBNAME = 'xunfeng'
