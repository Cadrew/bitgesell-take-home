const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const router = express.Router();
const { mean } = require("../utils/stats");
const DATA_PATH = path.join(__dirname, "../../../data/items.json");

let statsCache = null;

// Watch file for changes to invalidate cache
require("fs").watch(DATA_PATH, async () => {
  statsCache = null; // Invalidate cache on file change
});

// GET /api/stats
router.get("/", async (req, res, next) => {
  try {
    if (statsCache) {
      return res.json(statsCache);
    }

    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const items = JSON.parse(raw);

    const stats = {
      total: items.length,
      averagePrice: items.length ? mean(items.map((item) => item.price)) : 0,
    };

    statsCache = stats; // Cache the result
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
