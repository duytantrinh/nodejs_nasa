const http = require("http")
const mongoose = require("mongoose")

const app = require("./app")

const {loadPlanetsData} = require("./models/planets.model")

const PORT = process.env.PORT || 4000

const MONGO_URL =
  "mongodb+srv://node_nasa:jn1ruzQo9rcp4S9Q@cluster0.a1ba9vm.mongodb.net/nasa_api?retryWrites=true&w=majority&appName=Cluster0"

const server = http.createServer(app)

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!!!")
})

mongoose.connection.on("error", (err) => {
  console.error(err)
})

async function startServer() {
  await mongoose.connect(MONGO_URL)

  await loadPlanetsData()

  server.listen(PORT, () => {
    console.log("Listening on PORT " + PORT)
  })
}

startServer()
