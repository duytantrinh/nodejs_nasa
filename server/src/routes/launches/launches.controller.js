const {getAllLaunches, addNewLaunch} = require("../../models/launches.model")

// console.log(launches.values())
console.log(addNewLaunch)

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches())
}
function httpPostNewLaunch(req, res) {
  // taking body data
  const launch = req.body

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    })
  }

  // convert launchDate from string to date
  launch.launchDate = new Date(launch.launchDate)
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid Launch Date",
    })
  }

  addNewLaunch(launch)
  return res.status(201).json(launch)
}

module.exports = {
  httpGetAllLaunches,
  httpPostNewLaunch,
}
