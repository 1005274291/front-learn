const crypto = require('crypto')
const hash = (type, str) => crypto.createHash(type).update(str).digest('hex')//hex是把二进制转化成十六进制的字母字符串
const md5 = str => hash('md5',str)
const sha1 = str => hash('sha1',str)
const encryptPassword = (salt, password) => md5(salt + 'abced@#4@%#$7' + password)//将密码入库的时候采用言+乱序字符串+密码的格式hash防止被破解
const psw = '11111'
console.log('md5', md5(psw))
console.log('sha1', sha1(psw))
module.exports = encryptPassword

