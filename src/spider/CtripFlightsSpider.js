const logger = require('log4js').getLogger()
const fs = require('fs')
const cheerio = require('cheerio')

module.exports = class CtripFlightsPriceSpider {
  constructor(options, browser) {
    this.browser = browser
  }
  async getPage() {
    const page = await this.browser.newPage()
    await page.goto(`http://flights.ctrip.com/itinerary/oneway/tao-cgo?date=2019-01-07`, {timeout: 30000, }).catch(e => {
      logger.error(e)
    })
    const pageDocStr = await page.mainFrame().content()
    fs.writeFile(`./test/[tao-cgo][date=2019-01-07].html`, pageDocStr, (err) => {
      if (err) logger.error('写入html失败', err)
      logger.all(`html写入成功`);
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
