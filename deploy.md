天格扫描平台
----------

### Repo
git clone https://github.com/x-sentry/xunfeng.git

### Requirements
> 安装之前必须安装好数据库
+ 巡风
    - mongodb
+ cruiser
    - redis
    - mongodb

### Database Install
install mongodb
```bash
echo "=======install mongodb========"
sudo cat > /etc/yum.repos.d/mongodb-3.2.repos << EOF
[mongodb-org-3.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.2.asc
EOF
yum -y install mongodb-org mongodb-org-server
systemctl enable mongod
systemctl start mongod
systemctl status mongod
systemctl daemon-reload
echo "安装mongodb成功......"
```
install redis
```bash
echo "=======install redis========"
yum install redis -y
systemctl status redis
systemctl enable redis
systemctl start redis
echo "安装redis成功......"
```

### Firewall Config
下方命令供参考使用
```bash
echo "=======关闭mongodb&redis的端口========"
echo "关闭mongodb的端口......"
firewall-cmd --zone= public --add-port=27017/tcp --permanent
echo "关闭redis的端口......"
firewall-cmd --zone= public --add-port=6379/tcp --permanent
echo "重载规则......"
firewall-cmd --reload
```


### Conf File
```yaml
app:
  license:
    name: curisier
    version: 1.0.0
    author: owen-carter
    updateTime: 2017-12-12
  loginCredential:                 # 登陆密码 
    name: admin
    pwd: admin123
  strategy:                        # cruiser的计算策略
    brute:
        timeout: 60                     
        timeoutDesc: 暴力破解的统计时间间隔，超时事时间
        limit: 20                       
        limitDesc: 攻击某端口达到的数量上限，超过就会报警
    scan:
        timeout: 60
        timeoutDesc: 超时时间
        limit: 10
        limitDesc: 扫描端口数量上限
db:
    mongodb:
        host: localhost
        port: 27017
        db: xunfeng
        username: xunfeng
        password: xunfeng123
    redis:                             # 只有cruiser在用
        host: localhost
        port: 6379
        bucket: 0
        username:
        password:
services:                              # cruiser 监测的端口服务列表
  - name: ftp
    port: 21
  - name: telent
    port: 23
```


### Cruiser
+ 巡风和Cruiser融合部署
    ```bash
    git clone https://github.com/x-sentry/xunfeng.git
    # 此时mongodb和redis应该已经安装并启动
    cd xunfeng
    # 启动巡风各个组件，以及cruiser
    sh Run.sh
    # 启动web
    # 由于web的特殊性，我把web的启动都离开了
    
    # 调试时候启动方式
    python Run.py
    
    # 部署时候启动
    nohup python Run.py &
    ```

+ 巡风和Cruiser独立部署
    - 巡风PC
        - 安装mongodb
        - 安装redis，也可以安装在CruiserPC上
        - git clone https://github.com/x-sentry/xunfeng.git
        - cd xunfeng 
        - 编辑配置文件配置好，mongodb的访问方式，即可
        - sh Run.sh
        - nohup python Run.py &
    - cruiserPC
        - 安装Redis，也可以安装在巡风PC上
        - git clone https://github.com/x-sentry/xunfeng.git
        - cd xunfeng 
        - 编辑配置文件conf.yml，将cruiser程序的redis，mongodb的访问配置正确
        - nohup python cruiser.py &



### Faq
- 安装需要注意pymongo版本问题 pymongo==2.8