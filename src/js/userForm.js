const hm = require('mysql-ithm')

hm.connect({
  host: 'localhost', //数据库地址
  port: '3306',
  user: 'root', //用户名，没有可不填
  password: 'root', //密码，没有可不填
  database: 'intranet' //数据库名称
})

let userForm = hm.model('userForm', {
  userCode: String,
  userName: String,
  isLogin: String
})

module.exports = userForm
