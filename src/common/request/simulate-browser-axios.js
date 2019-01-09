const simulateBrowser = require('./plugins/simulate-browser')
const interHandleError = require('./interceptors/handle-error.js')
const options = {
  headers: simulateBrowser().headers,
  interceptors: [interHandleError]
}
const axios = require('./axios_creator.js')(options)
module.exports = axios
