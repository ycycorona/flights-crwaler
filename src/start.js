process.env.NODE_ENV = 'production'
const dayjs = require('dayjs')
const dbConnect = require('./models/db-cennect')
const ProcessState = require('./models/process-state')
const logger = require('./common/logger')(__filename)
const schedule = require('node-schedule');
const ctripFlightSpiderStarter = require('./spider/ctrip-flights-spider-starter');
const _gbVar = global._gbVar = {}

/*const j_1 = schedule.scheduleJob('50 59 23 * * *', async () => {
  try {
    _gbVar.batchCode = 0
  } catch (e) {
    logger.error(e)
  }
})*/



;(async () => {
  try {

    const db = await dbConnect()

    _gbVar.isJobProcessing = false

    const j = schedule.scheduleJob('1 0 0-23 * * *', async () => {
    //const j = schedule.scheduleJob('1,30 * * * * *', async () => {
      const processState = await ProcessState.initProcessState()
      _gbVar.batchCode = processState.batchCode
      try {
        if (_gbVar.isJobProcessing === true) {
          return
        }

        logger.info(`内存使用量：${JSON.stringify(process.memoryUsage())}`)
        const jobStartTimeObj = _gbVar.taskStartTimeObj = dayjs()
        _gbVar.taskStartTime = jobStartTimeObj.format('YYYY-MM-DD-HH-mm-ss') // 获取当前时间
        _gbVar.taskStartDate = jobStartTimeObj.format('YYYY-MM-DD') // 获取当前日期
        _gbVar.isJobProcessing = true
        const res = await ctripFlightSpiderStarter()
        const jobFinishTimeObj = dayjs()
        const jobDuration = jobFinishTimeObj.diff(jobStartTimeObj, 'second')
        logger.info(`定时任务执行时间${jobDuration}`)
      } catch (e) {
        logger.error(e)
      }
      _gbVar.isJobProcessing = false
    })

    setInterval(() => {
      logger.info(`存活检测`)
      logger.info(`当前batchCode: ${_gbVar.batchCode}, 当前是否正在工作：${_gbVar.isJobProcessing}`)
    }, 300000)

  } catch (e) {
    logger.error(e)
  }
})()


