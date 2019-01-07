const path = require('path')
const logger = require('../common/logger')(__filename)
const config = require('../../config.js')
const getBrowser = require('../browser')
const util = require('../util')

const CtripFlightsPriceSpider = require('./CtripFlightsSpider')

module.exports = async () => {
  let error = null
  try {
    const {
      dateStart,
      dateEnd,
      flightLines
    } = config.ctripFlightsPriceSpider.params
    const browser = await getBrowser(config.chromeOptions)
    const spider = new CtripFlightsPriceSpider(config.ctripFlightsPriceSpider, browser)
    const dateList = util.getDateList(dateStart, dateEnd)

    for (const date of dateList) {
      await spider.getPage(date, flightLines[0])
    }

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
