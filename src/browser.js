const path = require('path')
const puppeteer = require('puppeteer')
const logger = require('./common/logger')(__filename)

module.exports = async (chromeOptions) => {
  const browser =  await puppeteer.launch(chromeOptions).catch(err => {
    logger.error('puppeteer实例启动失败', err)
  })
  if (browser) {
    logger.info('puppeteer实例启动成功')
    browser.on('disconnected', () => {
      logger.info('puppeteer实例断开')
    })
    browser.on('targetcreated', async (target) => {
      const page = await target.page()
      if (page) {
        logger.debug(`打开新tab页面${page.url()}`)
        let flag = true
/*        const host = url.parse(page.url()).host
        for (let i=0; i<whiteHostList.length; i++) {
          if (host.match(whiteHostList[i]) || host === 'blank') {
            flag = true
            break
          }
        }*/
        if (! flag) {
          await page.close()
          logger.debug(`关闭广告等弹出页面！`)
        }
      }
    })
    browser.on('targetchanged', async (target) => {
      logger.debug(`页面地址改变为 ${target.url()}`)
    })
  }
  return browser
}
