const {describe, test} = require("node:test")
const {deepStrictEqual} = require("node:assert")

const request = require("supertest")
const app = require("../../app")

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
    deepStrictEqual(responseDate, requestDate)

    // the left datas are similar
    const {mission, rocket, target} = response.body
    deepStrictEqual(
      {
        mission,
        rocket,
        target,
      },
      launchDataWithOutDate
    )
  })

  test("It should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      // send data wihout Date (Missing Date)
      .send(launchDataWithOutDate)
      .expect("Content-Type", /json/)
      .expect(400)

    deepStrictEqual(response.body, {error: "Missing required launch property"})
  })

  test("It should catch invalid Launch Date", async () => {
    const response = await request(app)
      .post("/launches")
      // send data with INVALID Date
      .send(launchDataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400)

    deepStrictEqual(response.body, {error: "Invalid Launch Date"})
  })
})
