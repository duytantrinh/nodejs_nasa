const axios = require("axios")

const launches = require("./launches.mongo")
const planets = require("./planets.mongo")

// const launches = new Map()
const DEFAULT_FLIGHT_NUMBER = 100
let latestFlightNumber = 100

// const launch = {
//   flightNumber: 100, // === flight_number in API response
//   mission: "kepler Exploration X", // === name
//   rocket: "Explorer IS1", // ===  rocket.name
//   launchDate: new Date("December 18, 2111"), // ===  date_local
//   target: "Kepler-442 b", // not applicable
//   customers: ["NASA", "TANTRINH"], // === payload,customers for each payload
//   upcoming: true, // === upcoming
//   success: true, // === success
// }

// // // 1. create the first launch
// saveLaunch(launch)

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"

async function loadLaunchesData() {
  console.log("downloading launch data...")

  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false, // get all Data
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  })

  if (response.status !== 200) {
    console.log("Problem downloading launch data")
    throw new Error("Launch data download failed")
  }

  const launchDocs = response.data.docs

  for (const launchDoc of launchDocs) {
    const customers = launchDoc["payloads"].flatMap((payload) => {
      return payload["customers"]
    })

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    }

    // console.log(`${launch.flightNumber} ${launch.mission}`)

    await saveLaunch(launch)
  }
}

// GET http
async function getAllLaunches(skip, limit) {
  // convert Map launches to Array
  return await launches
    .find(
      {},
      // exclude : Donot show 2 columns "_id", "__v"
      {
        "_id": 0,
        "__v": 0,
      }
    )
    // sort by flightNumber start from 1 before pagination
    .sort({flightNumber: 1})
    // for pagination
    .skip(skip)
    .limit(limit)
}

async function saveLaunch(launch) {
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
  const planet = await planets.findOne({
    keplerName: launch.target,
  })

  // make sure new target is matching target in planet collection
  if (!planet) {
    throw new Error("No Matching planet found!!!")
  }

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
  loadLaunchesData,
}
