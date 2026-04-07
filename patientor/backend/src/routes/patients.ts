import express, { type Response } from "express";
import patientService from "../services/patientService.ts";
import type { NonSensitivePatient, Patient } from "../types.ts";
import { z } from "zod";
import { NewPatientSchema } from "../types.ts";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getNonSensitivePatients());
});

router.post("/", (_req, res: Response<Patient | { error: unknown }>) => {
  try {
    const newPatient = NewPatientSchema.parse(_req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: "Unknown error" });
    }
  }
});

export default router;
