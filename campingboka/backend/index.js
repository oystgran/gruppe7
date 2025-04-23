const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const guestsRouter = require("./routes/guests")(pool);
app.use("/api/guests", guestsRouter);

app.listen(3000, () => {
  console.log("Backend server is running at http://localhost:3000");
});
