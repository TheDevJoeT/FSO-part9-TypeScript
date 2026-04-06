import express from "express";

import { calculateBmi } from "./bmiCalculator.ts";
import { calculateExercises } from "./exerciseCalculator.ts";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (_req, res) => {
  const height = Number(_req.query.height);
  const weight = Number(_req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
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

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || target === undefined) {
    return res.status(400).json({
      error: "parameters missing",
    });
  }

  if (isNaN(Number(target))) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  if (!Array.isArray(daily_exercises)) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  if (daily_exercises.some((value: unknown) => isNaN(Number(value)))) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  const dailyHours = daily_exercises.map((value: unknown) => Number(value));
  const targetNumber = Number(target);

  const result = calculateExercises(dailyHours, targetNumber);

  return res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
