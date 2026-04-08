import { useEffect, useState } from "react";
import axios from "axios";
import type { DiaryEntry, NewDiaryEntry } from "./types";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newWeather, setNewWeather] = useState("");
  const [newVisibility, setNewVisibility] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<DiaryEntry[]>("http://localhost:3001/api/diaries")
      .then((response) => {
        setDiaries(response.data);
      });
  }, []);

  const addDiary = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newEntry: NewDiaryEntry = {
      date: newDate,
      weather: newWeather,
      visibility: newVisibility,
    };

    try {
      const response = await axios.post<DiaryEntry>(
        "http://localhost:3001/api/diaries",
        newEntry,
      );

      setDiaries(diaries.concat(response.data));
      setNewDate("");
      setNewWeather("");
      setNewVisibility("");
      setError(null);
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
      <h1>Flight Diaries</h1>

      <h2>Add new entry</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <form onSubmit={addDiary}>
        <div>
          date
          <input value={newDate} onChange={(e) => setNewDate(e.target.value)} />
        </div>

        <div>
          weather
          <input
            value={newWeather}
            onChange={(e) => setNewWeather(e.target.value)}
          />
        </div>

        <div>
          visibility
          <input
            value={newVisibility}
            onChange={(e) => setNewVisibility(e.target.value)}
          />
        </div>

        <button type="submit">add</button>
      </form>

      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>visibility: {diary.visibility}</p>
          <p>weather: {diary.weather}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
