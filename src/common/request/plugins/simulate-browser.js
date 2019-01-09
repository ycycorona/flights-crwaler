const _ = require('lodash')
module.exports = (options = {}) => {
  const defaultOptions = {
    'accept': '*/*',
    'accept-encoding': 'gzip, deflate',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7,zh-TW;q=0.6',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
  }
  const headers = _.assignWith(defaultOptions, options, (objVal, srcVal) => {
    return objVal ? objVal : srcVal
  })
  return {headers}
}
