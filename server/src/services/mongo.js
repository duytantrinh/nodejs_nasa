const mongoose = require("mongoose")

const MONGO_URL =
  "mongodb+srv://node_nasa:jn1ruzQo9rcp4S9Q@cluster0.a1ba9vm.mongodb.net/nasa_api?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!!!")
})

mongoose.connection.on("error", (err) => {
  console.error(err)
})

async function mongoConnect() {
  await mongoose.connect(MONGO_URL)
}
async function mongoDisConnect() {
  await mongoose.disconnect()
}

module.exports = {
  mongoConnect,
  mongoDisConnect,
}
