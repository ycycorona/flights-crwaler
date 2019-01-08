module.exports = {
  useProxy: true,
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
      dateStart: '2019-01-10',
      dateEnd: '2019-01-10',
      flightLines: [
        ['hrb', 'tao'],
/*        ['tao', 'hrb'],
        ['zha', 'tao'],
        ['tao', 'zha'],
        ['kry', 'tao'],
        ['tao', 'kry'],
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
        ['tao', 'ckg'],
        ['lhw', 'tao'],
        ['tao', 'lhw'],
        ['kmg', 'tao'],
        ['tao', 'kmg'],
        ['kwe', 'tao'],
        ['tao', 'kwe'],
        ['kwl', 'tao'],
        ['tao', 'kwl'],
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
        ['cgq', 'hak']*/]

    }
  }
}