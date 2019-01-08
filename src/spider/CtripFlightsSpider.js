const logger = require('../common/logger')(__filename)
const fs = require('fs')
const cheerio = require('cheerio')
const dayjs = require('dayjs')
const getTextNode = require('../util').getTextNode

module.exports = class CtripFlightsPriceSpider {
  constructor(options, browser) {
    this.browser = browser
    this.name = 'CtripFlightsPriceSpider'
  }
  async sayName() {
    const page = await this.browser.newPage().catch(err => {
      logger.error('创建新页面失败', err)
    })
    return !!page
  }

  /**
   * 获取页面 获取json
   * @param date
   * @param flightLine
   * @returns {Promise<{fileName: string, flag: boolean, productData: any}>}
   */
  async getPage(date, flightLine) {
    let flag = true
    let fileName
    const page = await this.browser.newPage().catch(err => {
      logger.error('创建新页面失败', err)
      flag = false
    })
    const productData = await new Promise((resolve, reject) => {
      page.on('response', async (response) => {
        const url = response.url()
        if (url.match(/api\/\w+\/products/)) {
          // 航班信息主数据接口
          if (response.status() === 200) {
            resolve(await response.text())
          } else {
            resolve(null)
            logger.error(`${url}页面json解析失败`)
          }
        } else {

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
      const nowTime = dayjs().format('YYYY-MM-DD-HH-mm-ss') // 获取当前时间
      fileName = `[${flightLine[0]}-${flightLine[1]}][date=${date}][${nowTime}].json`
/*
      fileName = `[${flightLine[0]}-${flightLine[1]}][date=${date}][${nowTime}].json`
      // 本地储存获取到的json
      fs.writeFile(`./test/json/${fileName}`, productData, (err) => {
        if (err) logger.error(`写入 ${fileName} 失败`, err)
        logger.info(`保存productData,写入 ${fileName} 成功`);
      })*/
    } else {
      flag = false
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
    // 强制停止页面
    await page.evaluate(() => window.stop());
    // await page.waitFor(1000)
    await page.close()
    return {
      flag,
      fileName,
      productData
    }
  }
  async getProduct() {

  }
  /**
   * 从ajax JSON提取数据
   * @param getPageRes
   * @returns {{flag: boolean, flightInfoList: Array}}
   */
  extraInfoFromJson(getPageRes) {
    let flag = true
    const flightInfoList = []
    let jsonObj
    try{
      jsonObj = JSON.parse(getPageRes.productData)
    } catch (e) {
      logger.error(`解析${getPageRes.fileName}的productData失败`, e)
    }

    if (!(jsonObj.status === 0 && jsonObj.data.error===null)) {
      flag = false
    }

    if(flag) {
      const routeList = jsonObj.data.routeList
      for (const route of routeList) {
        if (route.routeType === 'Flight') {
          const flightInfo = {}
          const info = route.legs[0].flight
          flightInfo.airlineName = info.airlineName
          flightInfo.airlineCode = info.airlineCode
          flightInfo.craftTypeName = info.craftTypeName
          flightInfo.flightNumber = info.flightNumber
          flightInfo.departureAirportInfo = info.departureAirportInfo
          flightInfo.arrivalAirportInfo = info.arrivalAirportInfo
          flightInfo.departureDate = info.departureDate
          flightInfo.arrivalDate = info.arrivalDate
          flightInfo.stopInfo = info.stopInfo
          flightInfo.cabins = []
          for (const ca of route.legs[0].cabins) {
            const cabin = {}
            cabin.salePrice = ca.price.salePrice
            cabin.price = ca.price.price
            cabin.cabinClass = ca.cabinClass
            cabin.priceClass = ca.priceClass
            cabin.rate = ca.price.rate
            cabin.seatCount = ca.seatCount
            cabin.refundEndorse = ca.refundEndorse
            cabin.productInfoList = ca.productInfoList
            flightInfo.cabins.push(cabin)
          }

          flightInfoList.push(flightInfo)
        }
      }
    }

    if (flag) {
      const nowTime = dayjs().format('YYYY-MM-DD-HH-mm-ss') // 获取当前时间
      fs.writeFile(`./test/json/${getPageRes.fileName}`, JSON.stringify(flightInfoList), (err) => {
        if (err) logger.error(`写入 ${getPageRes.fileName} 失败`, err)
        logger.info(`保存flightInfoList,写入 ${getPageRes.fileName} 成功`);
      })
    }

    return {flag, flightInfoList}
  }

  extraInfoFromPage(docStr) {
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
