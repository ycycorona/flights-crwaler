const ctripFlightSpiderStarter = require('./spider/ctrip-flights-spider-starter');
const logger = require('./common/logger')(__filename)
const config = require('../config')
;(async () => {
  try {
    const res = await ctripFlightSpiderStarter()
  } catch (e) {
    logger.error(e)
  }
})()


