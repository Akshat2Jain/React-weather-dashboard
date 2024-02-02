// Forecast.js
import React from "react";

function ForecastDay({ day }) {
  return (
    <div className="forecast-day">
      <div className="date">{day.dt_txt}</div>
      <div className="temperature">{day.main.temp}°</div>
      <div className="description">{day.weather[0].description}</div>
      <img
        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
        alt=""
        className="icon"
      />
    </div>
  );
}

function Forecast({ forecastData }) {
  return (
    <div className="forecast">
      <h2>5-Day Forecast</h2>
      <div className="forecast-days">
        {forecastData.map((day) => (
          <ForecastDay key={day.dt} day={day} />
        ))}
      </div>
    </div>
  );
}

export default Forecast;
