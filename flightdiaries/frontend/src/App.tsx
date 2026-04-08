import { useEffect, useState } from "react";
import axios from "axios";
import type { DiaryEntry, NewDiaryEntry } from "./types";

const weatherOptions = ["sunny", "rainy", "cloudy", "stormy", "windy"] as const;
const visibilityOptions = ["great", "good", "ok", "poor"] as const;

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newWeather, setNewWeather] =
    useState<(typeof weatherOptions)[number]>("sunny");
  const [newVisibility, setNewVisibility] =
    useState<(typeof visibilityOptions)[number]>("good");
  const [newComment, setNewComment] = useState("");
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
      comment: newComment || undefined,
    };

    try {
      const response = await axios.post<DiaryEntry>(
        "http://localhost:3001/api/diaries",
        newEntry,
      );

      setDiaries((prev) => prev.concat(response.data));

      // reset form
      setNewDate("");
      setNewWeather("sunny");
      setNewVisibility("good");
      setNewComment("");
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
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </div>

        <div>
          weather
          {weatherOptions.map((option) => (
            <label key={option} style={{ marginRight: 10 }}>
              {option}
              <input
                type="radio"
                name="weather"
                value={option}
                checked={newWeather === option}
                onChange={() => setNewWeather(option)}
              />
            </label>
          ))}
        </div>

        <div>
          visibility
          {visibilityOptions.map((option) => (
            <label key={option} style={{ marginRight: 10 }}>
              {option}
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={newVisibility === option}
                onChange={() => setNewVisibility(option)}
              />
            </label>
          ))}
        </div>

        <div>
          comment
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>

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
