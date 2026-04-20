import patients from "../../data/patients.ts";
import type { Patient, NonSensitivePatient, NewPatient } from "../types.ts";
import { v1 as uuid } from "uuid";

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...entry,
    entries: []
  };
  patients.push(newPatient);
  return newPatient;
};

const findById = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

export default {
  getPatients,
  getNonSensitivePatients,
  addPatient,
  findById,
};
