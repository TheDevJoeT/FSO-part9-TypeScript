import { useEffect, useState } from "react";
import axios from "axios";
import type { DiaryEntry } from "./types";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    axios
      .get<DiaryEntry[]>("http://localhost:3001/api/diaries")
      .then((response) => {
        setDiaries(response.data);
      });
  }, []);

  return (
    <div>
      <h1>Flight Diaries</h1>
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
