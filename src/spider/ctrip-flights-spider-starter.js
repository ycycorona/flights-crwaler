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
      dateStart, // 开始时间
      dateEnd, // 结束时间
      flightLines // 航线列表
    } = config.ctripFlightsPriceSpider.params

    const browser = await getBrowser(config.chromeOptions)

    const spider = new CtripFlightsPriceSpider(config.ctripFlightsPriceSpider, browser) // 爬虫实例初始化
    const dateList = util.getDateList(dateStart, dateEnd) // 日期列表初始化

    const taskQueue = queue(async (task) => {
      logger.info('当前任务并发数',taskQueue.running())
      logger.info('待执行任务数',taskQueue.length())
      //const getPageRes = await task.spider.getPage(task.date, task.flightLine)

      const url = 'http://flights.ctrip.com/itinerary/api/12808/products'
      const reqData = {
        "flightWay": "Oneway",
        "classType": "ALL",
        "hasChild": false,
        "hasBaby": false,
        "searchIndex": 1,
        "airportParams": [{
          "dcity": "bhy",
          "acity": "sha",
          "dcityname": "北海",
          "acityname": "上海",
          "date": "2019-01-10",
          "aport": "",
          "aportname": ""
        }],
        "army": false,
      }
      reqData.airportParams.dcity = task.flightLine[0]
      reqData.airportParams.acity = task.flightLine[1]
      reqData.airportParams.date = task.date
      const headers = {
        'Referer': `http://flights.ctrip.com/itinerary/oneway/${task.flightLine[0]}-${task.flightLine[1]}?date=${task.date}`,
        'Origin': 'http://flights.ctrip.com',
      }
      const getPageRes = await task.spider.getProduct(task.date, task.flightLine, url, headers, reqData)
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
            logger.error('单条爬取失败', err)
          } else {
            logger.info('单条爬取成功', err, res)
          }
        })
      }
    }
    logger.info(`队列长度${taskQueue.length()}`)
    if (taskQueue.length() === 0) {
      logger.info(`队列为空，结束爬虫任务`)
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
