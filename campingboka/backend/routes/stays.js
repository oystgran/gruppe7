// backend/routes/stays.js
const express = require("express");
const verifyFirebaseToken = require("../middlewares/authMiddleware");

module.exports = function (pool) {
  const router = express.Router();

  async function hasOverlap(pool, spotId, start, end, excludeStayId = null) {
    const query = `
      SELECT 1 FROM stays
      WHERE spot_id = $1
        AND NOT (check_out <= $2 OR check_in >= $3)
        ${excludeStayId ? "AND id != $4" : ""}
      LIMIT 1
    `;

    const params = [spotId, start, end];
    if (excludeStayId) params.push(excludeStayId);

    const result = await pool.query(query, params);
    return result.rowCount > 0;
  }

  // GET stays for selected date (with guest info)
  router.get("/", verifyFirebaseToken, async (req, res) => {
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
  AND DATE(s.check_out) > $1::date
ORDER BY s.check_in`,
        [date]
      );
      result.rows.forEach((row) => {
        row.check_in = row.check_in.toISOString(); // behold tid og UTC
        row.check_out = row.check_out.toISOString();
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
  router.post("/", verifyFirebaseToken, async (req, res) => {
    const { guest, stay } = req.body;

    try {
      // Sjekk om gjest allerede finnes med car_number
      const existingGuest = await pool.query(
        `SELECT id FROM guests WHERE TRIM(LOWER(car_number)) = TRIM(LOWER($1))`,
        [guest.car_number]
      );

      let guestId;

      if (existingGuest.rows.length > 0) {
        // Gjest finnes – IKKE oppdater noe, bare bruk ID
        guestId = existingGuest.rows[0].id;
      } else {
        // Opprett ny gjest
        const newGuest = await pool.query(
          `INSERT INTO guests (name, car_number, nationality)
         VALUES ($1, $2, $3)
         RETURNING id`,
          [guest.name.trim(), guest.car_number.trim(), guest.nationality.trim()]
        );
        guestId = newGuest.rows[0].id;
      }

      if (await hasOverlap(pool, stay.spot_Id, stay.check_in, stay.check_out)) {
        return res.status(400).json({
          error: "The selected spot is already booked during that period.",
        });
      }

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
      console.error("Error in POST /api/stays:", err);
      res.status(500).json({ error: "Failed to add guest and stay" });
    }
  });

  router.get("/archive", verifyFirebaseToken, async (req, res) => {
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

  router.put("/:stayId", verifyFirebaseToken, async (req, res) => {
    const { stayId } = req.params;
    const { guestId, guest, stay } = req.body;

    try {
      // Riktig overlapp-sjekk (tillater utsjekk og innsjekk samme dag)
      if (
        await hasOverlap(
          pool,
          stay.spot_Id,
          stay.check_in,
          stay.check_out,
          stayId
        )
      ) {
        return res.status(400).json({
          error: "The selected spot is already booked during that period.",
        });
      }

      // Oppdater gjest
      await pool.query(
        `UPDATE guests
         SET name = $1, car_number = $2, nationality = $3
         WHERE id = $4`,
        [guest.name, guest.car_number, guest.nationality, guestId]
      );

      // Oppdater opphold
      await pool.query(
        `UPDATE stays
         SET spot_id = $1, check_in = $2, check_out = $3,
             adults = $4, children = $5, electricity = $6, price = $7
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
      console.error(" PUT error:", err);
      res.status(500).json({ error: "Failed to update guest and stay" });
    }
  });

  router.delete("/:stayId", verifyFirebaseToken, async (req, res) => {
    const { stayId } = req.params;
    try {
      await pool.query("DELETE FROM stays WHERE id = $1", [stayId]);
      res.sendStatus(200);
    } catch (err) {
      console.error("Failed to delete stay:", err);
      res.status(500).json({ error: "Delete stay failed" });
    }
  });

  router.post("/partial-swap", verifyFirebaseToken, async (req, res) => {
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

      const cutoff = new Date(fromDate);
      cutoff.setHours(12, 0, 0, 0); // utsjekk
      const cutoffStr = cutoff.toISOString();

      const checkIn1 = new Date(s1.check_in);
      const checkOut1 = new Date(s1.check_out);
      const checkIn2 = new Date(s2.check_in);
      const checkOut2 = new Date(s2.check_out);

      const msPerNight = 1000 * 60 * 60 * 24;

      // Beregn netter for s1
      const totalNights1 = Math.round((checkOut1 - checkIn1) / msPerNight);
      const firstPartNights1 = Math.round((cutoff - checkIn1) / msPerNight);
      const secondPartNights1 = totalNights1 - firstPartNights1;

      const pricePerNight1 = s1.price / totalNights1;
      const firstPartPrice1 = Math.round(pricePerNight1 * firstPartNights1);
      const secondPartPrice1 = s1.price - firstPartPrice1;

      // Beregn netter for s2
      const totalNights2 = Math.round((checkOut2 - checkIn2) / msPerNight);
      const firstPartNights2 = Math.round((cutoff - checkIn2) / msPerNight);
      const secondPartNights2 = totalNights2 - firstPartNights2;

      const pricePerNight2 = s2.price / totalNights2;
      const firstPartPrice2 = Math.round(pricePerNight2 * firstPartNights2);
      const secondPartPrice2 = s2.price - firstPartPrice2;

      const checkInStr = new Date(fromDate);
      checkInStr.setHours(14, 0, 0, 0); // innsjekk
      const checkInISO = checkInStr.toISOString();

      await client.query(
        "UPDATE stays SET check_out = $1, price = $2 WHERE id = $3",
        [cutoffStr, firstPartPrice1, s1.id]
      );
      await client.query(
        "UPDATE stays SET check_out = $1, price = $2 WHERE id = $3",
        [cutoffStr, firstPartPrice2, s2.id]
      );

      await client.query(
        `INSERT INTO stays 
          (guest_id, spot_id, check_in, check_out, adults, children, electricity, price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          s1.guest_id,
          s2.spot_id,
          checkInStr,
          s1.check_out,
          s1.adults,
          s1.children,
          s1.electricity,
          secondPartPrice1,
        ]
      );

      // ➕ Nytt opphold for s2 på s1 sin plass
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
          secondPartPrice2,
        ]
      );

      await client.query("COMMIT");
      res.json({ message: "Partial swap completed successfully" });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Partial swap error:", err);
      res.status(500).json({ error: err.message || "Partial swap failed" });
    } finally {
      client.release();
    }
  });

  router.post("/move", verifyFirebaseToken, async (req, res) => {
    const { stayId, newSpotId, fromDate } = req.body;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const { rows } = await client.query("SELECT * FROM stays WHERE id = $1", [
        stayId,
      ]);
      const stay = rows[0];
      if (!stay) throw new Error("Stay not found");

      const from = new Date(fromDate);
      const fromCheckIn = new Date(from);
      fromCheckIn.setHours(14, 0, 0, 0); // innsjekk

      const checkIn = new Date(stay.check_in);
      const checkOut = new Date(stay.check_out);

      if (from >= checkOut) {
        throw new Error("fromDate must be before original check_out");
      }

      const sameDay = from.toDateString() === checkIn.toDateString();

      //Sjekk om det finnes et overlappende opphold på den nye plassen i perioden fra -> stay.check_out
      if (
        await hasOverlap(
          pool,
          newSpotId,
          fromCheckIn.toISOString(),
          stay.check_out.toISOString(),
          stayId
        )
      ) {
        const conflict = await pool.query(
          `SELECT check_in, check_out, guest_id FROM stays
           WHERE spot_id = $1
             AND NOT (check_out <= $2 OR check_in >= $3)
             AND id != $4
           LIMIT 1`,
          [newSpotId, from.toISOString(), stay.check_out.toISOString(), stayId]
        );

        const conflictStay = conflict.rows[0];
        if (conflictStay) {
          throw new Error(
            `Cannot move: Target spot ${newSpotId} has a conflicting stay from ` +
              `${conflictStay.check_in} to ${conflictStay.check_out}.`
          );
        }
      }

      if (sameDay) {
        await client.query("UPDATE stays SET spot_id = $1 WHERE id = $2", [
          newSpotId,
          stayId,
        ]);
      } else {
        // 1. Forkort originalt opphold
        const cutoff = new Date(from);
        cutoff.setHours(12, 0, 0, 0); // utsjekk
        const cutoffStr = cutoff.toISOString();

        // Beregn antall netter i første og andre del
        const msPerNight = 1000 * 60 * 60 * 24;
        const totalNights = Math.round((checkOut - checkIn) / msPerNight);
        const firstPartNights = Math.round((cutoff - checkIn) / msPerNight);
        const secondPartNights = totalNights - firstPartNights;

        // Fordel pris proporsjonalt
        const pricePerNight = stay.price / totalNights;
        const firstPartPrice = Math.round(pricePerNight * firstPartNights);
        const secondPartPrice = stay.price - firstPartPrice;

        await client.query(
          "UPDATE stays SET check_out = $1, price = $2 WHERE id = $3",
          [cutoffStr, firstPartPrice, stayId]
        );

        // 2. Lag nytt opphold fra ny dato på ny plass
        const newCheckIn = new Date(from);
        newCheckIn.setHours(14, 0, 0, 0); // innsjekk
        const newCheckInStr = newCheckIn.toISOString();

        await client.query(
          `INSERT INTO stays 
           (guest_id, spot_id, check_in, check_out, adults, children, electricity, price)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            stay.guest_id,
            newSpotId,
            newCheckInStr,
            stay.check_out.toISOString(),
            stay.adults,
            stay.children,
            stay.electricity,
            secondPartPrice,
          ]
        );
      }

      await client.query("COMMIT");
      res.json({ message: "Guest moved to new spot from selected date" });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(" Move error:", err);
      res.status(500).json({ error: err.message || "Failed to move guest" });
    } finally {
      client.release();
    }
  });
  /* 
  router.post("/move", async (req, res) => {
    const { stayId, newSpotId, fromDate } = req.body;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const { rows } = await client.query("SELECT * FROM stays WHERE id = $1", [
        stayId,
      ]);
      const stay = rows[0];

      if (!stay) throw new Error("Stay not found");

      // Forkort det gamle oppholdet
      const cutoff = new Date(fromDate);
      cutoff.setHours(12, 0, 0, 0);
      const cutoffStr = cutoff.toISOString();

      // 🚫 Ikke trekk fra én dag hvis fromDate og check_in er samme dag
      const sameDay =
        new Date(stay.check_in).toDateString() ===
        new Date(fromDate).toDateString();

      if (sameDay) {
        // Bare slett stayen istedenfor å splitte
        await client.query("DELETE FROM stays WHERE id = $1", [stay.id]);
      } else {
        // Forkort stay som vanlig
        await client.query("UPDATE stays SET check_out = $1 WHERE id = $2", [
          cutoffStr,
          stay.id,
        ]);
      }

      await client.query("UPDATE stays SET check_out = $1 WHERE id = $2", [
        cutoffStr,
        stay.id,
      ]);

      // Lag nytt opphold på ny plass fra fromDate til original check_out
      await client.query(
        `INSERT INTO stays 
          (guest_id, spot_id, check_in, check_out, adults, children, electricity, price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          stay.guest_id,
          newSpotId,
          fromDate,
          stay.check_out, // behold opprinnelig utsjekk
          stay.adults,
          stay.children,
          stay.electricity,
          stay.price,
        ]
      );

      await client.query("COMMIT");
      res.json({ message: "Guest moved successfully" });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("❌ Move error:", err);
      res.status(500).json({ error: "Failed to move guest" });
    } finally {
      client.release();
    }
  }); */

  return router;
};
