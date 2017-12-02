class Config(object):
    ACCOUNT = 'admin'
    PASSWORD = 'tiange321'


class ProductionConfig(Config):
    DB = '47.93.35.216'
    PORT = 27017
    DBUSERNAME = 'tiangedb'
    DBPASSWORD = 'tiange321'
    DBNAME = 'tiange'
