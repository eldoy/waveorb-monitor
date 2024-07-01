var extras = require('extras')

var config = {
  local_dir: [
    './lib',
    './index.js',
    './package.json',
    './package-lock.json',
    './spec/vm/test-*.js'
  ],
  remote_address: 'default',
  remote_dir: '/home/vagrant',
  remote_port: '22',
  remote_ssh_password: 'password'
}

function ssh(command) {
  return extras.run(`ssh default '${command}'`)
}

function run() {
  var {
    local_dir,
    remote_address,
    remote_dir,
    remote_port,
    remote_ssh_password
  } = config

  console.info(`Checking npm installation`)
  var { stderr } = ssh('npm -v')
  if (stderr?.includes('command not found')) {
    console.info(`Installing npm`)
    ssh('curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -')
    ssh('sudo apt install -y nodejs')
  }

  console.info(`Cleaning remote dir`)
  ssh(`rm -rf ${remote_dir}/*`)

  for (var local of local_dir) {
    var command = `rsync -avh "ssh -p ${remote_port}" ${local} ${remote_address}:${remote_dir}`

    if (remote_ssh_password) {
      command = `sshpass -p "${remote_ssh_password}" ${command}`
    }

    console.info(`Syncing ${local} to remote`)
    extras.run(command)
  }

  ssh(`mkdir ${remote_dir}/spec`)
  ssh(`mkdir ${remote_dir}/spec/vm`)
  ssh(`mv ${remote_dir}/test-*.js ${remote_dir}/spec/vm`)

  console.info(`Installing npm packages`)
  ssh(`npm i`)
}

run()
