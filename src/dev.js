process.env.NODE_ENV = 'development'
const dayjs = require('dayjs')
const logger = require('./common/logger')(__filename)
const schedule = require('node-schedule');
const promisify = require('util').promisify
const dbConnect = require('./models/db-cennect')
const ProcessState = require('./models/process-state')
const ctripFlightSpiderStarter = require('./spider/ctrip-flights-spider-starter');
const _gbVar = global._gbVar = {}


/*  ;(async () => {
  try {
    await dbConnect()

    //const doc = await ProcessState.initProcessState()
    //const doc_1 = await ProcessState.getProcessState().filter()
    const doc = await ProcessState.getProcessState()
    console.log(doc)
    doc.batchCode ++
    await doc.save()

    process.exit(0)
  } catch (e) {
    logger.error(e)
  }
  process.exit(0)
  })()*/






/*const j = schedule.scheduleJob('1 * * * * *', async () => {
  try {
    logger.info(`内存使用量：${JSON.stringify(process.memoryUsage())}`)
    const nowObj = _gbVar.taskStartTimeObj = dayjs()
    _gbVar.taskStartTime = nowObj.format('YYYY-MM-DD-HH-mm-ss') // 获取当前时间
    _gbVar.taskStartDate = nowObj.format('YYYY-MM-DD') // 获取当前日期
    _gbVar.isJobProcessing = true
    _gbVar.bachCode ++
    const res = await ctripFlightSpiderStarter()
  } catch (e) {
    logger.error(e)
  }
  _gbVar.isJobProcessing = false
})*/



;(async () => {
  const db = await dbConnect()
  const processState = await ProcessState.initProcessState()
  _gbVar.batchCode = processState.batchCode
  _gbVar.isJobProcessing = false

  logger.info(`内存使用量：${JSON.stringify(process.memoryUsage())}`)
  const jobStartTimeObj = _gbVar.taskStartTimeObj = dayjs()
  _gbVar.taskStartTimeObj = jobStartTimeObj
  _gbVar.taskStartTime = jobStartTimeObj.format('YYYY-MM-DD-HH-mm-ss') // 获取当前时间
  _gbVar.taskStartDate = jobStartTimeObj.format('YYYY-MM-DD') // 获取当前日期

  try {
    const res = await ctripFlightSpiderStarter()
    const jobFinishTimeObj = dayjs()
    const jobDuration = jobFinishTimeObj.diff(jobStartTimeObj, 'second')
    logger.info(`定时任务执行时间${jobDuration}`)
    await db.close()
  } catch (e) {
    logger.error(e)
  }
})()


