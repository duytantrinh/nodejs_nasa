const {getAllPlanets} = require("../../models/planets.model")

function httpGetAllPlanets(req, res) {
  const data = getAllPlanets()
  return res.status(200).json({
    total: data.length,
    data,
  })
}

module.exports = {
  httpGetAllPlanets,
}
