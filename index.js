const os = require('os')
const { exec } = require('child_process');

function updateMemoryUsage(){
  const memoryUsed = os.totalmem() - os.freemem()
  const displayInGB = Math.floor(memoryUsed/10000000) / 100
  document.querySelector("#memUsed").innerText = `Memory Used: ${displayInGB}GB`

  const percentMemoryUsed = ((memoryUsed)/os.totalmem())*100
  document.querySelector("#memory").setAttribute("value",`${percentMemoryUsed}`)
}

function updateMemoryUsageWithPromise(){
  return new Promise(function(e) {
    updateMemoryUsage()
    
    if(e) throw e
  })
}

function updateCpuUsageWithPromise(){
  return new Promise(function(e) {
    exec('wmic cpu get loadpercentage', (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      const res = stdout.split(" ")
      document.querySelector("#percentCpuUsed").innerText = `CPU used: ${Number(res[2])}%`
      document.querySelector("#cpu").setAttribute("value", Number(res[2]))
    });

    if(e) throw e
  })
}

setInterval(() =>{
  Promise.all([
    updateCpuUsageWithPromise(),
    updateMemoryUsageWithPromise()
  ]).then().catch(console.log)

  document.querySelector("#uptime").innerText = `Uptime ${os.uptime()}`

},1000)

