const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: "https://survey-frontend-flaviacb-dev.apps.rm1.0a51.p1.openshiftapps.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());

app.use(express.json());

// log simples (opcional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/surveys", require("./routes/surveys"));
app.use("/dashboard", require("./routes/dashboard"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
