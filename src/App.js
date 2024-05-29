import React, { useState, useEffect } from 'react';
import './App.css';
import { FaSearch } from "react-icons/fa";
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSuggestions = async (input) => {
    if (input.length > 2) {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=AIzaSyCd13OHS7ZM9W9ViJt5-Ej6JHH-48I7ANQ`);
        setSuggestions(response.data.predictions);
      } catch (err) {
        console.error('Error fetching suggestions', err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const search = async (location) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=eac9f783e2d449428cb103144242805&q=${location}&aqi=no`);
      setWeather(response.data);
      setError('');
    } catch (err) {
      setError('Error fetching weather data');
    }
    setLoading(false);
    setQuery(''); // Clear the input field
    setSuggestions([]); // Clear suggestions
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.description);
    search(suggestion.description);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    fetchSuggestions(e.target.value);
  };

  return (
    <div className="App">
      <div className="bg">
        <div className="container">
          <div className="box">
            <h2>Weather</h2>
            <div className="search">
              <input
                type="text"
                placeholder='Search'
                value={query}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && search(query)}
              />
              <div className="icn" onClick={() => search(query)}><FaSearch /></div>
              <ul className="suggestions">
                {suggestions.map((suggestion) => (
                  <li key={suggestion.place_id} onClick={() => handleSelectSuggestion(suggestion)}>
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            </div>
            <div className="output">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {error && <p>{error}</p>}
                  {weather.location && (
                    <>
                      <h6>{weather.location.name}</h6>
                      <h1>{weather.current.temp_c}°C</h1>
                      <p>Humidity: {weather.current.humidity}%</p>
                      <p>{weather.current.condition.text}</p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
