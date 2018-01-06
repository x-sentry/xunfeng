ABOUT
-----

### description
+ 一定时间段内某一个ip扫描的端口数量超过上限
    - 一定时间使用redis，超时机制来完成
    - 某一个ip，使用redis的key来完成
    - 上限使用某一个key的value来实现
    
+ 一定时间段内某一个ip扫描某端口的次数达到上限
    - 一定时间采用redis的超时机制
    - redis的key采用ip+port
    
    
### 如何存储？
