const path = require('path')
const fs = require('fs-extra')
const logger = require('../common/logger')(__filename)
const getBrowser = require('../browser')
const util = require('../util')
const queue = require('async/queue')
const config = require('../../config')
const dayjs = require('dayjs')
//const _gbVar = global._gbVar
const CtripFlightsPriceSpider = require('./CtripFlightsSpider')

module.exports = async () => {
  let retryTimes = 0
  let failTaskList = []
  let taskNumber = 0
  let browser
return new Promise(async (resolve, reject) => {
  try {
    const {
      flightLines, // 航线列表
      duration,
    } = config.ctripFlightsPriceSpider.params
    // 浏览器实例化
    browser = null //await getBrowser(config.chromeOptions)
    // 爬虫实例初始化
    const spider = new CtripFlightsPriceSpider(config.ctripFlightsPriceSpider, browser)
    // 保存路径初始化
    const jsonSavePath = path.join(process.cwd(), 'data-save/ctripFlightsPriceSpider',
      `[${_gbVar.taskStartTime}][${_gbVar.batchCode}]`,)
    _gbVar.jsonSavePath = jsonSavePath
    logger.info(`当前批次[${_gbVar.taskStartTime}][${_gbVar.batchCode}]`)
    await fs.ensureDir(jsonSavePath)
    // 一些元数据
    const dateStart = dayjs().format('YYYY-MM-DD')
    const dateEnd = dayjs().add(duration-1, 'day').format('YYYY-MM-DD')
    const dateList = util.getDateList(dateStart, dateEnd) // 日期列表初始化
    //throw new Error('test')
    // 任务的通用操作（尽量精简）
    const taskQueue = queue(async (task) => {
      logger.debug(`当前并发任务数${taskQueue.running()}`, `待执行任务数${taskQueue.length()}`)
      //const getPageRes = await task.spider.getPage(task.date, task.flightLine)
      if(await task.productTaskDo()) {
        return true
      } else {
        throw new Error('任务执行结果失败')
      }
    }, 5)

    // 队列完成时的处理函数
    taskQueue.drain = async () => {
      logger.info('任务队列放空！')
      logger.info(`任务总数${taskNumber}，失败任务数${failTaskList.length}`)
      const _failTaskList = failTaskList
      failTaskList = []
      if (_failTaskList.length > 0 && retryTimes < 3) {
        retryTimes ++
        await util.sleep(1000)
        logger.info(`第${retryTimes}次重试失败任务`)
        for (const task of _failTaskList) {
          taskQueue.push(task, taskEndHandle)
        }
      } else {
        logger.info('任务执行完毕！！！')
        logger.info(`任务执行次数${retryTimes+1}`)
        logger.info(`任务总数${taskNumber}，最终失败任务数${_failTaskList.length}`)
        if (browser) {
          await browser.close()
          resolve(true)
        }
        resolve(true)
      }
    }

    // 每个任务的 错误 处理函数
    taskQueue.error = function(error, task) {
      logger.error('error in task', error);
      logger.error(`错误的任务为：${task.toString()}`);
      failTaskList.push(task)
    }

    /**
     * 任务的后处理函数
     * @param err
     * @param res
     */
    function taskEndHandle(err, res) {
      if (!err) {
        logger.debug('单条爬取成功')
      }
    }

    /**
     * 任务处理函数
     * @returns {Promise<boolean>}
     */
    async function productTaskDo() {
      const getPageRes = await this.spider.getProduct(this.date, this.flightLine)
      // 判断是否成功返回数据
      if (! (getPageRes && getPageRes.flag)) {
        return false
      }
      const extraRes = this.spider.extraInfoFromJson(getPageRes)
      const saveJson = await this.spider.saveFlightInfoToMongo(extraRes.flightInfoList)
      return true
    }

    // 任务入列
    for (const flightLine of flightLines) {
      for (const date of dateList) {
        const productTask = {
          date,
          flightLine,
          productTaskDo,
          spider,
          toString() {
            return `[${this.flightLine[0]}-${this.flightLine[1]}][date=${this.date}][${dayjs().format('YYYY-MM-DD-HH-mm-ss')}]`
          }
        }
        taskQueue.push(productTask, taskEndHandle)
      }
    }

    logger.info(`队列长度${taskQueue.length()}`)
    taskNumber = taskQueue.length()

    if (taskQueue.length() === 0) {
      logger.info(`队列为空，直接结束爬虫任务`)
      if (browser) {
        await browser.close()
      }
      resolve(true)
    }
  } catch (e) {
    logger.error(e)
    if (browser) {
      await browser.close()
    }
    resolve(false)
  }
})

}
