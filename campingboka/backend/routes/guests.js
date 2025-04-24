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

  return router;
};
