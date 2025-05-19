/*
  index.js
  --------------------------------------------------
  Entry point for the Express backend server:
    • Loads environment variables and initializes PostgreSQL connection.
    • Sets up middleware: CORS and JSON parsing.
    • Registers route modules for:
        – /api/guests  → guest management
        – /api/stays   → stay booking and updates
        – /api/checks  → daily spot checks
    • Starts the server on port 3000.
*/
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

const staysRouter = require("./routes/stays")(pool);
app.use("/api/stays", staysRouter);

const checksRouter = require("./routes/checks")(pool);
app.use("/api/checks", checksRouter);

app.listen(3000, () => {
  console.log("Backend server is running at http://localhost:3000");
});
