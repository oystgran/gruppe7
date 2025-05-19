/*
  routes/checks.js
  --------------------------------------------------
  Express route handler for managing checked spots:
    • Secured by Firebase authentication middleware (`verifyFirebaseToken`).
    • GET /api/checks?date=YYYY-MM-DD
        – Returns all spot_ids marked as checked on the given date.
    • POST /api/checks
        – Adds a new check for a spot on a given date (ignores duplicates).
    • DELETE /api/checks
        – Removes a check for a specific spot and date.

  Notes:
    • All routes require valid Firebase ID token in the Authorization header.
    • Uses PostgreSQL connection pool (`pool`) to perform queries on the `checks` table.
*/
const verifyFirebaseToken = require("../middlewares/authMiddleware");

const express = require("express");

module.exports = function (pool) {
  const router = express.Router();
  router.use(verifyFirebaseToken);
  // Hent alle sjekker for en gitt dato
  router.get("/", async (req, res) => {
    const { date } = req.query;
    if (!date)
      return res.status(400).json({ error: "Missing 'date' parameter" });

    try {
      const result = await pool.query(
        "SELECT spot_id FROM checks WHERE date = $1",
        [date]
      );
      res.json(result.rows);
    } catch (err) {
      console.error("Error in GET /api/checks:", err);
      res.status(500).json({ error: "Failed to fetch checks" });
    }
  });

  // Legg til en sjekk
  router.post("/", async (req, res) => {
    const { spot_id, date } = req.body;
    if (!spot_id || !date)
      return res.status(400).json({ error: "Missing spot_id or date" });

    try {
      await pool.query(
        "INSERT INTO checks (spot_id, date) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [spot_id, date]
      );
      res.status(201).json({ success: true });
    } catch (err) {
      console.error("Error in POST /api/checks:", err);
      res.status(500).json({ error: "Failed to add check" });
    }
  });

  // Fjern en sjekk
  router.delete("/", async (req, res) => {
    const { spot_id, date } = req.body;
    if (!spot_id || !date)
      return res.status(400).json({ error: "Missing spot_id or date" });

    try {
      await pool.query("DELETE FROM checks WHERE spot_id = $1 AND date = $2", [
        spot_id,
        date,
      ]);
      res.json({ success: true });
    } catch (err) {
      console.error("Error in DELETE /api/checks:", err);
      res.status(500).json({ error: "Failed to remove check" });
    }
  });

  return router;
};
