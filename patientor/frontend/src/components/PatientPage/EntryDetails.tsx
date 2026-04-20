import { Entry, Diagnosis } from "../../types";
import HealthRatingBar from "../HealthRatingBar";

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryDetails = ({ entry, diagnoses }: Props) => {

  const assertNever = (value: never): never => {
    throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
  };

  return (
    <div style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}>
      <p>
        <strong>{entry.date}</strong>
      </p>

      {/* ✅ THIS IS CRITICAL */}
      <p>{entry.description}</p>

      {/* diagnosis codes */}
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map(code => {
            const diagnosis = diagnoses.find(d => d.code === code);
            return (
              <li key={code}>
                {code} {diagnosis ? diagnosis.name : ""}
              </li>
            );
          })}
        </ul>
      )}

      {(() => {
        switch (entry.type) {
          case "HealthCheck":
            return (
              <>
                <HealthRatingBar rating={entry.healthCheckRating} showText />
                <p>diagnosed by {entry.specialist}</p>
              </>
            );

          case "Hospital":
            return (
              <>
                <p>
                  discharge: {entry.discharge.date} — {entry.discharge.criteria}
                </p>
                <p>diagnosed by {entry.specialist}</p>
              </>
            );

          case "OccupationalHealthcare":
            return (
              <>
                <p>employer: {entry.employerName}</p>
                {entry.sickLeave && (
                  <p>
                    sick leave: {entry.sickLeave.startDate} — {entry.sickLeave.endDate}
                  </p>
                )}
                <p>diagnosed by {entry.specialist}</p>
              </>
            );

          default:
            return assertNever(entry);
        }
      })()}
    </div>
  );
};

export default EntryDetails;