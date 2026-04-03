const router = require("express").Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const { v4: uuid } = require("uuid");

// Criar pesquisa
router.post("/", auth(["administrator", "researcher"]), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Título é obrigatório" });
    }

    const result = await pool.query(
      `INSERT INTO surveys (title, description, status, user_id)
       VALUES ($1, $2, 'draft', $3)
       RETURNING *`,
      [title, description, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar pesquisa" });
  }
});

// Publicar pesquisa
router.post("/:id/publish", auth(["administrator", "researcher"]), async (req, res) => {
  try {
    const surveyId = req.params.id;

    // garante que o usuário é dono
    const survey = await pool.query(
      "SELECT * FROM surveys WHERE id = $1",
      [surveyId]
    );

    if (!survey.rows.length) {
      return res.status(404).json({ error: "Survey não encontrada" });
    }

    if (survey.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: "Sem permissão" });
    }

    const public_id = uuid();

    await pool.query(
      "UPDATE surveys SET status='published', public_id=$1 WHERE id=$2",
      [public_id, surveyId]
    );

    res.json({ url: `/public/${public_id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao publicar pesquisa" });
  }
});

// Responder pesquisa (público)
router.post("/:id/reply", auth(), async (req, res) => {
  try {
    const { answers, age, gender } = req.body;

    if (!answers) {
      return res.status(400).json({ error: "Respostas são obrigatórias" });
    }

    await pool.query(
      `INSERT INTO responses (survey_id, age, gender, answers)
       VALUES ($1, $2, $3, $4)`,
      [req.params.id, age, gender, answers]
    );

    res.json({ message: "Resposta enviada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao enviar resposta" });
  }
});

// listar pesquisa
router.get("/", auth(), async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM surveys ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar surveys" });
  }
});

module.exports = router;
