const {
  getAllLaunches,
  addNewLaunch,
  existLaunchWithId,
  abortedLaunchById,
} = require("../../models/launches.model")

// console.log(launches.values())

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches())
}

async function httpPostNewLaunch(req, res) {
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

  await addNewLaunch(launch)
  return res.status(201).json(launch)
}

// DELETE
async function httpDeleteLaunch(req, res) {
  const launchId = Number(req.params.id)

  // if launch DOESNOT exist
  if (!(await existLaunchWithId(launchId))) {
    return res.status(404).json({
      error: "Launch not found",
    })
  }

  const aborted = await abortedLaunchById(launchId)
  console.log(aborted)
  //IF LAUNCH EXIST
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    })
  }
  return res.status(200).json({
    ok: true,
  })
}

module.exports = {
  httpGetAllLaunches,
  httpPostNewLaunch,
  httpDeleteLaunch,
}
