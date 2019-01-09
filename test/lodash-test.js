const _ = require('lodash')
const ob_1 = {a: '1'}
const ob_2 = {a: null}
const ob_3 = _.assignWith(ob_1, ob_2, (objVal, srcVal) => {
  return objVal ? objVal : srcVal
})
console.log(ob_3)
