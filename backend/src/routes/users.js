const router = require("express").Router();
const pool = require("../db");
const auth = require("../middleware/auth");

// Criar usuário (admin)
router.post("/", auth(["administrator"]), async (req, res) => {
  try {
    const { email, code, age, gender, role } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Email e código são obrigatórios" });
    }

    const userRole = role || "respondent";

    await pool.query(
      `INSERT INTO users (email, code, age, gender, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [email, code, age, gender, userRole]
    );

    res.sendStatus(201);
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// perfil do usuário
router.get("/me", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, age, gender FROM users WHERE id = $1",
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// Listar usuários
router.get("/", auth(["administrator"]), async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, role, active, created_at FROM users"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

module.exports = router;
