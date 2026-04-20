import { z } from "zod";

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export const GenderSchema = z.enum(["male", "female", "other"]);
export type Gender = z.infer<typeof GenderSchema>;

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  ssn: z.string(),
  gender: GenderSchema,
  occupation: z.string(),
});

export type NewPatient = z.infer<typeof NewPatientSchema>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {}

export interface Patient extends NewPatient {
  id: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
