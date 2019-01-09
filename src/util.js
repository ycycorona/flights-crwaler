const dayjs = require('dayjs')
const logger = require('./common/logger')(__filename)
module.exports = {
  getDateList(dateStartStr, dateEndStr) {
    const dataList = []
    const dateStart = dayjs(dateStartStr)
    const dateEnd = dayjs(dateEndStr)
    const diffDays = dateEnd.diff(dateStart, 'day')
    for (let i=0; i<=diffDays; i++) {
      dataList.push(dateStart.add(i, 'day').format('YYYY-MM-DD'))
    }
    return dataList
  },
  getTextNode(obj) {
    return obj.contents().filter((index, content) => {
      return content.nodeType === 3
    })
  },
  sleep(delay) {
    return new Promise((resolve, reject) => {
      logger.info(`等待${delay}ms`)
      setTimeout(() => resolve(), delay)
    })
  }
}
