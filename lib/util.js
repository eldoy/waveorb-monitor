function parseObject(arr) {
  return Object.fromEntries(
    arr.map((entry) => {
      var [k, ...rest] = entry.split(': ')
      var v = rest.join(': ').trim()
      if (typeof v == 'string' && v.includes(',')) {
        v = v.replace('. ', ', ').split(',')
        v = Object.fromEntries(
          v.map((val) => {
            var [v, ...k] = val.trim().split(' ')
            return [k.join('').trim(), v.trim()]
          })
        )
      }
      return [k.split(' ').join('').toLowerCase(), v]
    })
  )
}

function parseArray(arr, keysOverride) {
  var keys = keysOverride || arr[0].split(' ').filter(Boolean)
  var entries = arr.slice(1, arr.length).filter(Boolean)
  return entries.map((entry) => {
    var values = entry.split(' ').filter(Boolean)
    if (values.length > keys.length) {
      var diff = values.length - keys.length
      var first = values.slice(0, diff + 1)
      var rest = values.slice(diff + 1, values.length)
      values = [first.join(' '), ...rest]
    }

    return Object.fromEntries(
      values.map((v, idx) => [keys[idx].toLowerCase(), v])
    )
  })
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

module.exports = { parseObject, parseArray, parseTop }
