const path = require('path')
const puppeteer = require('puppeteer')
const logger = require('log4js').getLogger()
logger.addContext('filePath', path.relative(process.cwd(), __filename))

module.exports = async (chromeOptions) => {
  const browser =  await puppeteer.launch(chromeOptions).catch(err => {
    logger.error('puppeteer实例启动失败')
  })
  if (browser) {
    logger.info('puppeteer实例启动成功')
    browser.on('disconnected', () => {
      logger.info('puppeteer实例断开')
    })
  }
  return browser
}
