var monitor = require('../../index.js')

async function run() {
  var hd = monitor.hd()
  console.log(JSON.stringify(hd))
}

run()
