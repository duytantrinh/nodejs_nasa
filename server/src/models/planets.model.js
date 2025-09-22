// can destructure with require
const {parse} = require("csv-parse")
const fs = require("fs")
const path = require("path")

const planets = require("./planets.mongo")

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
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data)
        }
      })
      .on("error", (err) => {
        console.log(err)
        // call reject when error happens
        reject(err)
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length
        console.log(`${countPlanetsFound} habitable Planets were found`)
        // call resolve when finish reading .csv file
        resolve()
      })
  })
}

async function getAllPlanets() {
  return await planets.find(
    {},
    // exclude : Donot show 2 columns "_id", "__v"
    {
      "_id": 0,
      "__v": 0,
    }
  ) // {} : return all data
}

async function savePlanet(data) {
  try {
    // add new planets to mongoDB
    // using upsert = insert NEW data + update EXIST data
    await planets.updateOne(
      {
        // check exist ? => NO exist => create NEw
        keplerName: data.kepler_name,
      },
      {
        // Yes Exist ? update field keplerName
        keplerName: data.kepler_name,
      },
      {
        // Upsert action
        upsert: true,
      }
    )
  } catch (err) {
    console.log(`Could not save planet ${err}`)
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
}
