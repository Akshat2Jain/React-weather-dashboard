import React, { useState } from "react";
import Forecast from "../components/Forecast";

const apikey = "976e8c30fda08ecc3c44b2015f17bda1";

const Weather = () => {
  const [locationInput, setLocationInput] = useState("");
  const [unitSelect, setUnitSelect] = useState("metric");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempCelsius, setTempCelsius] = useState(null);
  const [tempFahrenheit, setTempFahrenheit] = useState(null);

  const handleGetWeather = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${locationInput}&units=${unitSelect}&appid=${apikey}`
      );
      const result = await res.json();

      if (result.cod !== 200) {
        alert(result.message);
      } else {
        setWeatherData(result);
        setTempCelsius(result.main.temp);
        setTempFahrenheit(convertToFahrenheit(result.main.temp));
        // Fetch 5-day forecast
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${locationInput}&units=${unitSelect}&appid=${apikey}`
        );
        const forecastResult = await forecastRes.json();

        if (forecastResult.cod === "200") {
          setForecastData(
            forecastResult.list.filter((item, index) => index % 8 === 0)
          );
        }
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          setLoading(true);
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${unitSelect}&appid=${apikey}`
          );
          const result = await res.json();
          // console.log(result);

          if (result.cod !== 200) {
            alert(result.message);
          } else {
            setWeatherData(result);
            setTempCelsius(result.main.temp);
            setTempFahrenheit(convertToFahrenheit(result.main.temp));
            // Fetch 5-day forecast
            const forecastRes = await fetch(
              `https://api.openweathermap.org/data/2.5/forecast?q=${locationInput}&units=${unitSelect}&appid=${apikey}`
            );
            const forecastResult = await forecastRes.json();

            if (forecastResult.cod === "200") {
              setForecastData(
                forecastResult.list.filter((item, index) => index % 8 === 0)
              );
            }
          }
        } catch (error) {
          console.error(error);
          alert("Something went wrong. Please try again later.");
        } finally {
          setLoading(false);
        }
      });
    }
  };
  const convertToFahrenheit = (celsius) => {
    return (celsius * 9) / 5 + 32;
  };
  return (
    <>
      <div className="App">
        <div className="card">
          <div className="search">
            <input
              type="text"
              className="search-bar"
              placeholder="Enter City Name"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
            <button id="getWeatherButton" onClick={handleGetWeather}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 1024 1024"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
              </svg>
            </button>
            <button id="getLocationButton" onClick={handleGetLocation}>
              Use My Location
            </button>
            <select
              id="unitSelect"
              value={unitSelect}
              onChange={(e) => {
                setUnitSelect(e.target.value);
                setTempFahrenheit(convertToFahrenheit(tempCelsius));
              }}
            >
              <option value="metric" className="one">
                Celsius
              </option>
              <option value="imperial" className="one">
                Fahrenheit
              </option>
            </select>
          </div>

          {loading && <div className="weather loading">Loading...</div>}

          {weatherData && (
            <div className="weather">
              <h2 className="city">Weather in {weatherData.name}</h2>
              <h1 className="temp">
                {unitSelect === "metric"
                  ? `${tempCelsius} C`
                  : `${tempFahrenheit} F`}
              </h1>
              <div className="flex">
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                  alt=""
                  className="icon"
                />
                <div className="description">
                  {weatherData.weather[0].description}
                </div>
              </div>
              <div className="humidity">
                Humidity: {weatherData.main.humidity}%
              </div>
              <div className="wind">
                Wind Speed: {weatherData.wind.speed} km/h
              </div>
              <div className="min-max">
                Min Temp: {weatherData.main.temp_min}° | Max Temp:{" "}
                {weatherData.main.temp_max}°
              </div>
            </div>
          )}
          {forecastData.length > 0 && <Forecast forecastData={forecastData} />}
        </div>
      </div>
    </>
  );
};

export default Weather;
