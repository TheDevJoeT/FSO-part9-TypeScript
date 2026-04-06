import type { Diagnosis } from "../types.ts";
import diagnoses from "../../data/diagnoses.ts";

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

export default {
  getDiagnoses,
};
