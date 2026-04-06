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

// Atualizar usuário
router.put("/:id", auth(["administrator"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { role, age, gender } = req.body;

    const fields = [];
    const values = [];

    if (role) {
      values.push(role);
      fields.push(`role = $${values.length}`);
    }

    if (age) {
      values.push(age);
      fields.push(`age = $${values.length}`);
    }

    if (gender) {
      values.push(gender);
      fields.push(`gender = $${values.length}`);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "Nenhum campo para atualizar" });
    }

    values.push(id);

    const query = `
      UPDATE users
      SET ${fields.join(", ")},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length}
    `;

    await pool.query(query, values);

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// Ativar / desativar usuário
router.patch("/:id/status", auth(["administrator"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    if (active === undefined) {
      return res.status(400).json({ error: "Campo 'active' é obrigatório" });
    }

    await pool.query(
      `
      UPDATE users
      SET active = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [active, id]
    );

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

// perfil do usuário
router.get("/me", auth(), async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, age, gender, role FROM users WHERE id = $1",
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// Listar usuários com filtros
router.get("/", auth(["administrator"]), async (req, res) => {
  try {
    const { role, active } = req.query;

    let query = `
      SELECT id, email, role, active, created_at
      FROM users
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      params.push(role);
      query += ` AND role = $${params.length}`;
    }

    if (active !== undefined) {
      params.push(active === "true");
      query += ` AND active = $${params.length}`;
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

module.exports = router;
