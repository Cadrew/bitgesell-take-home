const express = require("express");
const morgan = require("morgan");
const itemsRouter = require("./routes/items");
const statsRouter = require("./routes/stats");
const cors = require("cors");
const { notFound } = require("./middleware/errorHandler");
const logger = require("./middleware/logger");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(morgan("dev"));
app.use(logger); // Add enhanced logger middleware

app.use("/api/items", itemsRouter);
app.use("/api/stats", statsRouter);

app.use("*", notFound);

app.listen(port, () =>
  console.log(`Backend running on http://localhost:${port}`)
);
