// backend/routes/stays.js
const express = require("express");

module.exports = function (pool) {
  const router = express.Router();

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
        `SELECT 
  s.*, 
  g.name, 
  g.car_number, 
  g.nationality, 
  g.vip
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
      // Sjekk om gjest allerede finnes med car_number
      const existingGuest = await pool.query(
        `SELECT id FROM guests WHERE TRIM(LOWER(car_number)) = TRIM(LOWER($1))`,
        [guest.car_number]
      );

      let guestId;

      if (existingGuest.rows.length > 0) {
        // ✅ Gjest finnes – IKKE oppdater noe, bare bruk ID
        guestId = existingGuest.rows[0].id;
      } else {
        // 🆕 Opprett ny gjest
        const newGuest = await pool.query(
          `INSERT INTO guests (name, car_number, nationality)
         VALUES ($1, $2, $3)
         RETURNING id`,
          [guest.name.trim(), guest.car_number.trim(), guest.nationality.trim()]
        );
        guestId = newGuest.rows[0].id;
      }

      // Uansett: lagre oppholdet
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

      res.status(201).json({ message: "Guest and stay added", guestId });
    } catch (err) {
      console.error("❌ Error in POST /api/stays:", err);
      res.status(500).json({ error: "Failed to add guest and stay" });
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

  router.delete("/:stayId", async (req, res) => {
    const { stayId } = req.params;
    try {
      await pool.query("DELETE FROM stays WHERE id = $1", [stayId]);
      res.sendStatus(200);
    } catch (err) {
      console.error("Failed to delete stay:", err);
      res.status(500).json({ error: "Delete stay failed" });
    }
  });

  /* router.post("/swap", async (req, res) => {
    const { stay1, stay2 } = req.body;

    console.log("🔁 Swap request received");
    console.log("📦 stay1 from client:", stay1);
    console.log("📦 stay2 from client:", stay2);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const { rows: rows1 } = await client.query(
        "SELECT * FROM stays WHERE id = $1",
        [stay1.id]
      );
      const { rows: rows2 } = await client.query(
        "SELECT * FROM stays WHERE id = $1",
        [stay2.id]
      );

      const s1 = rows1[0];
      const s2 = rows2[0];

      console.log("📡 Fetched stay1 from DB:", s1);
      console.log("📡 Fetched stay2 from DB:", s2);

      if (!s1 || !s2) {
        console.error("❌ One or both stays not found in DB");
        throw new Error("One or both stays not found");
      }

      // Første oppdatering
      const update1 = await client.query(
        `UPDATE stays
         SET spot_id = $1, check_in = $2, check_out = $3,
             adults = $4, children = $5, electricity = $6, price = $7
         WHERE id = $8 RETURNING *`,
        [
          s2.spot_id,
          s2.check_in,
          s2.check_out,
          s2.adults,
          s2.children,
          s2.electricity,
          s2.price,
          s1.id,
        ]
      );

      console.log("✅ Update 1 (stay1) result:", update1.rows[0]);

      // Andre oppdatering
      const update2 = await client.query(
        `UPDATE stays
         SET spot_id = $1, check_in = $2, check_out = $3,
             adults = $4, children = $5, electricity = $6, price = $7
         WHERE id = $8 RETURNING *`,
        [
          s1.spot_id,
          s1.check_in,
          s1.check_out,
          s1.adults,
          s1.children,
          s1.electricity,
          s1.price,
          s2.id,
        ]
      );

      console.log("✅ Update 2 (stay2) result:", update2.rows[0]);

      await client.query("COMMIT");
      res.json({
        message: "Swap complete",
        swapped: {
          stay1: update1.rows[0],
          stay2: update2.rows[0],
        },
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("🔥 Error during swap:", err);
      res.status(500).json({ error: "Failed to swap stays" });
    } finally {
      client.release();
    }
  }); */

  router.post("/partial-swap", async (req, res) => {
    const { stay1, stay2, fromDate } = req.body;

    console.log("🔁 Partial swap request:", { stay1, stay2, fromDate });

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Hent eksisterende opphold
      const { rows: rows1 } = await client.query(
        "SELECT * FROM stays WHERE id = $1",
        [stay1.id]
      );
      const { rows: rows2 } = await client.query(
        "SELECT * FROM stays WHERE id = $1",
        [stay2.id]
      );

      const s1 = rows1[0];
      const s2 = rows2[0];

      if (!s1 || !s2) {
        throw new Error("One or both stays not found");
      }

      // Forkort begge opphold til dagen før byttedato
      const cutoff = new Date(fromDate);
      cutoff.setHours(12, 0, 0, 0); // Setter typisk utsjekkstid
      const cutoffStr = cutoff.toISOString(); // behold tid

      await client.query("UPDATE stays SET check_out = $1 WHERE id = $2", [
        cutoffStr,
        s1.id,
      ]);
      await client.query("UPDATE stays SET check_out = $1 WHERE id = $2", [
        cutoffStr,
        s2.id,
      ]);

      // Opprett nytt opphold for s1 på s2 sin plass
      const checkInDate = new Date(fromDate);
      checkInDate.setHours(14, 0, 0, 0); // Sett innsjekk kl. 14
      const checkInStr = checkInDate.toISOString();

      await client.query(
        `INSERT INTO stays 
          (guest_id, spot_id, check_in, check_out, adults, children, electricity, price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          s1.guest_id,
          s2.spot_id,
          checkInStr,
          s1.check_out, // behold opprinnelig utsjekk
          s1.adults,
          s1.children,
          s1.electricity,
          s1.price,
        ]
      );

      // Og motsatt for s2
      await client.query(
        `INSERT INTO stays 
          (guest_id, spot_id, check_in, check_out, adults, children, electricity, price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          s2.guest_id,
          s1.spot_id,
          checkInStr,
          s2.check_out,
          s2.adults,
          s2.children,
          s2.electricity,
          s2.price,
        ]
      );

      await client.query("COMMIT");
      res.json({ message: "Partial swap completed successfully" });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("❌ Partial swap error:", err);
      res.status(500).json({ error: "Partial swap failed" });
    } finally {
      client.release();
    }
  });

  return router;
};
