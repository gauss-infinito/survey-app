const jwt = require("jsonwebtoken");
const pool = require("../db");

module.exports = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET não definido");
      return res.status(500).json({ error: "Erro de configuração" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // valida no banco
      const result = await pool.query(
        "SELECT id, role, active FROM users WHERE id = $1",
        [decoded.id]
      );

      const user = result.rows[0];

      if (!user || user.active !== true) {
        return res.status(401).json({ error: "Usuário inválido ou inativo" });
      }

      // valida role REAL do banco (não confiar no token)
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      // usa dados atualizados
      req.user = {
        id: user.id,
        role: user.role,
      };

      next();
    } catch (err) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }
  };
};
