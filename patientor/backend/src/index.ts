import express from "express";
import diagnosesRouter from "./routes/diagnoses.ts";
import patientsRouter from "./routes/patients.ts";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/diagnoses", diagnosesRouter);
app.use("/api/patients", patientsRouter);

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
