import { Entry } from "../../types";
import { Diagnosis } from "../../types";

import { LocalHospital, Work, Favorite } from "@mui/icons-material";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryDetails = ({ entry, diagnoses }: Props) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <div
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>{entry.date}</strong> <LocalHospital />
          </p>
          <p>
            <i>{entry.description}</i>
          </p>

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

          <p>
            discharge: {entry.discharge.date} — {entry.discharge.criteria}
          </p>
          <p>diagnose by {entry.specialist}</p>
        </div>
      );

    case "OccupationalHealthcare":
      return (
        <div
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>{entry.date}</strong> <Work /> {entry.employerName}
          </p>
          <p>
            <i>{entry.description}</i>
          </p>

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

          <p>diagnose by {entry.specialist}</p>
        </div>
      );

    case "HealthCheck":
      return (
        <div
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>{entry.date}</strong> <Favorite />
          </p>
          <p>
            <i>{entry.description}</i>
          </p>

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

          <p>diagnose by {entry.specialist}</p>
        </div>
      );

    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
