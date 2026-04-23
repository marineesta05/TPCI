const request = require("supertest");
const express = require("express");
const cors = require("cors");

function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "backend" });
  });

  app.get("/api/message", (req, res) => {
    res.json({ message: "Hello depuis le backend Node.js !" });
  });

  return app;
}

const app = buildApp();

describe("GET /health", () => {
  it("retourne status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("GET /api/message", () => {
  it("retourne un message", async () => {
    const res = await request(app).get("/api/message");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});