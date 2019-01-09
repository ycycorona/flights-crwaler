const ctripFlightSpiderStarter = require('./spider/ctrip-flights-spider-starter');
const logger = require('./common/logger')(__filename)
const dayjs = require('dayjs')

const nowObj = dayjs()
const _gbVar = global._gbVar = {}
_gbVar.taskStartTime = nowObj.format('YYYY-MM-DD-HH-mm-ss') // 获取当前时间
_gbVar.taskStartDate = nowObj.format('YYYYMMDD') // 获取当前日期
_gbVar.bachCode = 1

;(async () => {
  try {
    const res = await ctripFlightSpiderStarter()
  } catch (e) {
    logger.error(e)
  }
})()


