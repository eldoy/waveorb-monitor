var monitor = require('../../index.js')

async function run() {
  var mem = monitor.mem()
  console.log(JSON.stringify(mem))
}

run()
