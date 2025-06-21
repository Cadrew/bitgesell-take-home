const request = require("supertest");
const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const DATA_PATH = path.join(__dirname, "../../../data/items.json");

describe("Items API", () => {
  let originalData;
  let app;

  beforeEach(async () => {
    originalData = await fs.readFile(DATA_PATH, "utf-8");

    const itemsRouter = require("../routes/items");
    app = express();
    app.use(express.json());
    app.use("/api/items", itemsRouter);

    app.use((err, req, res, next) => {
      res.status(err.status || 500).json({ message: err.message });
    });
  });

  afterEach(async () => {
    await fs.writeFile(DATA_PATH, originalData, "utf-8");
  });

  it("GET /api/items returns paginated items", async () => {
    const res = await request(app).get("/api/items?page=1&pageSize=2");
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(2);
    expect(res.body.total).toBeGreaterThanOrEqual(2);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(2);
  });

  it("GET /api/items with search query filters items", async () => {
    const res = await request(app).get("/api/items?q=laptop");
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "Laptop Pro" })])
    );
  });

  it("GET /api/items/:id returns single item", async () => {
    const res = await request(app).get("/api/items/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({ id: 1, name: "Laptop Pro" })
    );
  });

  it("GET /api/items/:id returns 404 for non-existent item", async () => {
    const res = await request(app).get("/api/items/999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Item not found");
  });

  it("POST /api/items creates new item", async () => {
    const newItem = { name: "Test Item", category: "Test", price: 100 };
    const res = await request(app).post("/api/items").send(newItem);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(newItem));
  });

  it("POST /api/items returns 400 for invalid input", async () => {
    const res = await request(app).post("/api/items").send({ name: "Test" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      expect.stringContaining("Invalid input")
    );
  });
});
