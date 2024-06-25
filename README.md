# Waveorb monitor

Monitoring tool that runs on the server that gives you system information like:

- Memory usage
- Hard drive usage
- CPU usage

The function checks system resources and returns a JSON object with data about usage.

### Install

```
npm i waveorb-monitor
```

### Usage

```js
var monitor = require('waveorb-monitor')

// Get ram and swap usage stats as JSON, based on 'free -m'
var mem = await monitor.mem()

// Get CPU usage as JSON, based on 'top'
var cpu = await monitor.cpu()

// Get hard drive usage as JSON, based on 'df -h'
var hd = await monitor.hd()

// Get all stats (mem, cpu, hd) as JSON
var stats = await monitor.stats()
```

Created by [Eldøy Projects](https://eldoy.com)

Enjoy!
