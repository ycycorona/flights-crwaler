const CtripFlightsPriceSpider = require('../src/spider/CtripFlightsSpider')
const config = require('../config')
const logger = require('../src/common/logger')(__filename)
const fs = require('fs')
const getBrowser = require('../src/browser')

;(async () => {
  const browser = await getBrowser(config.chromeOptions)
  const spider  = new CtripFlightsPriceSpider(config.ctripFlightsPriceSpider, browser)
  //await getAjaxHeaderTest()
  await getProduct()
    .then((res) => {
      console.log(res)
    })
  //await getPage()
/*  const flightInfoList = await extraInfoFromJsonTest()
  logger.info(flightInfoList)*/
  await browser.close()

  function parseDom() {
    fs.readFile('./test/[tao-cgo][date=2019-01-08].html', 'utf8', async (err, data) => {
      if (err) throw err;
      let docStr = data
      const obj = spider.extraInfoFromPage(data)
      console.log(obj)
    })
  }

  function extraInfoFromJsonTest() {
    return new Promise((resolve, reject) => {
      fs.readFile('./test/json/[bhy-tao][date=2019-01-09][2019-01-08-11-37-35].json', 'utf8', (err, data) => {
        if (err) throw err;
        const jsonStr = data
        const obj = spider.extraInfoFromJson({productData: jsonStr})
        resolve(obj)
      })
    })
  }

  async function getAjaxHeaderTest() {
    const obj = await spider.getAjaxHeader('2019-01-15', ['bjs', 'sha'])
    //const obj_1 = await spider.getAjaxHeader('2019-01-15', ['bjs', 'sha'])
    console.log(obj)
  }

  async function getPage() {
    const res = await spider.getPage('2019-01-15', ['bjs', 'sha'])
  }

  async function getProduct() {
    const headers = {
      'Referer': 'http://flights.ctrip.com/itinerary/oneway/sha-nkg?date=2019-01-19',
      'Origin': 'http://flights.ctrip.com',
    }
    const url = 'http://flights.ctrip.com/itinerary/api/12808/products'
    const reqData = {
      "flightWay": "Oneway",
      "classType": "ALL",
      "hasChild": false,
      "hasBaby": false,
      "searchIndex": 1,
      "airportParams": [{
        "dcity": "bhy",
        "acity": "sha",
        "dcityname": "北海",
        "acityname": "上海",
        "date": "2019-01-10",
        "aport": "",
        "aportname": ""
      }],
      "army": false,
    }
    const obj = await spider.getProduct('2019-01-19', ['bhy', 'sha'], url, headers, reqData)
    return obj
  }
})()


