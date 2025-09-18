https://github.com/jovi-tsx/nasa-project

`npm run deploy`

- using MVC pattern: models,routes in BackEnd, views in FrontEnd

# FrontEnd: client

# BackEnd: server

server -> server.js
--------> models
--------> routes

# ======= set CORS cho FrontEnd và BackEnd

Protocol Host :Port
https:// google.com:3000

`npm i cors` : tại server/server.js

# cách automatic running client and server at the same time (manage both client/server)

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

# how to run project in Production

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

# Install MiddleWare morgan for server

1. tại server
   `npm i morgan`

# Flow data (E.g: planets)

`server.js --> app.js --> planets.router --> planets.controller --> planets.model`

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

// 27 DELETE
