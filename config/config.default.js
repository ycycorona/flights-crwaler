module.exports = {
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
