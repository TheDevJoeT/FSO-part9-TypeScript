import { useEffect, useState } from 'react';
import axios from 'axios';
import type { DiaryEntry, NewDiaryEntry } from './types';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newWeather, setNewWeather] = useState('');
  const [newVisibility, setNewVisibility] = useState('');

  useEffect(() => {
    axios
      .get<DiaryEntry[]>('http://localhost:3001/api/diaries')
      .then(response => {
        setDiaries(response.data);
      });
  }, []);

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newEntry: NewDiaryEntry = {
      date: newDate,
      weather: newWeather,
      visibility: newVisibility
    };

    axios
      .post<DiaryEntry>('http://localhost:3001/api/diaries', newEntry)
      .then(response => {
        setDiaries(diaries.concat(response.data));
        setNewDate('');
        setNewWeather('');
        setNewVisibility('');
      });
  };

  return (
    <div>
      <h1>Flight Diaries</h1>

      <h2>Add new entry</h2>
      <form onSubmit={addDiary}>
        <div>
          date
          <input
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
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

      {diaries.map(diary => (
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