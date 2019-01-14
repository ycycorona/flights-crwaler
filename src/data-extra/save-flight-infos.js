const logger = require('../common/logger')(__filename, 'save-flight-infos')
const dbConnect = require('../models/db-cennect')
const fs = require('fs-extra')
const FlightInfo = require('../models/flight-info')
const rd = require('rd')
const mongoose = require('mongoose')

;(async () => {
  try {
    await dbConnect()
    const path = 'D:\\code\\personal\\flights-crwaler\\data-save\\ctripFlightsPriceSpider\\[2019-01-10-15-57-39][1]'
    const rawFileList = await getRawFileList(path)
    logger.info(`文件数${rawFileList.length}`)
    for (const p of rawFileList) {
      const flightInfoList = await fs.readJson(p).catch(err => {
        logger.error(err)
      })

      for (const flightInfo of flightInfoList) {
        const doc = new FlightInfo(flightInfo)
        await doc.save().catch(err => {
          logger.error(err)
        })
        logger.info('保存成功', `${flightInfo.airlineName} ${flightInfo.arrivalDate}`)
      }
    }

    mongoose.connection.close()

  } catch (e) {
    logger.error(e)
  }

})()



/**
 * 获取原始的文件列表
 * @param srcDir
 * @returns {Promise<any>}
 */
function getRawFileList(srcDir) {
  return new Promise((resolve, reject) => {
    rd.readFile(srcDir, function (err, files) {
      if (err) {logger.info(err)}
      resolve(files || [])
    })
  })
}
