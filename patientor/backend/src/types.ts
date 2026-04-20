import { z } from "zod";

/* =========================
   BASIC TYPES
========================= */

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export const GenderSchema = z.enum(["male", "female", "other"]);
export type Gender = z.infer<typeof GenderSchema>;

/* =========================
   PATIENT
========================= */

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  ssn: z.string(),
  gender: GenderSchema,
  occupation: z.string(),
});

export type NewPatient = z.infer<typeof NewPatientSchema>;

/* =========================
   ENTRY BASE
========================= */

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}

/* =========================
   HEALTH CHECK
========================= */

export const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;

export type HealthCheckRating =
  typeof HealthCheckRating[keyof typeof HealthCheckRating];

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

/* =========================
   HOSPITAL
========================= */

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}

/* =========================
   OCCUPATIONAL
========================= */

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

/* =========================
   UNION ENTRY
========================= */

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

/* =========================
   NEW ENTRY TYPES (IMPORTANT FIX)
========================= */

export type NewHospitalEntry = Omit<HospitalEntry, "id">;
export type NewHealthCheckEntry = Omit<HealthCheckEntry, "id">;
export type NewOccupationalEntry = Omit<
  OccupationalHealthcareEntry,
  "id"
>;

export type NewEntry =
  | NewHospitalEntry
  | NewHealthCheckEntry
  | NewOccupationalEntry;

/* =========================
   ZOD SCHEMAS (IMPORTANT FIX)
========================= */

const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

export const NewHospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string(),
    criteria: z.string(),
  }),
});

export const NewHealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
  ]),
});

export const NewOccupationalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
});

/* =========================
   PATIENT TYPES
========================= */

export interface Patient extends NewPatient {
  id: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;