function ssh($, command) {
  var { stdout } = $.tools.run(`ssh default "${command}"`, {
    silent: true
  })
  return JSON.parse(stdout)
}

it('should return cpu', async ({ $, t }) => {
  var result = ssh($, 'node spec/vm/test-cpu.js')

  t.equal(Object.keys(result).length, 6)

  t.equal(Object.keys(result.top).length, 4)
  t.equal(typeof result.top.timestamp, 'string')
  t.equal(typeof result.top.up, 'string')
  t.equal(result.top.users, '1')
  t.equal(result.top.loadaverage.length, 3)

  t.equal(Object.keys(result.tasks).length, 5)
  t.equal(typeof result.tasks.total, 'string')
  t.equal(typeof result.tasks.running, 'string')
  t.equal(typeof result.tasks.sleeping, 'string')
  t.equal(result.tasks.stopped, '0')
  t.equal(result.tasks.zombie, '0')

  t.equal(Object.keys(result['%cpu(s)']).length, 8)
  t.deepStrictEqual(typeof result['%cpu(s)'].us, 'string')
  t.deepStrictEqual(typeof result['%cpu(s)'].sy, 'string')
  t.deepStrictEqual(typeof result['%cpu(s)'].ni, 'string')
  t.deepStrictEqual(typeof result['%cpu(s)'].id, 'string')
  t.deepStrictEqual(typeof result['%cpu(s)'].wa, 'string')
  t.deepStrictEqual(typeof result['%cpu(s)'].hi, 'string')
  t.deepStrictEqual(typeof result['%cpu(s)'].si, 'string')
  t.deepStrictEqual(typeof result['%cpu(s)'].st, 'string')

  t.equal(Object.keys(result.mibmem).length, 4)
  t.equal(typeof result.mibmem.total, 'string')
  t.equal(typeof result.mibmem.free, 'string')
  t.equal(typeof result.mibmem.used, 'string')
  t.equal(typeof result.mibmem['buff/cache'], 'string')

  t.equal(Object.keys(result.mibswap).length, 4)
  t.equal(typeof result.mibswap.total, 'string')
  t.equal(typeof result.mibswap.free, 'string')
  t.equal(typeof result.mibswap.used, 'string')
  t.equal(typeof result.mibswap.availMem, 'string')

  t.ok(result.list.length > 100)

  t.equal(Object.keys(result.list[0]).length, 12)
  t.equal(typeof result.list[0].pid, 'string')
  t.equal(result.list[0].user, 'root')
  t.equal(result.list[0].pr, '20')
  t.equal(result.list[0].ni, '0')
  t.equal(result.list[0].virt, '103792')
  t.equal(result.list[0].res, '12720')
  t.equal(result.list[0].shr, '8496')
  t.equal(result.list[0].s, 'S')
  t.equal(result.list[0]['%cpu'], '0.0')
  t.equal(result.list[0]['%mem'], '1.3')
  t.equal(typeof result.list[0]['time+'], 'string')
  t.equal(result.list[0].command, 'systemd')
})

it('should return hd', async ({ $, t }) => {
  var result = ssh($, 'node spec/vm/test-hd.js')

  t.ok(result.length > 10)

  t.deepStrictEqual(result[0], {
    filesystem: 'udev',
    size: '466M',
    used: '0',
    avail: '466M',
    capacity: '0%',
    iused: '/dev'
  })
})

it('should return mem', async ({ $, t }) => {
  var result = ssh($, 'node spec/vm/test-mem.js')

  t.equal(Object.keys(result).length, 2)

  t.equal(Object.keys(result.mem).length, 6)
  t.equal(typeof result.mem.total, 'string')
  t.equal(typeof result.mem.used, 'string')
  t.equal(typeof result.mem.free, 'string')
  t.equal(typeof result.mem.shared, 'string')
  t.equal(typeof result.mem['buff/cache'], 'string')
  t.equal(typeof result.mem.available, 'string')

  t.deepStrictEqual(result.swap, { total: '0', used: '0', free: '0' })
})

it('should return stats', async ({ $, t }) => {
  var result = ssh($, 'node spec/vm/test-stats.js')

  t.deepStrictEqual(Object.keys(result), ['mem', 'hd', 'cpu'])
})
