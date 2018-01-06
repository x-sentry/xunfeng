# -*- coding: utf-8 -*-

import yaml
from cruiser.honey import HoneyNetwork
from cruiser.honey.common.mongoClient import build_mongodb_client

honey = HoneyNetwork()

with open('./conf.yml') as f:
    conf = yaml.load(f)
    honey.inject_base_config(conf['app'])
    honey.inject_db_config(conf['db'])
    build_mongodb_client(conf['db']['mongodb'])
    honey.inject_port_list(conf['services'])

    honey.run()
