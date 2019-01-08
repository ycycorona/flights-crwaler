const queue = require('async/queue');

const q = queue(async (task) => {
  const res = await task()
  return res
}, 5)

q.drain = function() {
  console.log('all items have been processed');
}

q.error = function(error, task) {
  console.log('onError', error, task);
}

for(let i=0; i<50; i++) {
  q.push(async () => {
      const interval = Math.ceil(Math.random()*10) * 1000
      return await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (interval>=5000) {
            resolve(interval)
          } else {
            reject(interval)
          }

        }, interval)})
    }
    , function(err, res) {
        if(err) {
          console.log('reject', err, res)
        } else {
          console.log('resolve', err, res)
        }

    });
}

const intervalTag = setInterval(()=> {
  const list = q.workersList()
  //console.log(`当前并行数${list}`)
}, 1000)





