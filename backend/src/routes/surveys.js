const router = require("express").Router();
const pool = require("../db");
const auth = require("../middleware/auth");
const { v4: uuid } = require("uuid");

// Criar pesquisa
router.post("/", auth(["administrator", "researcher"]), async (req, res) => {
  const client = await pool.connect();

  try {
    const { title, description, questions } = req.body;

    console.log("BODY:", req.body);

    if (!title) {
      return res.status(400).json({ error: "Título é obrigatório" });
    }

    await client.query("BEGIN");

    // 1. Criar survey
    const surveyResult = await client.query(
      `INSERT INTO surveys (title, description, status, user_id)
       VALUES ($1, $2, 'draft', $3)
       RETURNING id`,
      [title, description, req.user.id]
    );

    const surveyId = surveyResult.rows[0].id;

    // 2. Criar perguntas
    if (questions && questions.length > 0) {
      for (const q of questions) {
        const questionResult = await client.query(
          `INSERT INTO questions (survey_id, text, multiple)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [
            surveyId,
            q.text,
            q.multiple ?? false // 👈 importante
          ]
        );

        const questionId = questionResult.rows[0].id;

        // 3. Criar opções
        if (q.options && q.options.length > 0) {
          for (const opt of q.options) {
            await client.query(
              `INSERT INTO items (question_id, text)
               VALUES ($1, $2)`,
              [questionId, opt.text]
            );
          }
        }
      }
    }

    await client.query("COMMIT");

    res.status(201).json({ message: "Pesquisa criada com sucesso", id: surveyId });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Erro ao criar pesquisa" });
  } finally {
    client.release();
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
