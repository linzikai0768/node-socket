const mysql = require('mysql')
const db = mysql.createConnection({
  host: 'localhost', //数据库地址
  user: 'root', //用户名，没有可不填
  password: 'root' //密码，没有可不填
})
let connection = null
// 链接本地库
db.connect(err => {
  if (err) throw err
  console.log('链接本地库成功')
})

db.query('show databases', (err, results) => {
  const isExist = results.find(item => {
    return item.Database === 'intranet'
  })
  // 创建 intranet 库
  if (!isExist) db.query('CREATE DATABASE intranet', () => {})
  // 链接 intranet 库
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'intranet'
  })

  connection.connect(function (err) {
    if (err) {
      console.log('链接失败')
      throw err
    } else {
      console.log('链接 intranet 库成功')
      connection.query('show tables', (a, b) => {
        console.log(b)

        if (b.length === 0) {
          connection.query(
            'CREATE TABLE userForm(userId int primary key auto_increment,userCode varchar(20),userName varchar(20),isLogin int(1))',
            (a, b) => console.log(b)
          )
          connection.query(
            'CREATE TABLE messageHistory(Id int primary key auto_increment ,userCode varchar(20),userName varchar(20),channelId int(6),time BIGINT(20),message varchar(500000))',
            (a, b) => console.log(b)
          )
          connection.query(
            'CREATE TABLE channelForm(channelId int primary key auto_increment ,channelName varchar(20),creator varchar(20),member varchar(500000))',
            (a, b) => console.log(b)
          )
          connection.query(
            'insert into channelForm(channelName,creator) values("数据中台总群","007")',
            (a, b) => console.log(b)
          )
        }
      })
    }
  })
})
