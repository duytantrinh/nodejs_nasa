const launches = require("./launches.mongo")
const planets = require("./planets.mongo")

// const launches = new Map()
const DEFAULT_FLIGHT_NUMBER = 100
let latestFlightNumber = 100

// const launch = {
//   flightNumber: 100,
//   mission: "kepler Exploration X",
//   rocket: "Explorer IS1",
//   launchDate: new Date("December 18, 2111"),
//   target: "Kepler-442 b",
//   customers: ["NASA", "TANTRINH"],
//   upcoming: true, // opposition == history
//   success: true, // check status
// }

// // 1. create the first launch
// saveLaunch(launch)

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

  await launches.findOneAndUpdate(
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
async function addNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1
  const newLaunch = Object.assign(launch, {
    // (add new fields for launch Object)
    flightNumber: newFlightNumber,
    customers: ["NASA", "TanTrinh"],
    upcoming: true, // opposition == history
    success: true, // check status
  })

  // add newLaunch to database
  await saveLaunch(newLaunch)
}

// Method with Map
// function addNewLaunch(launch) {
//   latestFlightNumber++
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       // (add new fields for launch Object)
//       flightNumber: latestFlightNumber,
//       customers: ["NASA", "TanTrinh"],
//       upcoming: true, // opposition == history
//       success: true, // check status
//     })
//   )
// }

// CHeck exist launch
async function existLaunchWithId(launchId) {
  return await launches.findOne({flightNumber: launchId})
}

async function getLatestFlightNumber() {
  // get one launch => sort desc by flightNumber => get launch with biggest flightNumber
  const latestLaunch = await launches.findOne().sort({"flightNumber": -1})

  // for first launch
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER
  }

  return latestLaunch.flightNumber
}

//Do not delete launch, just change status

async function abortedLaunchById(launchId) {
  const aborted = await launches.updateOne(
    {
      // filter to find
      flightNumber: launchId,
    },
    {
      // fileds want to be updated
      upcoming: false,
      success: false,
    }
  )

  return aborted

  // Method with Map
  // const aborted = launches.get(launchId)
  // const aborted = await launches.findOne({flightNumber: launchId})
  // aborted.upcoming = false
  // aborted.success = false
  // return aborted
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existLaunchWithId,
  abortedLaunchById,
}
