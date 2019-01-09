const path = require('path')
const config = require(path.join(process.cwd(), 'config'))

module.exports = (options) => {
  const axios = require('axios');
  const axiosOpts = {}
  axiosOpts.timeout = options.timeout || 40000
  axiosOpts.headers = options.headers || {}

  if (config.axios && config.axios.useProxy) {
    const ProxyAgent = require('proxy-agent');
    const proxyHost = config.axios.proxyHost
    const proxyPort = config.axios.proxyPort;
    const proxyProtocol = config.axios.proxyProtocol
    const proxyOptions = `${proxyProtocol}://${proxyHost}:${proxyPort}`;
    axiosOpts.httpAgent = new ProxyAgent(proxyOptions);
    axiosOpts.httpsAgent = new ProxyAgent(proxyOptions);
  }

  const axiosInstance = axios.create(axiosOpts)

  if (options.interceptors instanceof Array && options.interceptors.length > 0) {
    const interceptors = options.interceptors
    for (const inter of interceptors) {
      inter.call(axiosInstance)
    }
  }
  return axiosInstance;
}
