module.exports = {
  axios: {
    useProxy: true,
    proxyProtocol: 'SOCKS5',
    proxyHost: '127.0.0.1',
    proxyPort: '10091',
  },
  chromeOptions: {
    ignoreHTTPSErrors: true,
    headless: true,
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
