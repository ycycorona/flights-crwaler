const path = require('path')

const fs = require('fs-extra')

fs.ensureDir('./tmp/a', (err) => {
  if (err) console.log(err)
})

console.log(process.env.NODE_ENV)
process.env.NODE_ENV = 123
console.log(process.env.NODE_ENV)
