const path = require('path')
const ctripFlightSpiderStarter = require('./spider/ctrip-flights-spider-starter');
const log4js = require('log4js');
log4js.configure('log4js.json');
const logger = log4js.getLogger();
logger.addContext('filePath', path.relative(process.cwd(), __filename))

;(async () => {
  try {
    //logger.error('1', '2')
  const res = await ctripFlightSpiderStarter()
  } catch (e) {
    console.log(e)
  }
})()


