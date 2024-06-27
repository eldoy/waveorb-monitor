var monitor = require('./index.js')

async function run() {
  var mem = monitor.mem()
  console.log({ mem })
  var hd = monitor.hd()
  console.log({ hd })
  var cpu = monitor.cpu()
  console.log({ cpu })
}

run()
