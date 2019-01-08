const path = require('path')
const log4js = require('log4js').configure('log4js.json')

module.exports = (filename) => {
  const logger = log4js.getLogger()
  logger.addContext('filePath', path.relative(process.cwd(), filename)) // 日志添加文件相对路径
  return logger
}
