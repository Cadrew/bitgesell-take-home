const request = require("supertest");
const fs = require("fs").promises;
const path = require("path");

const DATA_PATH = path.join(__dirname, "../../../data/items.json");

describe("Stats API", () => {
  let originalData;
  let app;

  beforeEach(async () => {
    jest.resetModules();

    const fsCore = require("fs");
    const originalWatch = fsCore.watch;
    fsCore.watch = (...args) => {
      const watcher = originalWatch(...args);
      if (watcher.unref) watcher.unref();
      return watcher;
    };

    originalData = await fs.readFile(DATA_PATH, "utf-8");

    const express = require("express");
    const statsRouter = require("../routes/stats");
    app = express();
    app.use(express.json());
    app.use("/api/stats", statsRouter);
  });

  afterEach(async () => {
    await fs.writeFile(DATA_PATH, originalData, "utf-8");
  });

  it("GET /api/stats returns correct statistics", async () => {
    const res = await request(app).get("/api/stats");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("total", 25);
    expect(res.body).toHaveProperty("averagePrice", expect.any(Number));
  });

  it("GET /api/stats uses cache for subsequent requests", async () => {
    const res1 = await request(app).get("/api/stats");
    const res2 = await request(app).get("/api/stats");
    expect(res2.status).toBe(200);
    expect(res2.body).toEqual(res1.body);
  });

  it("GET /api/stats handles empty data file", async () => {
    await fs.writeFile(DATA_PATH, "[]", "utf-8");
    const res = await request(app).get("/api/stats");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 0, averagePrice: 0 });
  });
});
