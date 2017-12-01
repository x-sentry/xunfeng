import sys
from datetime import timedelta
from flask import Flask
from Config import ProductionConfig
from views.lib import Conn
import os

app = Flask(__name__)
app.secret_key = "t454655443334t3t3t5y6u7o9p9o8i76u65y45t43tr2"
app.config.from_object(ProductionConfig)
Mongo = Conn.MongoDB(app.config.get('DB'), app.config.get('PORT'), app.config.get('DBNAME'),
                     app.config.get('DBUSERNAME'), app.config.get('DBPASSWORD'))
app.permanent_session_lifetime = timedelta(hours=6)
page_size = 60
sys.path.append(sys.path[0] + '/vulscan/vuldb/')
file_path = os.path.split(os.path.realpath(__file__))[0] + '/../vulscan/vuldb/'
