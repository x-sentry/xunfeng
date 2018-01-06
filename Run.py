import yaml
from views.View import app

with open('./conf.yml') as f:
    conf = yaml.load(f)
    app.config['loginCredential'] = conf['app']['loginCredential']
    app.debug = True
    app.run(threaded=True, port=80, host='0.0.0.0')
