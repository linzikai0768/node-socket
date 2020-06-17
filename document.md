打开 phpStudy ，启动 Mysql 服务
默认项，如果修改过请自行更改
host: 'localhost'
user: 'root'
password: 'root'

执行 node mysql.js

再执行 node app.js





#### 1.创建 socket 链接

##### => http://localhost:3030

#### 2.用户进入时 (userAccess)

携带浏览器标识 例如： { userCode: 2325sdf165 }

#### 3.向所有用户通知用户上线 (informUserAccess)

#### 4.用户退出时 (userQuit)

携带浏览器标识 例如： { userCode: 2325sdf165 }

#### 5.向所有用户通知新用户下线 (informUserQuit)





#### 1.获取频道历史信息

1. post
2. url： acquire/messageHistory/list
3. {channelId:1,time:时间戳,page:1,num:20}

#### 2.发送图片信息

1. post
2. url： /send/imgMessage
3. formdata:{channelId,   userCode,   userName,  imgMessage}

#### 2.发送信息

1. post
2. url：/send/message
3. { userCode , userName , channelId , message }

#### 3. 修改名称

1. get
2. url：change/userName
3. { userCode , userName , channelId , message , channelName }

#### 4.获取用户信息

1. get
2. url： acquire/userName/list

#### 5.获取自己所在的群

1. post
2. url： acquire/channel
3. {userCode :1545df145}

#### 6.获取群信息

1. post
2. url： acquire/messageHistory/list
3. {userCode :1545df145}

#### 7.创建群

1. post
2. url： addChannelt
3. {creator:1545df145,channelName,'007'}

#### 8.加入群

1. post
2. url：  joinChannelt
3. {creator:1545df145,channelName,'007'}