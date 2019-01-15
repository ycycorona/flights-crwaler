const logger = require('../common/logger')(__filename)
const fs = require('fs-extra')
const path = require('path')
const cheerio = require('cheerio')
const axios = require('../common/request/simulate-browser-axios')
const dayjs = require('dayjs')
const getTextNode = require('../util').getTextNode
const config = require('../../config')
const FlightInfo = require('../models/flight-info')


module.exports = class CtripFlightsPriceSpider {
  constructor(options, browser) {
    this.browser = browser
    this.name = 'CtripFlightsPriceSpider'
  }

  // 获取请求token
  async getAjaxHeader(date, flightLine) {
    let flag = true
    let fileName
    const page = await this.browser.newPage().catch(err => {
      logger.error('创建新页面失败', err)
      flag = false
    })

    // await page.setRequestInterception(true);

    const productRequestBody = await new Promise((resolve, reject) => {
      page.on('response', async (response) => {
        const url = response.url()
        if (url.match(/api\/\w+\/products/)) {
          // 航班信息主数据接口
          if (response.status() === 200) {
            resolve(response.request())
          } else {
            resolve(null)
            logger.error(`${url}页面json获取失败`)
          }
        } else {

        }
      })
      page.on('requestfailed', (request) => {
        const url = request.url()
        if (url.match(/api\/\w+\/products/)) {
          resolve(null)
        } else {

        }
      })

      page.on('requestfinished', (request) => {
        const url = request.url()
        if (url.match(/api\/\w+\/products/)) {
        } else {

        }
      })

      page.on('request', async (request) => {
        const url = request.url()
        if (url.match(/api\/\w+\/products/)) {

        } else {

        }
      })
      // 航班信息页面地址
      const url = `http://flights.ctrip.com/itinerary/oneway/${flightLine[0]}-${flightLine[1]}?date=${date}`
      page.goto(url, {
        timeout: 30000,
      }).catch(e => {
        flag = false
        logger.error(`打开${url}失败`, e)
      })
    })

    if (productRequestBody) {
      logger.debug(productRequestBody)
    } else {
      flag = false
    }
    // 强制停止页面
    await page.evaluate(() => window.stop());
    // await page.waitFor(1000)
    await page.close()
    return {
      flag,
      productRequestBody
    }
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
            logger.error(`${url}页面json获取失败`)
          }
        } else {

        }
      })
      // 航班信息页面地址
      const url = `http://flights.ctrip.com/itinerary/oneway/${flightLine[0]}-${flightLine[1]}?date=${date}`
      page.goto(url, {
        timeout: 30000,
      }).catch(e => {
        logger.error(`打开${url}失败`, e)
      })
    })

    if (productData) {
      logger.debug('获取到product接口信息', date, flightLine)
      const nowTime = dayjs().format('YYYY-MM-DD-HH-mm-ss') // 获取当前时间
      fileName = `[${flightLine[0]}-${flightLine[1]}][date=${date}][${nowTime}]`
    } else {
      flag = false
      logger.error('获取到product接口信息失败', date, flightLine)
    }
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
  async getProduct(date, flightLine) {
    let flag = true
    let fileName
    const baseUrl = 'https://flights.ctrip.com/itinerary/api/12808/products'
    const requestData = {
      "flightWay": "Oneway",
      "classType": "ALL",
      "hasChild": false,
      "hasBaby": false,
      "searchIndex": 1,
      "airportParams": [{
        "dcity": flightLine[0],
        "acity": flightLine[1],
        "date": date,
        "aport": "",
        "aportname": ""
      }],
      "army": false,
    }
    const headers = {
      'Referer': `https://flights.ctrip.com/itinerary/oneway/${flightLine[0]}-${flightLine[1]}?date=${date}`,
      'Origin': 'https://flights.ctrip.com',
    }
    const productData = await new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: baseUrl,
        data: requestData,
        headers
      })
        .then(function(response) {
          if (!(response.data.status === 0 && response.data.data.error===null)) {
            flag = false
            //logger.error('直接请求getProduct失败', response.data.msg || response.data.data.error || '')
            logger.error('直接请求getProduct失败', response)
            resolve(null)
          } else {
            resolve(response.data)
          }
        })
        .catch((err) => {
          resolve(null)
          logger.error('直接请求getProduct失败', err)
        })
    })

    if (productData) {
      logger.debug('获取到product接口信息', date, flightLine)
      const nowTime = dayjs().format('YYYY-MM-DD-HH-mm-ss') // 获取当前时间
      fileName = `[${flightLine[0]}-${flightLine[1]}][date=${date}][getTime=${nowTime}]`
    } else {
      flag = false
      logger.error('获取product接口信息失败', date, flightLine)
    }

    return {
      flag,
      fileName,
      productData
    }
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
    if (getPageRes.productData instanceof String) {
      try{
        jsonObj = JSON.parse(getPageRes.productData)
      } catch (e) {
        logger.error(`解析${getPageRes.fileName}的productData失败`, e)
      }
    } else {
      jsonObj = getPageRes.productData
    }


    if (!(jsonObj.status === 0 && jsonObj.data.error===null)) {
      flag = false
    }

    if(flag) {
      const routeList = jsonObj.data.routeList ? jsonObj.data.routeList : []
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
      const rawDataPath = path.join(_gbVar.jsonSavePath, `${getPageRes.fileName}.json`)
      fs.writeFile(rawDataPath, JSON.stringify(flightInfoList), (err) => {
        if (err) logger.error(`写入 ${getPageRes.fileName} 失败`, err)
        logger.debug(`保存flightInfoList,写入 ${getPageRes.fileName} 成功`);
      })
    }

    return {flag, flightInfoList}
  }

  async saveFlightInfoToMongo(flightInfoList) {
    let flag = true
    let res
    try {
      const doc = new FlightInfo(flightInfoList[0])
      res = await doc.save()
    } catch (err) {
      flag = false
      logger.error('保存json到mongodb出错', err)
    }

    logger.debug('保存完毕')
    return {
      res,
      flag
    }
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
