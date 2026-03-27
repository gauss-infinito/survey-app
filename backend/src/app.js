const express = require("express");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/surveys", require("./routes/surveys"));

app.listen(8080, () => {
  console.log("API rodando na porta 8080");
});
