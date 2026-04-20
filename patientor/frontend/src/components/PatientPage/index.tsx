import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Button,
} from "@mui/material";

import { Patient, Diagnosis, Entry } from "../../types";
import { apiBaseUrl } from "../../constants";

import { Male, Female } from "@mui/icons-material";
import EntryDetails from "./EntryDetails";
import patientService from "../../services/patients";

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false); // ✅ IMPORTANT

  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const [newEntry, setNewEntry] = useState({
    date: "",
    description: "",
    specialist: "",

    healthCheckRating: 0,

    dischargeDate: "",
    dischargeCriteria: "",

    employerName: "",
    sickLeaveStart: "",
    sickLeaveEnd: "",
  });

  useEffect(() => {
    const fetchPatient = async () => {
      const { data } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${id}`
      );
      setPatient(data);
    };

    void fetchPatient();
  }, [id]);

  if (!patient) return <div>Loading...</div>;

  const submitNewEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      let entryToSend;

      const base = {
        date: newEntry.date,
        description: newEntry.description,
        specialist: newEntry.specialist,
        diagnosisCodes: diagnosisCodes.length ? diagnosisCodes : undefined,
      };

      switch (entryType) {
        case "HealthCheck":
          entryToSend = {
            ...base,
            type: "HealthCheck",
            healthCheckRating: newEntry.healthCheckRating,
          };
          break;

        case "Hospital":
          entryToSend = {
            ...base,
            type: "Hospital",
            discharge: {
              date: newEntry.dischargeDate,
              criteria: newEntry.dischargeCriteria,
            },
          };
          break;

        case "OccupationalHealthcare":
          entryToSend = {
            ...base,
            type: "OccupationalHealthcare",
            employerName: newEntry.employerName,
            sickLeave:
              newEntry.sickLeaveStart && newEntry.sickLeaveEnd
                ? {
                    startDate: newEntry.sickLeaveStart,
                    endDate: newEntry.sickLeaveEnd,
                  }
                : undefined,
          };
          break;

        default:
          throw new Error("Unhandled type");
      }

      const addedEntry: Entry = await patientService.addEntry(id!, entryToSend);

      setPatient((prev) =>
        prev ? { ...prev, entries: prev.entries.concat(addedEntry) } : prev
      );

      setError(null);
      setShowForm(false); // ✅ CLOSE FORM AFTER SUBMIT

    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const message =
          e.response?.data?.error?.[0]?.message || "Something went wrong";
        setError(message);
      } else {
        setError("Unknown error");
      }
    }
  };

  return (
    <div>
      {/* PATIENT INFO */}
      <h2>
        {patient.name}
        {patient.gender === "male" && <Male />}
        {patient.gender === "female" && <Female />}
      </h2>

      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <p>date of birth: {patient.dateOfBirth}</p>

      <h3>entries</h3>

      {patient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}

      {/* ✅ REQUIRED BUTTON FOR TEST */}
      <Button
        variant="contained"
        onClick={() => setShowForm(true)}
        sx={{ mt: 2 }}
      >
        Add New Entry
      </Button>

      {/* ✅ CONDITIONAL FORM */}
      {showForm && (
        <>
          <h3>Add new entry</h3>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <FormControl fullWidth>
            <InputLabel>Entry Type</InputLabel>
            <Select
              value={entryType}
              label="Entry Type"
              onChange={(e) => setEntryType(e.target.value as EntryType)}
            >
              <MenuItem value="HealthCheck">Health Check</MenuItem>
              <MenuItem value="Hospital">Hospital</MenuItem>
              <MenuItem value="OccupationalHealthcare">
                Occupational Healthcare
              </MenuItem>
            </Select>
          </FormControl>

          <form onSubmit={submitNewEntry}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newEntry.date}
              onChange={(e) =>
                setNewEntry({ ...newEntry, date: e.target.value })
              }
            />

            <TextField
              label="Description"
              fullWidth
              value={newEntry.description}
              onChange={(e) =>
                setNewEntry({ ...newEntry, description: e.target.value })
              }
            />

            <TextField
              label="Specialist"
              fullWidth
              value={newEntry.specialist}
              onChange={(e) =>
                setNewEntry({ ...newEntry, specialist: e.target.value })
              }
            />

            <FormControl fullWidth>
              <InputLabel>Diagnosis Codes</InputLabel>
              <Select
                multiple
                value={diagnosisCodes}
                onChange={(e) =>
                  setDiagnosisCodes(e.target.value as string[])
                }
                input={<OutlinedInput label="Diagnosis Codes" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {diagnoses.map((d) => (
                  <MenuItem key={d.code} value={d.code}>
                    <Checkbox checked={diagnosisCodes.includes(d.code)} />
                    <ListItemText primary={`${d.code} ${d.name}`} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Add
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default PatientPage;