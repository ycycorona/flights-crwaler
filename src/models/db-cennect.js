const path = require('path')
const logger = require('../common/logger')(__filename)
const mongoose = require('mongoose')
const config = require(path.join(process.cwd(), 'config'))

const {obOptions, dbUrl} = config.mongodb

module.exports = async (options) => {
  mongoose.connect(dbUrl, obOptions)
  const db = mongoose.connection;

  return await new Promise((resolve, reject) => {
    db.on('error',(err) => {
      logger.info(err)
      reject(false)
    })
    db.once('open', function() {
      logger.info('数据库连接成功')
      resolve(true)
    })
  })
}

