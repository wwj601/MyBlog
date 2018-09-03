const crypto = require('crypto')

// 返回加密成功的数据
module.exports = function (password,key='Adger'){
  const hmac = crypto.createHmac('sha256',key)
  hmac.update(password)
  const passwordHmac = hmac.digest('hex')
  return passwordHmac
}