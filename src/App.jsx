import React, { useEffect, useState } from 'react';
import WeatherBackground from './components/WeatherBackground';
import { convertTemperature, getHumidityValue, getVisibilityValue, getWindDirection } from './components/Helper';
import { HumidityIcon, SunriseIcon, SunsetIcon, VisibilityIcon, WindIcon } from './components/Icons';


const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [suggestion, setSuggestion] = useState([]);
  const [unit, setUnit] = useState('C');
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (city.trim().length >= 3 && !weather) {
      const timer = setTimeout(() => fetchSuggestions(city), 500);
      return () => clearTimeout(timer);
    }
    setSuggestion([]);
  }, [city, weather]);

  const fetchSuggestions = async (query) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      res.ok ? setSuggestion(await res.json()) : setSuggestion([]);
    } catch {
      setSuggestion([]);
    }
  };

  const fetchWeatherData = async (url, name = '') => {
    setError('');
    setWeather(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error((await response.json()).message || 'City not found');
      const data = await response.json();
      setWeather(data);
      setCity(name || data.name);
      setSuggestion([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return setError("Please enter a valid city name");
    await fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`
    );
  };

  const getWeatherCondition = () => {
    if (!weather) return null;
    const currentTime = Date.now() / 1000;
    const isDay = currentTime > weather.sys.sunrise && currentTime < weather.sys.sunset;
    return {
      main: weather.weather[0].main,
      isDay: isDay
    };
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className='min-h-screen'>
      <WeatherBackground condition={getWeatherCondition()} />
      <div className='flex items-center justify-center p-6 min-h-screen'>
        <div className='bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-lg w-full text-white border border-white/20 relative z-10'>
          <h1 className='text-3xl font-bold text-center mb-8'>Weather App</h1>

          {!weather ? (
            <div>
              <form onSubmit={handleSearch} className='flex flex-col relative'>
                <div className='mb-6'>
                  <p className='block text-sm text-white/80 mb-4 text-center'>Enter City or Country </p>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder='Start typing...'
                    className='w-full p-3 rounded-lg border border-white/30 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition duration-300'
                  />
                </div>

                {suggestion.length > 0 && (
                  <div className='absolute top-full left-0 right-0 bg-white/10 backdrop-blur-md rounded-md mt-1 shadow-lg z-20 overflow-hidden border border-white/20'>
                    {suggestion.map((s) => (
                      <button
                        type='button'
                        key={`${s.lat}-${s.lon}`}
                        onClick={() => fetchWeatherData(
                          `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`,
                          `${s.name}, ${s.country}${s.state ? `, ${s.state}` : ''}`
                        )}
                        className='block w-full text-left px-4 py-2 hover:bg-white/20 transition-colors text-white border-b border-white/10 last:border-0'
                      >
                        {s.name}, {s.country}{s.state && `, ${s.state}`}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type='submit'
                  className='w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg text-lg'
                >
                  Get Weather
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* New Search Button */}
              <button
                onClick={() => { setWeather(null); setCity(''); setError(''); }}
                className='w-full py-3 mb-8 bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300'
              >
                New Search
              </button>

              {/* Location Name - FIXED: Now shows actual city name */}
              <h2 className='text-2xl font-bold text-center mb-6'>{weather.name}</h2>

              {/* Main Weather Info - Icon and Temperature side by side */}
              <div className='flex items-center justify-center gap-6 mb-8'>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className='w-24 h-24'
                />
                <div>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-5xl font-bold'>
                      {convertTemperature(weather.main.temp, unit)}
                    </span>
                    <button
                      onClick={() => setUnit(u => u === 'C' ? 'F' : 'C')}
                      className='text-2xl font-semibold hover:text-blue-300 transition-colors px-2'
                    >
                      °{unit}
                    </button>
                  </div>
                  <p className='text-lg capitalize mt-2'>{weather.weather[0].description}</p>
                </div>
              </div>

              {/* Weather Metrics - NO BOXES, just text in columns */}
              <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="text-center">
                  <div className='flex justify-center mb-2'>
                    <HumidityIcon />
                  </div>
                  <p className="font-semibold mb-1">Humidity</p>
                  <p className="text-sm">{weather.main.humidity}% ({getHumidityValue(weather.main.humidity)})</p>
                </div>

                <div className="text-center">
                  <div className='flex justify-center mb-2'>
                    <WindIcon />
                  </div>
                  <p className="font-semibold mb-1">Wind</p>
                  <p className="text-sm">{weather.wind.speed.toFixed(2)} m/s ({getWindDirection(weather.wind.deg)})</p>
                </div>

                <div className="text-center">
                  <div className='flex justify-center mb-2'>
                    <VisibilityIcon />
                  </div>
                  <p className="font-semibold mb-1">Visibility</p>
                  <p className="text-sm">{getVisibilityValue(weather.visibility)}</p>
                </div>
              </div>

              {/* Sunrise & Sunset - NO BOXES */}
              <div className='grid grid-cols-2 gap-6 mb-10'>
                <div className="text-center">
                  <div className='flex justify-center mb-2'>
                    <SunriseIcon />
                  </div>
                  <p className="font-semibold mb-1">Sunrise</p>
                  <p className="text-sm">{formatDate(weather.sys.sunrise)}</p>
                </div>

                <div className="text-center">
                  <div className='flex justify-center mb-2'>
                    <SunsetIcon />
                  </div>
                  <p className="font-semibold mb-1">Sunset</p>
                  <p className="text-sm">{formatDate(weather.sys.sunset)}</p>
                </div>
              </div>

              {/* Feels Like & Pressure - Inline text (no boxes) */}
              <div className='grid grid-cols-2 gap-6'>
                <div className="text-center">
                  <p className="font-semibold mb-1">Feels Like</p>
                  <p className="text-lg">
                    {convertTemperature(weather.main.feels_like, unit)} °{unit}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold mb-1">Pressure</p>
                  <p className="text-lg">{weather.main.pressure} hPa</p>
                </div>
              </div>

              {error && <p className='text-red-300 text-center mt-4'>{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;