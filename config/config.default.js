module.exports = {
  useProxy: false,
  proxyProtocol: 'SOCKS5',
  proxyHost: '127.0.0.1',
  proxyPort: '10091',
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
      baseUrl: 'https://flights.ctrip.com/itinerary/',
      dateStart: '',
      dateEnd: '',
      flightLines: []
    }
  }
}
