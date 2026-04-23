const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


app.get("/api/message", (req, res) => {
  res.json({
    message: "Backend Node.js !",
    env: process.env.NODE_ENV || "development",
  });
});

app.listen(PORT, () => {
  console.log(`Backend démarré sur le port ${PORT}`);
});