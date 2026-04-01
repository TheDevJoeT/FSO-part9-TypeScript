import express from "express";
import { calculator } from "./multiplier.ts";
const app = express();

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.post("/calculate", (req, res) => {
  const { value1, value2, op } = req.body;

  if (isNaN(Number(value1)) || isNaN(Number(value2))) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  const result = calculator(Number(value1), Number(value2), op);

  return res.json({ result });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
