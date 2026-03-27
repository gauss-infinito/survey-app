const router = require("express").Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const { v4: uuid } = require("uuid");

// Criar pesquisa
router.post("/", auth(["admin", "researcher"]), async (req, res) => {
  const { title, description } = req.body;

  const result = await pool.query(
    "INSERT INTO surveys (title, description, status) VALUES ($1,$2,'draft') RETURNING *",
    [title, description]
  );

  res.json(result.rows[0]);
});

// Publicar pesquisa
router.post("/:id/publish", auth(["admin", "researcher"]), async (req, res) => {
  const public_id = uuid();

  await pool.query(
    "UPDATE surveys SET status='published', public_id=$1 WHERE id=$2",
    [public_id, req.params.id]
  );

  res.json({ url: `/public/${public_id}` });
});

// Responder pesquisa (público)
router.post("/public/:publicId/respond", async (req, res) => {
  const { answers } = req.body;

  await pool.query(
    "INSERT INTO responses (survey_public_id, answers) VALUES ($1,$2)",
    [req.params.publicId, JSON.stringify(answers)]
  );

  res.json({ message: "Resposta enviada" });
});

module.exports = router;
