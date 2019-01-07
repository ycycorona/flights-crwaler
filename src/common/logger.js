const path = require('path')
const log4js = require('log4js').configure('log4js.json')
const logger = log4js.getLogger()
module.exports = (filename) => {
  logger.addContext('filePath', path.relative(process.cwd(), filename)) // 日志添加文件相对路径
  return logger
}
