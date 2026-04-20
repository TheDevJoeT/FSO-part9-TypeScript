import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { Patient, Diagnosis } from "../../types";
import { apiBaseUrl } from "../../constants";

import { Male, Female } from "@mui/icons-material";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
      setPatient(data);
    };

    void fetchPatient();
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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
        <div
          key={entry.id}
          style={{
            border: "1px solid gray",
            marginBottom: "10px",
            padding: "10px",
          }}
        >
          <p>
            <strong>{entry.date}</strong> — {entry.description}
          </p>

          {/* ✅ diagnosis codes with descriptions */}
          {entry.diagnosisCodes && (
            <ul>
              {entry.diagnosisCodes.map((code) => {
                const diagnosis = diagnoses.find((d) => d.code === code);

                return (
                  <li key={code}>
                    {code} {diagnosis ? diagnosis.name : ""}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default PatientPage;
