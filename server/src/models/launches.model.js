const launches = new Map()

const launch = {
  flightNumber: 100,
  mission: "kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 18, 2029"),
  destination: "Kepler-442 b",
  customer: ["NASA", "TANTRINH"],
  upcoming: true, // opposition == history
  sucess: true, // check status
}

launches.set(launch.flightNumber, launch)

module.exports = {
  launches,
}

// GET launches
