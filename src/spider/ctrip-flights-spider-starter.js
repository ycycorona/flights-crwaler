const path = require('path')
const logger = require('../common/logger')(__filename)
const getBrowser = require('../browser')
const util = require('../util')
const queue = require('async/queue')
const config = require('../../config')


const CtripFlightsPriceSpider = require('./CtripFlightsSpider')

module.exports = async () => {
  let error = null
  try {
    const {
      dateStart,
      dateEnd,
      flightLines
    } = config.ctripFlightsPriceSpider.params
    const browser = await getBrowser(config.chromeOptions)
/*    if (!browser) {
      return false
    }*/
    const spider = new CtripFlightsPriceSpider(config.ctripFlightsPriceSpider, browser)
    const dateList = util.getDateList(dateStart, dateEnd)

    const taskQueue = queue(async (task) => {
      logger.info('当前任务并发数',taskQueue.running())
      logger.info('待执行任务数',taskQueue.length())
      const getPageRes = await task.spider.getPage(task.date, task.flightLine)
      // 判断是否成功返回数据
      if (! (getPageRes && getPageRes.flag)) {
        return false
      }
      const extraRes = task.spider.extraInfoFromJson(getPageRes)
      return true
    }, 5)
    taskQueue.drain = async () => {
      logger.info('all items have been processed');
      await browser.close()
    }
    taskQueue.error = function(error, task) {
      logger.all('onError', error);
    }

    for (const flightLine of flightLines) {
      for (const date of dateList) {
        // await spider.getPage(date, flightLine)
        taskQueue.push({spider, date, flightLine}, function (err, res) {
          if (err) {
            logger.error('任务失败', err)
          } else {
            logger.info('任务成功', err, res)
          }
        })
      }
    }
    logger.info(`队列长度${taskQueue.length()}`)
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
