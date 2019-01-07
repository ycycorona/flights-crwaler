const fs = require('fs')
fs.readFile('./meta/flight-schedule.json', 'utf8', async (err, data) => {
  if (err) throw err;
  let obj = JSON.parse(data)

  const list = []
  for (const item of obj) {
    list.push([item.originAirportCode3.toLowerCase(), (item.arri2AirportCode3 || item.arri1AirportCode3).toLowerCase()])
  }
  console.log(list)
})
