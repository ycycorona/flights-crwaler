const ctripFlightSpiderStarter = require('./spider/ctrip-flights-spider-starter');
const logger = require('./common/logger')(__filename)

;(async () => {
  try {
  const res = await ctripFlightSpiderStarter()
  } catch (e) {
    console.log(e)
  }
})()


