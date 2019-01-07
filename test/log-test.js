const log4js = require('log4js');
log4js.configure('log4js.json');
const path = require('path')
const logger = log4js.getLogger()
logger.addContext('filePath', path.relative(process.cwd(), __filename))





logger.info(123)
