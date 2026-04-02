const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const surveys = await pool.query(
      "SELECT COUNT(*) FROM surveys WHERE user_id = $1",
      [userId]
    );

    const responses = await pool.query(
      "SELECT COUNT(*) FROM responses WHERE user_id = $1",
      [userId]
    );
    
    const surveys = await pool.query(
      "SELECT COUNT(*) FROM surveys WHERE user_id = $1",
      [userId]
    );

    const responses = await pool.query(
      "SELECT COUNT(*) FROM responses WHERE user_id = $1",
      [userId]
    );

    res.json({
      myTotalSurveys: Number(surveys.rows[0].count),
      myTotalResponses: Number(responses.rows[0].count),
      totalSurveys: Number(surveys.rows[0].count),
      totalResponses: Number(responses.rows[0].count),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no dashboard" });
  }
});

module.exports = router;
