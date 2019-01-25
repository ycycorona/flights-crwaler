process.env.NODE_ENV = 'development'
const logger = require('../common/logger')(__filename, 'save-flight-infos')
const dbConnect = require('../models/db-cennect')
const fs = require('fs-extra')
const FlightRoute = require('../models/flight-route')
const FlightInfo = require('../models/flight-info')
const mongoose = require('mongoose')

const flightRoutes = [
    ['hrb', 'tao'],
    ['tao', 'hrb'],
    ['zha', 'tao'],
    ['tao', 'zha'],
    ['kry', 'tao'],
    ['tao', 'kry'],
    ['zyi', 'tao'],
    ['tao', 'zyi'],
    ['kwe', 'tao'],
    ['tao', 'kwe'],
    ['lhw', 'tao'],
    ['tao', 'lhw'],
    ['bhy', 'tao'],
    ['tao', 'bhy'],
    ['ckg', 'tao'],
    ['tao', 'ckg'],
    ['kmg', 'tao'],
    ['tao', 'kmg'],
    ['kwl', 'tao'],
    ['tao', 'kwl'],
    ['cgq', 'ynt'],
    ['ynt', 'cgq'],
    ['kwl', 'ynt'],
    ['ynt', 'kwl'],
    ['wnz', 'ynt'],
    ['ynt', 'wnz'],
    ['urc', 'tao'],
    ['tao', 'urc'],
    ['nng', 'tao'],
    ['tao', 'nng'],
    ['cgq', 'tao'],
    ['tao', 'cgq'],
    ['she', 'tao'],
    ['tao', 'she'],
    ['pvg', 'tao'],
    ['tao', 'pvg'],
    ['csx', 'tao'],
    ['tao', 'csx'],
    ['ctu', 'tao'],
    ['tao', 'ctu'],
    ['kwl', 'wnz'],
    ['wnz', 'kwl'],
    ['ynt', 'csx'],
    ['csx', 'ynt'],
    ['kwe', 'wnz'],
    ['wnz', 'kwe'],
    ['jjn', 'hrb'],
    ['hrb', 'jjn'],
    ['nng', 'cgq'],
    ['cgq', 'nng'],
    ['hak', 'cgq'],
    ['cgq', 'hak']
  ]

;(async () => {
try {
await dbConnect()

logger.info(`航线总数${flightRoutes.length}`)

for (const flightRoute of flightRoutes) {
  const flightInfoDoc = await FlightInfo.findOne({
    'departureAirportInfo.airportTlc':flightRoute[0].toUpperCase(),
    'arrivalAirportInfo.airportTlc': flightRoute[1].toUpperCase()
  })
  logger.info(`${flightInfoDoc.departureAirportInfo.airportTlc}-${flightInfoDoc.arrivalAirportInfo.airportTlc}`)
  let doc
  if (flightInfoDoc) {
    doc = new FlightRoute({
      departureAirportInfo: {
        airportTlc: flightInfoDoc.departureAirportInfo.airportTlc,
        cityName: flightInfoDoc.departureAirportInfo.cityName,
        cityTlc: flightInfoDoc.departureAirportInfo.cityTlc,
        airportName: flightInfoDoc.departureAirportInfo.airportName,
      },
      arrivalAirportInfo: {
        airportTlc: flightInfoDoc.arrivalAirportInfo.airportTlc,
        cityName: flightInfoDoc.arrivalAirportInfo.cityName,
        cityTlc: flightInfoDoc.arrivalAirportInfo.cityTlc,
        airportName: flightInfoDoc.arrivalAirportInfo.airportName,
      }
    })
  }


  await doc.save().catch(err => {
    logger.error(err)
  })
  logger.info('保存成功', `${flightRoute}`)
}

mongoose.connection.close()

} catch (e) {
logger.error(e)
}

})()



