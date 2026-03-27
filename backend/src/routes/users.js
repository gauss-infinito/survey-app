const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

// Criar usuário (admin cria outros)
router.post("/", auth(["admin"]), async (req, res) => {
  const { name, email, password, role } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)",
    [name, email, hash, role]
  );

  res.sendStatus(201);
});

// Listar usuários
router.get("/", auth(["admin"]), async (req, res) => {
  const result = await pool.query("SELECT id, name, email, role FROM users");
  res.json(result.rows);
});

module.exports = router;
