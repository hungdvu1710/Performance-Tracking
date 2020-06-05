const os = require('os')
const { exec } = require('child_process')
const GB_TO_BYTE = 1073741824

function updateMemoryUsage() {
  const memoryUsed = os.totalmem() - os.freemem()
  const memoryUsedGb = Math.floor(memoryUsed/GB_TO_BYTE * 100) / 100

  document.querySelector("#memUsed").innerText = `Memory Used: ${memoryUsedGb}GB`

  const percentMemoryUsed = (memoryUsed / os.totalmem()) * 100
  document.querySelector("#memory").setAttribute("value", percentMemoryUsed)
}

function getCpuInfo(){
  const {model, speed} = os.cpus()[0]

  document.querySelector("#model").innerText = `CPU model: ${model}`
  document.querySelector("#speed").innerText = `Speed: ${speed}`
}

function updateDiskUsage(){
  return new Promise((resolve, reject) =>{
    exec('wmic logicaldisk get size,freespace,caption', (error, stdout) => {
      if (error) {
        reject(error)
        console.error(`exec error: ${error}`)
        return
      }

      const res = stdout.replace(/\s+/g, " ").split(" ")
      const numDisk = (res.length - 4)/3

      for(let i = 1; i <= numDisk; i++){
        const diskName = res[i*3]
        const freeSpace = res[i*3 +1]
        const totalCapacity = res[i*3+2]
        const usedSpace = totalCapacity - freeSpace
        const usedSpaceInGb = Math.floor(usedSpace/GB_TO_BYTE * 100) / 100
        const totalCapacityInGb = Math.floor(totalCapacity/GB_TO_BYTE * 100) / 100

        if(document.querySelector(".logicalDiskTracker").children.length < numDisk){
          document.querySelector(".logicalDiskTracker").innerHTML +=`
          <div class="disk${diskName}">
            <div>Disk: ${diskName}</div>
            <div>Disk Capacity: ${totalCapacityInGb}GB</div>
            <div>Used space: ${usedSpaceInGb}GB</div>
            <progress value="${(usedSpace/totalCapacity) * 100}" max="100"></progress>
          </div>
          `
        } else{
          document.querySelector(".logicalDiskTracker").children[i-1].innerHTML =`
          <div>Disk: ${diskName}</div>
          <div>Disk Capacity: ${totalCapacityInGb}GB</div>
          <div>Used space: ${usedSpaceInGb}GB</div>
          <progress value="${(usedSpace/totalCapacity) * 100}" max="100"></progress>
          `
        }
      }

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

getCpuInfo()
updateUi()
setInterval(updateUi, 1000)