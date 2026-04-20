import patients from "../../data/patients.ts";
import { v1 as uuid } from "uuid";

import type {
  Patient,
  NonSensitivePatient,
  NewPatient,
  Entry,
  NewEntry,
} from "../types.ts";

/* =========================
   GET
========================= */

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    })
  );
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

/* =========================
   ADD PATIENT
========================= */

const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...entry,
    entries: [],
  };

  patients.push(newPatient);
  return newPatient;
};

/* =========================
   ADD ENTRY (IMPORTANT FIX)
========================= */

const addEntry = (id: string, entry: NewEntry): Entry => {
  const patient = getPatientById(id);

  if (!patient) {
    throw new Error("Patient not found");
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);

  return newEntry;
};

export default {
  getPatients,
  getNonSensitivePatients,
  getPatientById,
  addPatient,
  addEntry,
};