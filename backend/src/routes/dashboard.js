const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const surveys = await pool.query(
      "SELECT COUNT(*) FROM surveys",
      [userId]
    );

    const responses = await pool.query(
      "SELECT COUNT(*) FROM responses",
      [userId]
    );
    
    const my_surveys = await pool.query(
      "SELECT COUNT(*) FROM surveys WHERE user_id = $1",
      [userId]
    );

    const my_responses = await pool.query(
      "SELECT COUNT(*) FROM responses WHERE user_id = $1",
      [userId]
    );

    res.json({
      totalSurveys: Number(surveys.rows[0].count),
      totalResponses: Number(responses.rows[0].count),
      myTotalSurveys: Number(my_surveys.rows[0].count),
      myTotalResponses: Number(my_responses.rows[0].count),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no dashboard" });
  }
});

module.exports = router;
