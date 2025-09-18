const express = require("express")

const {
  httpGetAllLaunches,
  httpPostNewLaunch,
  httpDeleteLaunch,
} = require("./launches.controller")

const launchesRouter = express.Router()

// /launches/
launchesRouter.get("/", httpGetAllLaunches)
launchesRouter.post("/", httpPostNewLaunch)
launchesRouter.delete("/:id", httpDeleteLaunch)

module.exports = launchesRouter
