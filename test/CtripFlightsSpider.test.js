const CtripFlightsPriceSpider = require('../src/spider/CtripFlightsSpider')
const config = require('../config.js')
const fs = require('fs')

const spider  = new CtripFlightsPriceSpider(config.ctripFlightsPriceSpider, null)



fs.readFile('./test/[tao-cgo][date=2019-01-07].html', async (err, data) => {
  if (err) throw err;
  let docStr = data

  const obj = spider.extraInfo(data)
  console.log(obj)
})
