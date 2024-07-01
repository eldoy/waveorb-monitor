var monitor = require('../../index.js')

async function run() {
  var stats = monitor.stats()
  console.log(JSON.stringify(stats))
}

run()
