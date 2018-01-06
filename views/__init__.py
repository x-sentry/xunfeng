import os
import sys
from flask import Flask
from datetime import timedelta

app = Flask(__name__)

app.secret_key = "t454655443334t3t3t5y6u7o9p9o8i76u65y45t43tr2"

app.permanent_session_lifetime = timedelta(hours=6)

page_size = 60

sys.path.append(sys.path[0] + '/vulscan/vuldb/')

file_path = os.path.split(os.path.realpath(__file__))[0] + '/../vulscan/vuldb/'
