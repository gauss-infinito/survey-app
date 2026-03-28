const express = require("express");
const router = express.Router();
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

router.post("/register", async (req, res) => {
  try {
    let { email, code, age, gender, role } = req.body;

    const result = await pool.query(
      `INSERT INTO users (email, code, age, gender, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [email, code, age, gender, role]
    );

    const token = uuidv4();

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
  const { email, code } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND code = $2 AND active = true",
    [email]
  );

  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(code, user.code);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token });
});

module.exports = router;
