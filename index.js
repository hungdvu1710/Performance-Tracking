const os = require('os')
const { exec } = require('child_process');

function updateMemoryUsage(){
  const memoryUsed = os.totalmem() - os.freemem()
  const displayInGB = Math.floor(memoryUsed/1073741824 * 100) / 100
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

function getCpuInfo(){
  const {model, speed} = os.cpus()[0]
  document.querySelector("#model").innerText = `CPU model: ${model}`
  document.querySelector("#speed").innerText = `Speed: ${speed}`
}

getCpuInfo()

function updateDiskUsageWithPromise(){
  return new Promise((e) =>{
    exec('wmic logicaldisk get size,freespace,caption', (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      const res = stdout.replace(/\s+/g, " ").split(" ")

      const freeSpace = res[4]
      const totalCapacity = res[5]
      const usedSpace = totalCapacity - freeSpace
      const usedSpaceForDisplay = Math.floor(usedSpace/1073741824 * 100) / 100
    
      document.querySelector("#usedSpace").innerText = `Used Space: ${usedSpaceForDisplay}GB`
      document.querySelector("#disk").setAttribute("value",(usedSpace/totalCapacity) * 100)
    });

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
    updateMemoryUsageWithPromise(),
    updateDiskUsageWithPromise()
  ]).catch(console.log)

  document.querySelector("#uptime").innerText = os.uptime()

},1000)