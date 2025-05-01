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
        `SELECT id, name, car_number, nationality, vip
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

  // ✅ Riktig oppdatering av gjest
  router.put("/:guestId", async (req, res) => {
    const { guestId } = req.params;
    const { name, car_number, nationality } = req.body;

    try {
      await pool.query(
        `UPDATE guests
         SET name = $1, car_number = $2, nationality = $3
         WHERE id = $4`,
        [name, car_number, nationality, guestId]
      );

      res.sendStatus(200);
    } catch (err) {
      console.error("Failed to update guest:", err);
      res.status(500).json({ error: "Update failed" });
    }
  });

  router.delete("/:guestId", async (req, res) => {
    const { guestId } = req.params;

    try {
      // Sjekk om gjesten har tilknyttede overnattinger
      const staysResult = await pool.query(
        "SELECT COUNT(*) FROM stays WHERE guest_id = $1",
        [guestId]
      );

      const stayCount = parseInt(staysResult.rows[0].count, 10);
      if (stayCount > 0) {
        return res.status(400).json({
          error: "Guest has linked stays and cannot be deleted",
        });
      }

      // Slett gjesten
      await pool.query("DELETE FROM guests WHERE id = $1", [guestId]);
      res.sendStatus(200);
    } catch (err) {
      console.error("Failed to delete guest:", err);
      res.status(500).json({ error: "Delete failed" });
    }
  });

  return router;
};
