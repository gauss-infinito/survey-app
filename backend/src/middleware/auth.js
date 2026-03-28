const jwt = require("jsonwebtoken");

module.exports = (roles = []) => {
  // garante array
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
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

      // valida role
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }
  };
};
