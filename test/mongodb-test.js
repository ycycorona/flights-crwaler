const logger = require('../src/common/logger')(__filename)
const dbConnect = require('../src/models/db-cennect')
const fs = require('fs-extra')
const FlightInfo = require('../src/models/flight-info')

;(async () => {
  try {
    await dbConnect()
    const path = 'D:\\code\\personal\\flights-crwaler\\data-save\\ctripFlightsPriceSpider\\[2019-01-10-15-57-39][1]\\[tao-zha][date=2019-01-12][getTime=2019-01-10-15-57-50].json'
    const flightInfoList = await fs.readJson(path)
      .catch(err => {
        console.error(err)
      })
    flightInfoList.forEach(async (item) => {
      const doc = new FlightInfo(item)
      const res = await doc.save()
      console.log('保存成功',res)
    })
  } catch (e) {
    logger.error(e)
  }

})()
