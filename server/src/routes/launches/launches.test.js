const request = require("supertest")
const app = require("../../app")

const {mongoConnect, mongoDisConnect} = require("../../services/mongo")

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect()
  })
  afterAll(async () => {
    await mongoDisConnect()
  })

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      // using jest + supertest
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200)
      // expect(response.statusCode).toBe(200)
    })
  })

  describe("Test POST /launches", () => {
    // dùng chung cho toàn describe này thì phài khai báo ngoài cùng
    const completeLaunchData = {
      mission: "TT Rocket 02",
      rocket: "TT 02",
      launchDate: "November 11, 2029",
      target: "Kepler-442 b",
    }

    const launchDataWithOutDate = {
      mission: "TT Rocket 02",
      rocket: "TT 02",
      target: "Kepler-442 b",
    }

    const launchDataWithInvalidDate = {
      mission: "TT Rocket 02",
      rocket: "TT 02",
      launchDate: "Hello World",
      target: "Kepler-442 b",
    }

    test("It should respond with 201 created", async () => {
      // using jest + supertest
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201)

      // convert 2 Dates to the the same format
      const requestDate = new Date(completeLaunchData.launchDate).valueOf()
      const responseDate = new Date(response.body.launchDate).valueOf()

      // expect 2 Dates are similar
      expect(responseDate).toBe(requestDate)

      // the left datas are similar
      expect(response.body).toMatchObject(launchDataWithOutDate)
    })

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        // send data wihout Date (Missing Date)
        .send(launchDataWithOutDate)
        .expect("Content-Type", /json/)
        .expect(400)

      expect(response.body).toStrictEqual({
        // if response.body missing property,
        // we are expecting error: "Missing required launch property" is Sent bACK
        // the same with error at 'launches.controller.js'
        error: "Missing required launch property",
      })
    })

    test("It should catch invalid Launch Date", async () => {
      const response = await request(app)
        .post("/launches")
        // send data with INVALID Date
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400)

      expect(response.body).toStrictEqual({
        // if response.body missing property,
        // we are expecting error: "Invalid Launch Date" is Sent bACK
        // the same with error at 'launches.controller.js'
        error: "Invalid Launch Date",
      })
    })
  })
})
