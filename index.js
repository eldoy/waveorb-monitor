var extras = require('extras')
var util = require('./lib/util.js')

function mem() {
  var { stdout, stderr } = extras.run('free -m', { silent: true })

  if (stderr) return stderr

  var mem = stdout.split('\n').filter(Boolean)
  var keys = mem[0].split(' ').filter(Boolean)
  var entries = mem.slice(1, mem.length)

  return Object.fromEntries(
    entries.map((entry) => {
      var [k, v] = entry.split(':')
      var values = v.split(' ').filter(Boolean)
      return [
        k.trim().toLowerCase(),
        Object.fromEntries(values.map((v, idx) => [keys[idx], v]))
      ]
    })
  )
}

function hd() {
  var { stdout, stderr } = extras.run('df -h', { silent: true })

  if (stderr) return stderr

  var hd = stdout.split('\n').filter(Boolean)

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

function parseTop(str) {
  var [, rest] = str.split('-')
  var [up, users, load] = rest.split(',  ')
  var [timestamp, up] = up.split('up')
  var [users] = users.split(' ')
  var [k, v] = load.split(':')

  return Object.fromEntries(
    Object.entries({
      timestamp,
      up,
      users,
      [k]: v.split(',').map((value) => value.trim())
    }).map(([k, v]) => [
      k.trim().split(' ').join('').toLowerCase(),
      typeof v == 'string' ? v.trim() : v
    ])
  )
}

function cpu() {
  var { stdout, stderr } = extras.run('top -n 1 -b', { silent: true })

  if (stderr) return stderr

  var cpu = stdout.split('\n').filter(Boolean)
  var idx = cpu.findIndex((v) => v.includes('PID'))
  var info = cpu.slice(0, idx)
  var processes = cpu.slice(idx, cpu.length)

  var info = {
    top: parseTop(info[0]),
    ...util.parseObject(info.slice(1, info.length))
  }
  processes = util.parseArray(processes)

  return { ...info, list: processes }
}

module.exports = {
  mem,
  hd,
  cpu,
  stats: function () {
    return { mem: mem(), hd: hd(), cpu: cpu() }
  }
}
