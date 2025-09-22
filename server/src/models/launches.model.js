const launches = require("./launches.mongo")
const planets = require("./planets.mongo")

// const launches = new Map()

let latestFlightNumber = 100

const launch = {
  flightNumber: 100,
  mission: "kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 18, 2111"),
  target: "Kepler-442 b",
  customers: ["NASA", "TANTRINH"],
  upcoming: true, // opposition == history
  success: true, // check status
}

// 1. create the first launch
saveLaunch(launch)

// GET http
async function getAllLaunches() {
  // convert Map launches to Array
  return await launches.find(
    {},
    // exclude : Donot show 2 columns "_id", "__v"
    {
      "_id": 0,
      "__v": 0,
    }
  )
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  })

  // make sure new target is matching target in planet collection
  if (!planet) {
    throw new Error("No matching planet Found!")
  }

  await launches.updateOne(
    {
      // check exist ? => NO exist => create NEw
      flightNumber: launch.flightNumber,
    },
    // Yes Exist ? update in launch
    launch,
    {
      upsert: true, // Upsert action
    }
  )
}

// POST http
function addNewLaunch(launch) {
  latestFlightNumber++
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      // (add new fields for launch Object)
      flightNumber: latestFlightNumber,
      customers: ["NASA", "TanTrinh"],
      upcoming: true, // opposition == history
      success: true, // check status
    })
  )
}

// CHeck exist launch
function existLaunchWithId(launchId) {
  return launches.has(launchId)
}

//Do not delete launch, just change status
function abortedLaunchById(launchId) {
  const aborted = launches.get(launchId)
  aborted.upcoming = false
  aborted.success = false
  return aborted
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existLaunchWithId,
  abortedLaunchById,
}
