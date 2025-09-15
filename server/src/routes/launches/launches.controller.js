const {launches} = require("../../models/launches.model")

console.log(launches.values())

function getAllLaunches(req, res) {
  // launches is a Map ==> launches.values() get value of it
  // Array.from(launches.values()) : (convert a MAp to an Array)
  return res.status(200).json(Array.from(launches.values()))
}

module.exports = {
  getAllLaunches,
}
