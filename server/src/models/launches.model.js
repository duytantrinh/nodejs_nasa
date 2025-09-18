const launches = new Map()

let latestFlightNumber = 100

const launch = {
  flightNumber: 100,
  mission: "kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 18, 2029"),
  target: "Kepler-442 b",
  customer: ["NASA", "TANTRINH"],
  upcoming: true, // opposition == history
  success: true, // check status
}

launches.set(launch.flightNumber, launch)

// GET http
function getAllLaunches() {
  // convert Map launches to Array
  return Array.from(launches.values())
}

// POST http
function addNewLaunch(launch) {
  latestFlightNumber++
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      // (add new fields for launch Object)
      flightNumber: latestFlightNumber,
      customer: ["NASA", "TanTrinh"],
      upcoming: true, // opposition == history
      success: true, // check status
    })
  )
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
}
