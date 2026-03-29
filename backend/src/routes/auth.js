const express = require("express");
const router = express.Router();
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

function generateCode(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

router.post("/register", async (req, res) => {
  try {
    let { email, age, gender } = req.body;

    if (!email || !age || !! !gender) {
      return res.status(400).json({ error: "E-mail, idade e gênero são obrigatórios" });
    }

    const code = generateCode();

    const userRole = "respondent";

    const result = await pool.query(
      `INSERT INTO users (email, code, age, gender, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [email, code, age, gender, userRole]
    );

    const token = jwt.sign(
      { id: result.rows[0].id, role: userRole },
      process.env.JWT_SECRET || "secret"
    );

    res.status(201).json({
      token,
      userId: result.rows[0].id,
      code,
    });
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Email e código são obrigatórios" });
    }

    if (!user.active) {
      return res.status(403).json({ error: "Usuário inativo" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND code = $2 AND active = true",
      [email, code]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret"
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no login" });
  }
});

module.exports = router;
