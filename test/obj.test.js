const a = '1'
const b = undefined

const obj = {a, b: function () {
  return this.a

  }}
const c = obj.b
console.log(c())
