const os = require('os')
const { exec } = require('child_process')

function updateMemoryUsage() {
  const memoryUsed = os.totalmem() - os.freemem()
  const memoryUsedGb = Math.floor(memoryUsed/1073741824 * 100) / 100

  document.querySelector("#memUsed").innerText = `Memory Used: ${memoryUsedGb}GB`

  const percentMemoryUsed = (memoryUsed / os.totalmem()) * 100
  document.querySelector("#memory").setAttribute("value", percentMemoryUsed)
}

function getCpuInfo(){
  const {model, speed} = os.cpus()[0]
  document.querySelector("#model").innerText = `CPU model: ${model}`
  document.querySelector("#speed").innerText = `Speed: ${speed}`
}

getCpuInfo()

function updateDiskUsage(){
  return new Promise((resolve, reject) =>{
    exec('wmic logicaldisk get size,freespace,caption', (error, stdout) => {
      if (error) {
        reject(error)
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
      resolve()
    });
  })
}

function updateCpuUsage(){
  return new Promise(function(resolve, reject) {
    exec('wmic cpu get loadpercentage', (error, stdout) => {
      if (error) {
        reject(error)
        console.error(`exec error: ${error}`)
        return
      }

      const res = stdout.split(" ")
      document.querySelector("#percentCpuUsed").innerText = `CPU used: ${Number(res[2])}%`
      document.querySelector("#cpu").setAttribute("value", Number(res[2]))
      resolve()
    });
  })
}

const updateUi = () =>{
  Promise.all([
    updateCpuUsage(),
    updateMemoryUsage(),
    updateDiskUsage(),
  ])
  .catch(console.error)

  document.querySelector("#uptime").innerText = os.uptime()

}

updateUi()
setInterval(updateUi, 1000)
