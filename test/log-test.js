const log4js = require('log4js');
log4js.configure('log4js.json');
const path = require('path')
const logger = require('../src/common/logger')(__filename)


logger.all(123)


logger.info(123)
