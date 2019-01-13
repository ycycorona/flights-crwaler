process.env.NODE_ENV = 'production'
const dayjs = require('dayjs')

const logger = require('./common/logger')(__filename)
const schedule = require('node-schedule');
const ctripFlightSpiderStarter = require('./spider/ctrip-flights-spider-starter');
const _gbVar = global._gbVar = {}

_gbVar.bachCode = 0
_gbVar.isJobProcessing = false

const j = schedule.scheduleJob('0 0 0-23 * * *', async () => {
    try {
      if (_gbVar.isJobProcessing === true) {
        return
      }

      logger.info(`内存使用量：${JSON.stringify(process.memoryUsage())}`)
      const jobStartTimeObj = _gbVar.taskStartTimeObj = dayjs()
      _gbVar.taskStartTime = jobStartTimeObj.format('YYYY-MM-DD-HH-mm-ss') // 获取当前时间
      _gbVar.taskStartDate = jobStartTimeObj.format('YYYY-MM-DD') // 获取当前日期
      _gbVar.isJobProcessing = true
      _gbVar.bachCode ++
      const res = await ctripFlightSpiderStarter()
      const jobFinishTimeObj = dayjs()
      const jobDuration = jobFinishTimeObj.diff(jobStartTimeObj, 'second')
      logger.info(`定时任务执行时间${jobDuration}`)
    } catch (e) {
      logger.error(e)
    }
    _gbVar.isJobProcessing = false
  })

const j_1 = schedule.scheduleJob('50 59 23 * * *', async () => {
  try {
    _gbVar.bachCode = 0
  } catch (e) {
    logger.error(e)
  }
})



/*;(async () => {
  try {
    const res = await ctripFlightSpiderStarter()
  } catch (e) {
    logger.error(e)
  }
})()*/


