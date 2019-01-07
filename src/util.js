const dayjs = require('dayjs')

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
  }
}
