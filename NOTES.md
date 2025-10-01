https://github.com/jovi-tsx/nasa-project

`npm run deploy`

- using MVC pattern: models,routes in BackEnd, views in FrontEnd

# FrontEnd: client

# BackEnd: server

server -> server.js
--------> models
--------> routes

# 1. ======= set CORS cho FrontEnd và BackEnd

Protocol Host :Port
https:// google.com:3000

`npm i cors` : tại server/server.js

# 2. cách automatic running client and server at the same time (manage both client/server)

- tạo package.json ngoài root ngaoic cùng
- viết script đề `run client and server at the same time`

```bash
# "server": "cd server && npm run watch" === "npm run watch --prefix server"
"server": "npm run watch --prefix server",
"client": "npm start --prefix client",

# terminal `npm run watch` : sẽ run 2 lệnh chạy server và client cùng 1 lúc
"watch": "npm run server & npm run client",
# nếu dòng nối trên ko working thì dùng dòng dưới ,  npm install --save-dev concurrently first
# "watch": "concurrently \"npm run server\" \"npm run client\"",
```

# 3. how to run project in Production

> > run frontend và BAckend trên cùng 1 url

1. tai client : file package.json

```bash
 "scripts": {
    "start": "react-scripts start",
    "build": "set BUILD_PATH=../server/public&& react-scripts build",
    "test": "react-scripts test --passWithNoTests",
    "eject": "react-scripts eject"
  },
```

2. tại app.js của server: viết middleware để chạy folder public này

```bash
# // middle ware to run static files at public folder
app.use(express.static(path.join(__dirname, "..", "public")))

# // middleware to run http://localhost:8000/
# khi bấm url trên , program tự tìm đến và run file public/index.html
# middleware to run http://localhost:8000/{*splat} === every endpoint after 8000/
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})


```

3. tại file package.json của root folder `thêm tât cả các script vào`

4. tại root folder chạy `npm run deploy`
   ==> tại server sẽ tự động tạo thêm folder public do dòng lệnh  
   `"build": "set BUILD_PATH=../server/public&& react-scripts build",` đc tạo tại package.json client

   ==> `vừa run server và client at the same time`

5. từ bay giờ: url cảu UI `http://localhost:8000/`

# 4. Install MiddleWare morgan for server

1. tại server
   `npm i morgan`

# 5. Flow data (E.g: planets)

`server.js --> app.js --> planets.router --> planets.controller --> planets.model -> planets.mongo`

0. planets.mongo: tạo schema cho database model

1. planets.model: tạo/kết nối với database planets

2. planets.controller : GET/POST planets với database

3. planets.router: tạo router .E.g

```bash
planetsRouter.get("/planets", getAllPlanets)
# khi bấm vào http://localhost:8000/planets == >show all planets cái mà đc lọc bên model
```

4. app.js : dùng middleware đề gọi sử dung router vừa tạo

```bash
const planetsRouter = require("./routes/planets/planets.router")

app.use(planetsRouter)

```

# 6. Testing In Node -

`npm test` : cho testing toàn app
tại cd server, `npm run test-watch` : test only atserver

https://jestjs.io/docs/using-matchers
https://jestjs.io/docs/expect

> > > > > > > > API Test with Jest

- work both on FrontEnd and BackEnd

1. chuyền đến server folder : cd server

- `npm i jest --save-dev` : only using jest when develpment

2. tại package.json

```bash
  "scripts": {
    "test": "jest",
     "test-watch": "jest --watch",
      .....
   }
```

`E.g: làm testing với launches`

3. tạo launches/`launches.test.js`

- phài test tất cả các trường hợp có thể xày ra trong function GET/POST

```bash
- xem test với GET HTTP
-------------- POST HTTP

```

4. install supertest
   npm i supertest --save-dev

```bash
.toBe() : 2 value giống nhau
.toMatchObject() : Prperties của Object nhận về chỉ cần giống nhau với properties cùa Object gời đi ( ko cần đủ số lượng)
.toStrictEqual() :  2 Objects phài completely the same ( số lương, type....)
```

> > > > > > > > API Test with Test Runner

1. dùng các hàm test do NOde cung cấp, ko dùng Jest

- xem file launches/`launches.test.runner.js`

2. tại package.json

```bash
  "scripts": {
    "test": "node --test",
    "test-watch": "node --test --watch",
    }
```

# ======= Testing Mongoose + Node with Jest

1. tại file `package.json của folder server`, thêm

```bash
  "jest": {
    "testEnviroment": "node,"
  },
```

2. tạo server/src/`services`/mongo.js

- nơi connect Node với Mongoose DB (tạo hàm mongoConnect())

3. gọi hàm mongoConnect() tại `server.js`

4. tại `launches.test.js`, gọi mongoConnect() trước hết và disConnect() sau cùng khi all test finished

```bash
  beforeAll(async () => {
    await mongoConnect()
  })

  afterAll(async () => {
    await mongoDisConnect()
  })
```

# improve NODE Performance

- divide the big request to multiple small ones by node processes running parallel (side by side)

> > ------- 1. dùng Cluster Module
> > xem Performance_Example/server_without_pm2.js

- tạo các node processes nhỏ (gọi là worker) để chia nhỏ đảm nhận các request
- khi run luôn chạy 1 master cho `server.js` và các worker tương ứng với các http request

```bash
# // gọi cluster de tạo chia nhỏ các worker
const cluster = require("cluster")
# // window: PHẢI thêm dòng này cluster mới chạy đc nhiều worker
cluster.schedulingPolicy = cluster.SCHED_RR

if (cluster.isMaster) {
#   // (1. master là server.js)
  console.log("Master")

  const NUM_WORKERS = os.cpus().length

  for (let i = 0; i < NUM_WORKERS; i++) {
    # // (tạo maximum worker (node processes) based on physical of each MACHINE (this machine: 12))
    cluster.fork()
  }

} else {
#   // (2. 2 worker tương ứng 2 request / và /timer sẽ đc chạy trên 2 node processes parallel)
  console.log("worker")
  app.listen(3000)
}

```

> > --- 2. dùng PM2 (a tool manages cluster module)
> > dùng pm2 sẽ làm cho code ngắn gọn hơn . xem Performance_Example/server.js

`npm i pm2 -g` : install global module

++ run pm2 :
`pm2 start server.js` : start file server.js ( 1 master và 12 workers (vì máy này chạy đc tối đa 12 workers))
`pm2 status` : xem status của node server (file server.js)
`pm2 stop server` : stop node server
`pm2 delete server` : delete all running cluster of node server
`pm2 start server.js -i 2` : run 2 worker
`pm2 start server.js -i max` : run max worker
`pm2 list` : list of master and worker
`pm2 logs` : all console.log of master and workers
`pm2 show 0` : check alll information của cluster id 0

# === Databases

username: node_nasa
pass: jn1ruzQo9rcp4S9Q

mongodb+srv://node_nasa:<db_password>@cluster0.a1ba9vm.mongodb.net/<ten_db_tudat>?retryWrites=true&w=majority&appName=Cluster0

`npm i mongoose `

1. CONNECT database

```bash
const mongoose = require("mongoose")

const MONGO_URL =
  "mongodb+srv://node_nasa:jn1ruzQo9rcp4S9Q@cluster0.a1ba9vm.mongodb.net/nasa_api?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!!!")
})


mongoose.connection.on("error", (err) => {
  console.error(err)
})

 await mongoose.connect(MONGO_URL, {
   #  // most of time need 4 parameters
    useNewUrlParser: true, // using string
    useFindAndModify: false, // donot allow auto apdate
    useCreateIndex: true,
    useUnifiedTopology: true, // talking to cluster
  })

```

# ===== Mongoose

https://mongoosejs.com/docs/schematypes.html
E.g: for Launches

1. tạo models/launches.mongo.js

- `ObjectId` : === "\_id" trong database
- `__v` : keep track version

# .Auto Incre +1 cho id của next launch

1. get latest id(flightNumber)
   tại launches.model.js viết hàm

```bash
const DEFAULT_FLIGHT_NUMBER = 100

async function getLatestFlightNumber() {
  # // get one launch => sort desc by flightNumber => get launch with biggest flightNumber
  const latestLaunch = await launches.findOne().sort({"flightNumber": "-1"})

  // for first launch
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER
  }

  return latestLaunch.flightNumber
}
```

# ===== Tạo Versioning Node API (version 1, version 2 ...)

E.g: Tạo v1 cho api

1. tạo routes/api.js

- tạo các router chính tại file này

```bash
# // middelware to use router /planets
api.use("/planets", planetsRouter)
api.use("/launches", launchesRouter)

```

2. tại src/app.js
   gọi api ở trên kèm theo /v1, /v2 .... tùy ý muốn

```bash
# // create v1 for api router /v1/planets , /v1/launches
app.use("/v1", api)
# // app.use("/v2", api)

```

# Fetching Data from spaceX API

https://github.com/r-spacex/SpaceX-API/blob/master/docs/README.md

1. dùng axios đề post request to spaceX API
   `npm i axios`

tại launches.model.js viết hàm `loadLaunchesData()` để lấy all launches từ API

> 2. Pagination Data getting from API (tại server)
>    E.g: làm pagiantion cho launches

1. tạo file services/query.js
   -> đề lấy limit và page trên url
   // http://localhost:4000/v1/launches?limit=50&page=1
   --> return về `skip và limit` đề bỏ vào query của schema cho pagination (mặc định bới MongooseDB)

2. tại launches.controller

- tại hàm getALLLaunches

```bash
async function httpGetAllLaunches(req, res) {
  # // http://localhost:4000/v1/launches?limit=50&page=1
  const {skip, limit} = getPagination(req.query)
  # pass skip và limit đến getAllLaunches trong launches.model như parameter
  return res.status(200).json(await getAllLaunches(skip, limit))
}

```

3. tại launches.model
   thêm

```bash
async function getAllLaunches(skip, limit) {
  // convert Map launches to Array
  return await launches
    .find(
      {},
      {
        "_id": 0,
        "__v": 0,
      }
    )
    # sort by flightNumber before pagination
    .sort({flightNumber: 1})
    # // for pagination
    .skip(skip)
    .limit(limit)
}
```

14. sorting paginated Data
