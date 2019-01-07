const CtripFlightsPriceSpider = require('../src/spider/CtripFlightsSpider')
const config = require('../config.js')
const logger = require('../src/common/logger')(__filename)
const fs = require('fs')
const getBrowser = require('../src/browser')






;(async () => {
  const browser = await getBrowser(config.chromeOptions)
  const spider  = new CtripFlightsPriceSpider(config.ctripFlightsPriceSpider, browser)

  await getPage()

  await browser.close()


  function parseDom() {
    fs.readFile('./test/[tao-cgo][date=2019-01-08].html', 'utf8', async (err, data) => {
      if (err) throw err;
      let docStr = data
      const obj = spider.extraInfo(data)
      console.log(obj)
    })
  }

  async function getPage() {
    const res = await spider.getPage('2019-01-15', ['bjs', 'sha'])
  }
})()


