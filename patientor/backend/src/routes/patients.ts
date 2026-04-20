import express, { type Request, type Response } from "express";
import patientService from "../services/patientService.ts";

import {
  NewPatientSchema,
  NewHospitalEntrySchema,
  NewHealthCheckEntrySchema,
  NewOccupationalEntrySchema,
} from "../types.ts";

import type {
  NonSensitivePatient,
  Patient,
  Entry,
  NewEntry,
} from "../types.ts";

import { z } from "zod";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getNonSensitivePatients());
});

router.get("/:id", (req, res: Response<Patient | undefined>) => {
  const patient = patientService.getPatientById(req.params.id);

  if (!patient) {
    return res.sendStatus(404);
  }

  return res.send(patient);
});

router.post("/", (req, res: Response<Patient | { error: unknown }>) => {
  try {
    const newPatient = NewPatientSchema.parse(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: e.issues });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
});

router.post(
  "/:id/entries",
  (
    req: Request<{ id: string }, Entry | { error: unknown }, unknown>,
    res: Response<Entry | { error: unknown }>,
  ) => {
    try {
      const body = req.body as { type: string };
      let newEntry;

      switch (body.type) {
        case "Hospital":
          newEntry = NewHospitalEntrySchema.parse(req.body);
          break;

        case "HealthCheck":
          newEntry = NewHealthCheckEntrySchema.parse(req.body);
          break;

        case "OccupationalHealthcare":
          newEntry = NewOccupationalEntrySchema.parse(req.body);
          break;

        default:
          throw new Error("Invalid entry type");
      }

      const addedEntry = patientService.addEntry(
        req.params.id,
        newEntry as NewEntry,
      );

      res.json(addedEntry);
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        res.status(400).json({ error: e.issues });
      } else {
        res.status(400).json({ error: "Unknown error" });
      }
    }
  },
);

export default router;
