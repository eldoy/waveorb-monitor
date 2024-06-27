var extras = require('extras')
var util = require('./lib/util.js')

function mem() {
  var { stdout, stderr } = extras.run('free -m', { silent: true })

  if (stderr) return stderr

  return stdout
}

function hd() {
  var { stdout, stderr } = extras.run('df -h', { silent: true })

  if (stderr) return stderr

  var hd = stdout.split('\n')

  return util.parseArray(hd, [
    'filesystem',
    'size',
    'used',
    'avail',
    'capacity',
    'iused',
    'ifree',
    '%iused',
    'mountedOn'
  ])
}

function cpu() {
  var { stdout, stderr } = extras.run('top', { silent: true })

  if (stderr) return stderr

  var cpu = stdout.split('\n').filter(Boolean)

  var info = cpu.slice(0, 10)
  var processes = cpu.slice(10, cpu.length)

  info = util.parseObject(info)
  processes = util.parseArray(processes)

  console.log({ process: processes[0] })

  return { ...info, list: processes }
}

module.exports = {
  mem,
  hd,
  cpu,
  stats: async function () {
    return { mem: mem(), hd: hd(), cpu: cpu() }
  }
}
