'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const flightRouteSchema = new Schema({
  departureAirportInfo: {
    airportTlc: {type: String},
    cityName: {type: String},
    cityTlc: {type: String},
    airportName: {type: String}
  },
  arrivalAirportInfo: {
    airportTlc: {type: String},
    cityName: {type: String},
    cityTlc: {type: String},
    airportName: {type: String}
  }
})


// Defines a pre hook for the document.
flightRouteSchema.pre('save', function(next) {

  next()
})


const flightRoute = mongoose.model('flight_routes', flightRouteSchema)

module.exports = flightRoute
