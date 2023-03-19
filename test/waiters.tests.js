const assert = require("assert");
const waitersfac = require("../waitersfac");
const Waitersfunc = require("../waitersfac");
const pgp = require("pg-promise")();
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgrsql://postgres:Cyanda@100%@localhost:5432/my_waiters";
const config = {
  connectionString: DATABASE_URL,
};

const db = pgp(config);

describe("tests", async function () {
  this.beforeEach(async function () {
    await db.none("DELETE FROM workers");
  });

  it("It must retrieve name and authentication code", async function () {
    let waiterOutput = Waitersfunc(db);
    await waiterOutput.setUsername("Mjita", "MJr4yl");
    assert.deepEqual(
      { code: "MJr4yl", username: "Mjita" },
      await waiterOutput.theWorkers()
    );
  });

  it("Must return name by authentication code", async function () {
    let waiterOutput = Waitersfunc(db);
    await waiterOutput.setUsername("Mjita", "MJr4yl");

    assert.equal("Mjita", await waiterOutput.getUsername("MJr4yl"));
  });

  it("It must be able to delete all names", async function () {
    let waiterOutput = Waitersfunc(db);
    await waiterOutput.setUsername("landani");
    await waiterOutput.setUsername("Unalo");
    await waiterOutput.setUsername("Mark");

    await waiterOutput.removeNames();
    let results = await db.any("SELECT * FROM admins");
    assert.deepEqual([], results);
  });
  it("It must save a day and show people select that day", async function () {
    let waiterOutput = Waitersfunc(db);
    await waiterOutput.setUsername("Lexi", "3nl0v");
    await waiterOutput.setWeek(["Monday"], "Lexi");
  });

  it("Must be able to return how many waiters are working for a Monday", async function () {
    const waiterOutput = Waitersfunc(db);
    await waiterOutput.setUsername("Lexi", "3nl0v");
    await waiterOutput.setUsername("Lihle", "VAqmF");
    await waiterOutput.setUsername("Asana", " qWd4p");

    await waiterOutput.setWeek(["Monday"], "Lexi");
    await waiterOutput.setWeek(["Monday"], "Lihle");
    await waiterOutput.setWeek(["Monday"], "Asana");

    let weekdays = await waiterOutput.JoinTables("Tuesday");

    assert.equal(0, weekdays.length);
  });
});
