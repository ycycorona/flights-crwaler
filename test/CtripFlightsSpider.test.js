const CtripFlightsPriceSpider = require('../src/spider/CtripFlightsSpider')
const config = require('../config/config.default.js')
const logger = require('../src/common/logger')(__filename)
const fs = require('fs')
const getBrowser = require('../src/browser')

;(async () => {
  const browser = await getBrowser(config.chromeOptions)
  const spider  = new CtripFlightsPriceSpider(config.ctripFlightsPriceSpider, browser)
  await getPage()
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

  async function getPage() {
    const res = await spider.getPage('2019-01-15', ['bjs', 'sha'])
  }
})()


