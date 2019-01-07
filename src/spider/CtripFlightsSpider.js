const logger = require('../common/logger')(__filename)
const fs = require('fs')
const cheerio = require('cheerio')
const dayjs = require('dayjs')

module.exports = class CtripFlightsPriceSpider {
  constructor(options, browser) {
    this.browser = browser
  }

  async getPage(date, flightLine) {
    const page = await this.browser.newPage()
    await page.goto(`http://flights.ctrip.com/itinerary/oneway/${flightLine[0]}-${flightLine[1]}?date=${date}`, {
      timeout: 30000,
    }).catch(e => {
      logger.error(e)
    })
    const pageDocStr = await page.mainFrame().content()
    const nowTime = dayjs().format('YYYY-MM-dd HH:mm:ss')
    const fileName = `[${flightLine[0]}-${flightLine[1]}][date=${date}][${nowTime}].html`
    fs.writeFile(`./test/${fileName}`, pageDocStr, (err) => {
      if (err) logger.error(`写入 ${fileName} 失败`, err)
      logger.all(`写入 ${fileName} 成功`);
    })
    await page.close()
  }

  extraInfo(docStr) {
    const infoObj = {}
    const $ = cheerio.load(docStr)
    const $searchresultContent = $('.searchresult_content')
    const $flightListDom = $('.search_box.search_box_tag.search_box_light.Label_Flight', $searchresultContent)
    if ($flightListDom.length === 0) {
      logger.info(`没有提取到直达航班`);
    }
    infoObj.text = $flightListDom.text()
    return infoObj
  }
}
