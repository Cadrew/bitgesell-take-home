const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const DATA_PATH = path.join(__dirname, "../../../data/items.json");

// Utility to read data asynchronously
async function readData() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    throw new Error("Failed to read data: " + err.message);
  }
}

// Utility to write data asynchronously
async function writeData(data) {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    throw new Error("Failed to write data: " + err.message);
  }
}

// GET /api/items
router.get("/", async (req, res, next) => {
  try {
    const data = await readData();
    const { q, page = 1, pageSize = 10 } = req.query;
    let results = data;

    if (q) {
      const regex = new RegExp(q, "i"); // Case-insensitive regex search
      results = results.filter((item) => regex.test(item.name));
    }

    const start = (parseInt(page) - 1) * parseInt(pageSize);
    const end = start + parseInt(pageSize);
    const paginatedResults = results.slice(start, end);

    res.json({
      items: paginatedResults,
      total: results.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get("/:id", async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find((i) => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error("Item not found");
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post("/", async (req, res, next) => {
  try {
    const { name, category, price } = req.body;
    if (!name || !category || typeof price !== "number" || price < 0) {
      const err = new Error(
        "Invalid input: name, category, and non-negative price are required"
      );
      err.status = 400;
      throw err;
    }

    const data = await readData();
    const item = { id: Date.now(), name, category, price };
    data.push(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
