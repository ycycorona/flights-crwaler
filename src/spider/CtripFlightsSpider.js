const logger = require('log4js').getLogger()
const fs = require('fs')
const cheerio = require('cheerio')

module.exports = class CtripFlightsPriceSpider {
  constructor(options, browser) {
    this.browser = browser
  }
  async getPage(date, flightLine) {
    const page = await this.browser.newPage()
    await page.goto(`http://flights.ctrip.com/itinerary/oneway/${flightLine[0]}-${flightLine[1]}?date=${date}`, {timeout: 30000, }).catch(e => {
      logger.error(e)
    })
    const pageDocStr = await page.mainFrame().content()
    fs.writeFile(`./test/[${flightLine[0]}-${flightLine[1]}][date=${date}].html`, pageDocStr, (err) => {
      if (err) logger.error(`写入[${flightLine[0]}-${flightLine[1]}][date=${date}].html失败`, err)
      logger.all(`写入[${flightLine[0]}-${flightLine[1]}][date=${date}].html成功`);
    })
    await page.close()
  }
  extraInfo(docStr) {
    const infoObj = {}
    const $ = cheerio.load(docStr)
    const $searchresultContent = $('.searchresult_content')
    const $flightListDom = $('.search_box.search_box_tag.search_box_light.Label_Flight', $searchresultContent)
    infoObj.text = $flightListDom.text()
    return infoObj
  }
}
