const path = require('path')
const logger = require('../common/logger')(__filename)
const getBrowser = require('../browser')
const util = require('../util')
const queue = require('async/queue')
const config = require('../../config')
const dayjs = require('dayjs')

const CtripFlightsPriceSpider = require('./CtripFlightsSpider')

module.exports = async () => {
  let error = null
  let retryTimes = 0
  let failTaskList = []
  let taskNumber = 0

  try {
    const {
      dateStart, // 开始时间
      dateEnd, // 结束时间
      flightLines // 航线列表
    } = config.ctripFlightsPriceSpider.params
    // 浏览器实例化
    const browser = await getBrowser(config.chromeOptions)
    // 爬虫实例初始化
    const spider = new CtripFlightsPriceSpider(config.ctripFlightsPriceSpider, browser)

    // 一些元数据
    const dateList = util.getDateList(dateStart, dateEnd) // 日期列表初始化

    // 任务的通用操作（尽量精简）
    const taskQueue = queue(async (task) => {
      logger.info(`当前并发任务数${taskQueue.running()}`, `待执行任务数${taskQueue.length()}`)
      //const getPageRes = await task.spider.getPage(task.date, task.flightLine)
      if(await task.productTaskDo()) {
        return true
      } else {
        throw new Error('任务执行结果失败')
      }
    }, 5)

    // 队列完成时的处理函数
    taskQueue.drain = async () => {
      logger.info('任务队列清空！')
      logger.info(`任务总数${taskNumber}，失败任务数${failTaskList.length}`)
      const _failTaskList = failTaskList
      failTaskList = []
      await util.sleep(1000)
      if (_failTaskList.length > 0 && retryTimes < 3) {
        retryTimes ++
        logger.info(`第${retryTimes}次重试失败任务`)
        for (const task of _failTaskList) {
          taskQueue.push(task, taskEndHandle)
        }
      } else {
        logger.info('任务执行完毕！！！')
        logger.info(`任务执行次数${retryTimes+1}`)
        logger.info(`任务总数${taskNumber}，最终失败任务数${_failTaskList.length}`)
        await browser.close()
      }
    }

    // 每个任务的 未捕获错误 处理函数
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
        logger.info('单条爬取成功')
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
      await browser.close()
    }
  } catch (e) {
    logger.error(e)
    error = e
  }

  if (error) {
    return false
  } else {
    return true
  }
}
