var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var cors = require('cors')
var bodyParser = require('body-parser')
let userForm = require('./src/js/userForm')
let messageHistory = require('./src/js/messageHistory')
let channelForm = require('./src/js/channelForm')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
io.on('connection', socket => {
  socket.on('userAccess', msg => {
    let { userCode } = JSON.parse(msg)
    userForm.sql(
      `select * from userForm where userCode = '${userCode}'`,
      (err, results) => {
        if (results.length === 0) {
          userForm.sql(
            `insert into userForm(userCode,isLogin) values("${userCode}",1)`,
            // 让当前用户修改昵称
            (err, results) => socket.emit('changeName', 'changeName')
          )
          // 将用户加入默认频道
          channelForm.find('channelId=1', (err, results) => {
            let member = ''
            if (results[0].member) {
              member = results[0].member.split(',')
              member.push(userCode)
              member = member.join(',')
            } else {
              member = userCode
            }
            channelForm.update('channelId=1', { member }, (err, results) => {})
          })
        } else {
          // 向所有用户通知用户xxx上线
          io.emit('informUserAccess', msg)
        }
      }
    )
  })
  socket.on('userQuit', msg => {
    let { userCode } = JSON.parse(msg)

    // 向所有用户通知用户xxxx下线
    io.emit('userQuit', msg)
  })
  socket.on('sendMessage', msg => {
    let message = msg
    message.time = Date.now()
    messageHistory.insert(message, (err, results) => {
      if (!err) {
        // 向所有用户发送信息
        io.emit('sendMessage', message)
        socket.emit('sendMessage', '发送成功')
      }
    })
  })
})
// 获取用户列表
app.get('/acquire/userName/list', (req, res) => {
  userForm.find((err, results) => {
    res.send(results)
  })
})
// 修改用户名称
app.post('/change/userName', (req, res) => {
  let { userCode, userName } = req.body
  userForm.sql(
    `update userForm set userName="${userName}" where userCode="${userCode}"`,
    (err, results) => {
      if (results) res.send('修改成功')
    }
  )
})
// 获取自己所在的群
app.post('/acquire/channel', (req, res) => {
  let { userCode } = req.body
  channelForm.sql(
    `select * from channelForm where member like "%${userCode}%"`,
    (err, results) => res.send(results)
  )
})
// 获取所在群的所有信息
app.post('/acquire/allMessage', (req, res) => {
  let { ids } = req.body
  let channelId = ids.map(item => `channelId=${item}`).join(' or ')
  messageHistory.sql(
    `select * from messageHistory where ${channelId}`,
    (err, results) => res.send(results)
  )
})
// 创建新群
app.post('/addChannel', (req, res) => {
  let { channelName, creator } = req.body
  channelForm.sql(
    `select * from channelForm where channelName="${channelName}"`,
    (err, results) => {
      if (!results.length) {
        channelForm.sql(
          `insert into channelForm(channelName,creator,member) values("${channelName}","${creator}","${creator}")`,
          (err, results) =>
            res.send({
              msg: '创建成功',
              code: 200,
              channelId: results.insertId
            })
        )
      } else res.send({ msg: '该名称已被使用，请更换', code: 201 })
    }
  )
})
// 加入群
app.post('/joinChannel', (req, res) => {
  let { channelName, userCode } = req.body
  channelForm.sql(
    `select * from channelForm where channelName="${channelName}"`,
    (err, results) => {
      if (results.length) {
        let member = results[0].member.split(',')
        if (member.includes(userCode)) {
          res.send({ msg: '已在群内，无需再次加入', code: 201 })
          return
        }
        member.push(userCode)
        member = member.join(',')
        results.member = member
        channelForm.update(
          `channelId=${results[0].channelId}`,
          { member },
          () => res.send({ msg: '加入成功', code: 200, data: results[0] })
        )
      } else res.send({ msg: '该群不存在', code: 201 })
    }
  )
})

app.post('/getData', (req, res) => {
  console.log(req.body)
  res.send({ asa: 'asas' })
})
http.listen(3030, () => {
  console.log('http://localhost:3030')
})
