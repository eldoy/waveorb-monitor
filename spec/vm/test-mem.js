var monitor = require('../../index.js')

async function run() {
  var mem = monitor.mem()
  console.log(mem)
}

run()
