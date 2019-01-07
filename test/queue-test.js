const queue = require('async/queue');

const q = queue(async (task, callback) => {
  const res = await task()

  if (res === 'resolve') {
    callback()
  } else {
    callback(new Error('错误'))
  }

}, 2)

q.drain = function() {
  console.log('all items have been processed');
}

q.push(async function f() {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('resolve')
    }, 2000)
  } )
}, function(err) {
  if (err) {
    console.log(err)
  }
});


