module.exports = {
  useProxy: true,
  proxyProtocol: 'SOCKS5',
  proxyHost: '127.0.0.1',
  proxyPort: '10099',
  chromeOptions: {
    ignoreHTTPSErrors: true,
    headless: true,
    args: ['--proxy-server=socks5://127.0.0.1:10091'],
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  },
  ctripFlightsPriceSpider: {
    params: {
      baseUrl: 'http://flights.ctrip.com/itinerary/',
      dateStart: '2019-01-07',
      dateEnd: '2019-01-14',
      flight: [['tao', 'cgo']]
    }
  }
}
