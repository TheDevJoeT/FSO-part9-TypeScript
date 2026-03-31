import express from "express";

import { calculateBmi } from "./bmiCalculator.ts";

const app = express();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (_req, res) => {
  const height = Number(_req.query.height);
  const weight = Number(_req.query.weight);

  if (!height || !weight || isNaN(height) || isNaN(weight)) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  const bmi = calculateBmi(height, weight);

  return res.json({
    height,
    weight,
    bmi,
  });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
