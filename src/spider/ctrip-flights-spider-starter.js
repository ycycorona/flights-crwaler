const path = require('path')
const logger = require('log4js').getLogger()
logger.addContext('filePath', path.relative(process.cwd(), __filename))
const config = require('../../config.js')
const getBrowser = require('../browser')
const util = require('../util')

const CtripFlightsPriceSpider = require('./CtripFlightsSpider')

module.exports = async () => {
  let error = null
  try {
    const {dateStart, dateEnd} = config.ctripFlightsPriceSpider.params
    const browser = await getBrowser(config.chromeOptions)
    const spider  = new CtripFlightsPriceSpider(config.ctripFlightsPriceSpider, browser)
    const dateList = util.getDateList(dateStart, dateEnd)
    logger.debug(dateList)
    //await spider.getPage()
    await browser.close()
  } catch (e) {
    logger.error(e)
    error = e
  }

  if (error) {
    return false
  } else {
    return true
  }
}