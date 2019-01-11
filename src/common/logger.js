const path = require('path')
const log4jsConfig = require(path.join(process.cwd(), 'config/log'))
const log4js = require('log4js').configure(log4jsConfig)

module.exports = (filename) => {
  const logger = log4js.getLogger()
  logger.addContext('filePath', path.relative(process.cwd(), filename)) // 日志添加文件相对路径
  return logger
}
