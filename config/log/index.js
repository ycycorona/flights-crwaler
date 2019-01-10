const NODE_ENV = process.env.NODE_ENV
const _ = require('lodash')
const envMap = {
  'development': 'dev',
  'production': 'prod',
}
const configDefault = require('./log4js.config.default')
let configEnv = null
if (envMap[NODE_ENV]) {
  configEnv = require(`./log4js.config.${envMap[NODE_ENV]}.js`)
}

module.exports = _.merge(configDefault, configEnv)
