const path = require('path')

const fs = require('fs-extra')

fs.ensureDir('./tmp/a', (err) => {
  if (err) console.log(err)
})
