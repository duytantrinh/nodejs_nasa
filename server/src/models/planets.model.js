// can destructure with require
const {parse} = require("csv-parse")
const fs = require("fs")
const path = require("path")

const habitablePlanets = []

// some conditions for data
function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  )
}

function loadPlanetsData() {
  // when loading/reading data from a file NEED TO USE Promise
  // 1. read the .csv file
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "data", "kepler_data.csv"))
      .pipe(
        parse({
          comment: "#", // no print comments which start with '#'
          columns: true, // return each row in csv to javascript object
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data)
        }
      })
      .on("error", (err) => {
        console.log(err)
        // call reject when error happens
        reject(err)
      })
      .on("end", () => {
        console.log(`${habitablePlanets.length} habitable Planets were found`)
        // call resolve when finish reading .csv file
        resolve()
      })
  })
}

function getAllPlanets() {
  return habitablePlanets
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
}
