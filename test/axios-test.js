const axios = require('../src/common/request/simulate-browser-axios')

const fs = require('fs')

const headers = {
  'Referer': 'http://flights.ctrip.com/itinerary/oneway/bhy-tao?date=2019-01-10',
  'Origin': 'http://flights.ctrip.com',
}

axios({
  method: 'POST',
  url: `http://flights.ctrip.com/itinerary/api/12808/products`,
  data: {"flightWay":"Oneway","classType":"ALL","hasChild":false,"hasBaby":false,"searchIndex":1,"airportParams":[{"dcity":"BHY","acity":"TAO","dcityname":"北海","acityname":"青岛","date":"2019-01-10","dcityid":189,"acityid":7}]},
  headers
})
  .then(function(response) {
    console.log(response.data.status)
  })
  .catch((err) => {
    console.log(err.message, err.request._headers)
  })
