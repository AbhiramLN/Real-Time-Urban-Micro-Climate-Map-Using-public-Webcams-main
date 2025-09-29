import React from "react";

export default function Dashboard({ weatherData }) {
  if (!weatherData) {
    return (
      <div style={{ padding: "10px", width: "300px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", borderRadius: "8px" }}>
        <h2 style={{ color: "#fff" }}>Dashboard</h2>
        <p>Select a location on the map to see detailed climate data.</p>
      </div>
    );
  }

  const {
    name,
    country,
    temp,
    description,
    humidity,
    wind,
    forecast,
    icon,
  } = weatherData;

  return (
    <div style={{ padding: "10px", width: "300px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", borderRadius: "8px" }}>
      <h2 style={{ color: "#fff" }}>Dashboard</h2>
      <h3 style={{ color: "#ffd700" }}>
        {name}, {country}
      </h3>
      <img
        src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
      />
      <p style={{ color: "#e0e0e0" }}>Temperature: <span style={{ color: "#ffeb3b" }}>{temp} °C</span></p>
      <p style={{ color: "#e0e0e0" }}>Condition: <span style={{ color: "#81c784" }}>{description}</span></p>
      <p style={{ color: "#e0e0e0" }}>Humidity: <span style={{ color: "#4fc3f7" }}>{humidity}%</span></p>
      <p style={{ color: "#e0e0e0" }}>Wind Speed: <span style={{ color: "#ffb74d" }}>{wind} m/s</span></p>
      <hr style={{ borderColor: "#fff" }} />
      <h4 style={{ color: "#fff" }}>Forecast (next 3 intervals)</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {forecast.map((f, idx) => (
          <li key={idx} style={{ color: "#e0e0e0" }}>
            {new Date(f.dt * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            : <span style={{ color: "#ffeb3b" }}>{f.main.temp}°C</span>, {f.weather[0].description}
            <img
              src={`http://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
              alt={f.weather[0].description}
              style={{ verticalAlign: "middle" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
