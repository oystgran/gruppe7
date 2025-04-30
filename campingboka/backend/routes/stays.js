// backend/routes/stays.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET stays for selected date (with guest info)
router.get("/", async (req, res) => {
  const { date } = req.query;
  console.log("🔍 Request received with date:", date); // Debug

  if (!date) {
    return res.status(400).json({ error: "Missing 'date' query parameter" });
  }

  const dayjs = require("dayjs");
  if (!dayjs(date).isValid()) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  console.log("🔎 Kall til /api/stays med dato:", date);
  try {
    const result = await pool.query(
      `SELECT s.*, g.name, g.car_number, g.nationality
       FROM stays s
       JOIN guests g ON s.guest_id = g.id
       WHERE s.check_in < $1::date + interval '1 day'
         AND s.check_out >= $1::date
       ORDER BY s.check_in`,
      [date]
    );
    result.rows.forEach((row) => {
      row.check_in = row.check_in.toISOString().split("T")[0];
      row.check_out = row.check_out.toISOString().split("T")[0];
    });
    res.json(result.rows);
  } catch (err) {
    console.error("🔥 FULL FEIL I /api/stays:");
    console.error("Melding:", err.message);
    console.error("Stack trace:", err.stack);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST add guest and stay
router.post("/", async (req, res) => {
  const { guest, stay } = req.body;
  try {
    const guestResult = await pool.query(
      `INSERT INTO guests (name, car_number, nationality)
       VALUES ($1, $2, $3) RETURNING id`,
      [guest.name, guest.car_number, guest.nationality]
    );
    const guestId = guestResult.rows[0].id;

    await pool.query(
      `INSERT INTO stays (guest_id, spot_id, check_in, check_out, adults, children, electricity, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        guestId,
        stay.spot_Id,
        stay.check_in,
        stay.check_out,
        stay.adults,
        stay.children,
        stay.electricity,
        stay.price,
      ]
    );

    res.status(201).json({ message: "Guest and stay added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add guest and stay" });
  }
});

// DELETE stay and possibly guest
router.delete("/:stayId", async (req, res) => {
  const { stayId } = req.params;
  const { guestId } = req.query;

  try {
    await pool.query(`DELETE FROM stays WHERE id = $1`, [stayId]);

    const checkResult = await pool.query(
      `SELECT 1 FROM stays WHERE guest_id = $1 LIMIT 1`,
      [guestId]
    );

    if (checkResult.rowCount === 0) {
      await pool.query(`DELETE FROM guests WHERE id = $1`, [guestId]);
      res.json({ message: "Stay and guest deleted" });
    } else {
      res.json({ message: "Stay deleted; guest has other stays" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete stay and/or guest" });
  }
});

router.get("/archive", async (req, res) => {
  const { start, end } = req.query;

  try {
    const result = await pool.query(
      `SELECT s.*, g.name, g.car_number, g.nationality
         FROM stays s
         JOIN guests g ON s.guest_id = g.id
         WHERE (
           (s.check_in BETWEEN $1 AND $2)
           OR (s.check_out BETWEEN $1 AND $2)
           OR (s.check_in <= $1 AND s.check_out >= $2)
         )
         ORDER BY s.check_in`,
      [start, end]
    );

    // Formatér datoene for frontend
    const formatted = result.rows.map((row) => ({
      ...row,
      Startdato: row.check_in.toISOString().split("T")[0],
      Sluttdato: row.check_out.toISOString().split("T")[0],
      Plass: row.spot_id,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Archive query failed" });
  }
});

router.put("/:stayId", async (req, res) => {
  const { stayId } = req.params;
  const { guestId, guest, stay } = req.body;

  try {
    await pool.query(
      `UPDATE guests
       SET name = $1, car_number = $2, nationality = $3
       WHERE id = $4`,
      [guest.name, guest.car_number, guest.nationality, guestId]
    );

    await pool.query(
      `UPDATE stays
       SET spot_id = $1, check_in = $2, check_out = $3, adults = $4, children = $5, electricity = $6, price = $7
       WHERE id = $8`,
      [
        stay.spot_Id,
        stay.check_in,
        stay.check_out,
        stay.adults,
        stay.children,
        stay.electricity,
        stay.price,
        stayId,
      ]
    );

    res.json({ message: "Guest and stay updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update guest and stay" });
  }
});

module.exports = router;
