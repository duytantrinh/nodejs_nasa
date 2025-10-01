const path = require("path")
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const api = require("./routes/api")

const app = express()

// (Start Cors Middleware) Set middleware of CORS ngăn lỗi Access-Control-Allow-Origin header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  )
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  )
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Access-Control-Allow-Private-Network", true)
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200)

  next()
})

app.use(
  cors({
    origin: "http://localhost:3000",
  })
)

// morgan Middleware: check đc tất cả các request đã thuc hiện tại UI
app.use(morgan("combined"))

// using middleware Router
app.use(express.json())

// middle ware to run static files at public folder
app.use(express.static(path.join(__dirname, "..", "public")))

// create v1 for api router /v1/planets , /v1/launches
app.use("/v1", api)
// app.use("/v2", api)

// middleware to run http://localhost:8000/{*splat} === every endpoint after 8000/
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

module.exports = app
