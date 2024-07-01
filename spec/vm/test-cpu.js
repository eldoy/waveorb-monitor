var monitor = require('../../index.js')

async function run() {
  var cpu = monitor.cpu()
  console.log(cpu)
}

run()
