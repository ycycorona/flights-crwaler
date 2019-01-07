const logger = require('../common/logger')(__filename)
const fs = require('fs')
const cheerio = require('cheerio')
const dayjs = require('dayjs')
const getTextNode = require('../util').getTextNode

module.exports = class CtripFlightsPriceSpider {
  constructor(options, browser) {
    this.browser = browser
  }

  async getPage(date, flightLine) {
    const page = await this.browser.newPage()
    const productData = await new Promise((resolve, reject) => {
      page.on('response', async (response) => {
        const url = response.url()
        if (url.match(/api\/\w+\/products/)) {
          // 航班信息主数据接口
          if (response.status() === 200) {
            resolve(await response.text())
          }
        }
      })
      // 航班信息页面地址
      const url = `http://flights.ctrip.com/itinerary/oneway/${flightLine[0]}-${flightLine[1]}?date=${date}`
      page.goto(url, {
        timeout: 30000,
      }).catch(e => {
        resolve(null)
        logger.error(`打开${url}失败`, e)
      })
    })

    if (productData) {
      logger.info('获取到product接口信息', date, flightLine)
    } else {
      logger.error('获取到product接口信息失败', date, flightLine)
    }

    //const pageDocStr = await page.mainFrame().content()
    // 保存文件存档
/*    const nowTime = dayjs().format('YYYY-MM-DD-HH-mm-ss')
    const fileName = `[${flightLine[0]}-${flightLine[1]}][date=${date}][${nowTime}].html`
    fs.writeFile(`./test/${fileName}`, pageDocStr, (err) => {
      if (err) logger.error(`写入 ${fileName} 失败`, err)
      logger.all(`写入 ${fileName} 成功`);
    })*/
    const nowTime = dayjs().format('YYYY-MM-DD-HH-mm-ss')
    const fileName = `[${flightLine[0]}-${flightLine[1]}][date=${date}][${nowTime}].json`
    fs.writeFile(`./test/json/${fileName}`, productData, (err) => {
      if (err) logger.error(`写入 ${fileName} 失败`, err)
      logger.info(`保存productData,写入 ${fileName} 成功`);
    })
    await page.evaluate(() => window.stop());
    await page.waitFor(1000)
    await page.close()
    return productData
  }

  extraInfo(docStr) {
    const flightInfoList = []
    const $ = cheerio.load(docStr)
    const $searchresultContent = $('.searchresult_content')
    const $flightListDom = $('.search_box.search_box_tag.search_box_light.Label_Flight', $searchresultContent)
    if ($flightListDom.length === 0) {
      logger.info(`没有提取到直达航班`);
      return []
    }
    $flightListDom.each(function (index, ele) {
      const infoObj = {}
      // 航空公司名称
      const $airlineCompanyDom = $(this).find('.pubFlights-logo').parent()
      infoObj.airlineCompany = getTextNode($airlineCompanyDom).text()
      // 航班号
      infoObj.flightNo = $(this).find('.pubFlights-logo').parent().next().text()
      // 机型
      infoObj.planeType = $(this).find('.logo').children().eq(1).text().trim()
      // 起飞时间
      infoObj.startTime = $(this).find('.right strong.time').text().trim()
      // 起飞机场
      infoObj.startAirport = $(this).find('.right .airport').text().trim()
      // 降落时间
      infoObj.startTime = $(this).find('.left strong.time').text().trim()
      // 降落机场
      infoObj.startAirport = $(this).find('.left .airport').text().trim()
      // 价格
      const $priceDom = $(this).find('.price dfn').parent()
      infoObj.price = getTextNode($priceDom).text()

      flightInfoList.push(infoObj)
    })

    return flightInfoList
  }
}
