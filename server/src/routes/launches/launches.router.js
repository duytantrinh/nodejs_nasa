const express = require("express")

const {httpGetAllLaunches, httpPostNewLaunch} = require("./launches.controller")

const launchesRouter = express.Router()

// /launches/
launchesRouter.get("/", httpGetAllLaunches)
launchesRouter.post("/", httpPostNewLaunch)

module.exports = launchesRouter
