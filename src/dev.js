const ctripFlightSpiderStarter = require('./spider/ctrip-flights-spider-starter');
const logger = require('./common/logger')(__filename)
process.env.NODE_ENV = 'development'
const config = require('../config/config.dev.js')
;(async () => {
  try {
  const res = await ctripFlightSpiderStarter(config)
  } catch (e) {
    console.log(e)
  }
})()


