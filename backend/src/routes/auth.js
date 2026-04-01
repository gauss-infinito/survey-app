const express = require("express");
const router = express.Router();
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

function generateCode(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(length);

  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }

  return result;
}

router.post("/recover", async (req, res) => {
  try {
    let { email, age, gender } = req.body;

    if (!email || !age || !gender) {
      return res.status(400).json({ error: "Dados obrigatórios" });
    }

    const result = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND age = $2 AND gender = $3 AND active = true",
      [email, age, gender]
    );

    const user = result.rows[0];

    if (user) {
      const newCode = generateCode();
      const expiration = new Date(Date.now() + 15 * 60 * 1000);

      await pool.query(
        "UPDATE users SET code = $1, code_expiration = $2 WHERE id = $3",
        [newCode, expiration, user.id]
      );

      // aqui seria envio de email
    }

    res.json({
      message: "Código regerado, se os dados estiverem corretos, você receberá um código",
      code: newCode,
    });

  } catch (err) {
    console.error("DB ERROR:", err.message, err.detail);
    res.status(500).json({ error: "Erro na recuperação" });
  }
});

router.post("/register", async (req, res) => {
  try {
    let { email, age, gender } = req.body;

    if (!email || !age || !gender) {
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
    console.error("DB ERROR:", err.message, err.detail);

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

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND code = $2",
      [email, code]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    if (!user.active) {
      return res.status(403).json({ error: "Usuário inativo" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret"
    );

    res.json({ token });

  } catch (err) {
    console.error("DB ERROR:", err.message, err.detail);
    res.status(500).json({ error: "Erro no login" });
  }
});

module.exports = router;
