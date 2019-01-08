const dayjs = require('dayjs')
const day_1 = dayjs('2019-01-07')
const day_2 = dayjs('2019-01-14')
const diff = day_2.diff(day_1, 'day')

console.log(day_1.add(1, 'day').format('YYYY-MM-DD'))
console.log(diff)
console.log(process.env.NODE_ENV)

process.exit(0)
