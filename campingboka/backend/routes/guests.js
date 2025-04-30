module.exports = (pool) => {
  const express = require("express");
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM guests");
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    }
  });

  router.get("/search", async (req, res) => {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Missing query" });
    }

    try {
      const result = await pool.query(
        `SELECT id, name, car_number, nationality
         FROM guests
         WHERE name ILIKE $1 OR car_number ILIKE $1
         LIMIT 10`,
        [`%${query}%`]
      );

      res.json(result.rows);
    } catch (err) {
      console.error("Guest search failed:", err);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.put("/api/guests/:guestId", async (req, res) => {
    const { guestId } = req.params;
    const { name, car_number, nationality } = req.body;

    await db.query(
      `UPDATE guests SET name = $1, car_number = $2, nationality = $3 WHERE id = $4`,
      [name, car_number, nationality, guestId]
    );

    res.sendStatus(200);
  });

  return router;
};
