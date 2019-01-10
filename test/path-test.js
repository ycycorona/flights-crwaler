const proc = require('./process-args-test')
const path = require('path')

const fs = require('fs-extra')

/*fs.ensureDir('./tmp/a', (err) => {
  if (err) console.log(err)
})

console.log(process.env.NODE_ENV)
global._gbVar =batch = 1
process.env.NODE_ENV = 123


console.log(batch)*/

fs.remove(path.join(process.cwd(), 'logs'))
  .then( () => {
    console.log('success')
  })

