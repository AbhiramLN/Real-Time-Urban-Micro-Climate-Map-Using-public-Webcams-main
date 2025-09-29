import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Dashboard from "./Dashboard";
import WebcamFeed from "./WebcamFeed";

// API key from .env
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// Map fly-to component
function FlyToLocation({ coords }) {
  const map = useMap();
  if (coords) map.flyTo(coords, 8);
  return null;
}

// Generate colored marker based on main weather
function getColoredIcon(weatherMain) {
  let colorUrl;
  switch (weatherMain.toLowerCase()) {
    case "clear":
      colorUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png";
      break;
    case "clouds":
      colorUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png";
      break;
    case "rain":
    case "drizzle":
      colorUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png";
      break;
    case "snow":
      colorUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-white.png";
      break;
    case "thunderstorm":
      colorUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png";
      break;
    default:
      colorUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";
  }

  return new L.Icon({
    iconUrl: colorUrl,
    shadowUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -40],
    shadowSize: [41, 41],
  });
}

// Marker component with dynamic icon and forecast
function WeatherMarker({ marker, setMarker }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      try {
        // Fetch current weather
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        if (data.cod !== 200) return;

        // Fetch 3-hour forecast
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastRes.json();

        setMarker({
          coords: [lat, lng],
          name: data.name,
          country: data.sys?.country,
          temp: data.main?.temp,
          description: data.weather[0]?.description,
          main: data.weather[0]?.main,
          humidity: data.main?.humidity,
          wind: data.wind?.speed,
          icon: data.weather[0]?.icon,
          forecast: forecastData.list.slice(0, 3), // next 3 intervals (~3 hours each)
        });
      } catch (err) {
        console.error(err);
      }
    },
  });

  if (!marker) return null;

  return (
    <Marker position={marker.coords} icon={getColoredIcon(marker.main)}>
      <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
        {marker.name} | {marker.temp}°C
      </Tooltip>
      <Popup>
        <div style={{ textAlign: "center" }}>
          <strong>
            {marker.name}, {marker.country}
          </strong>
          <br />
          <img
            src={`http://openweathermap.org/img/wn/${marker.icon}@2x.png`}
            alt={marker.description}
          />
          <br />
          🌡️ Temp: {marker.temp} °C
          <br />
          ☁️ Condition: {marker.description}
          <br />
          💧 Humidity: {marker.humidity}%
          <br />
          🌬️ Wind: {marker.wind} m/s
          <hr />
          <strong>Next 3 hours forecast:</strong>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {marker.forecast.map((f, idx) => (
              <li key={idx}>
                {new Date(f.dt * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                : {f.main.temp}°C, {f.weather[0].description}
                <img
                  src={`http://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
                  alt={f.weather[0].description}
                  style={{ verticalAlign: "middle" }}
                />
              </li>
            ))}
          </ul>
        </div>
      </Popup>
    </Marker>
  );
}

export default function App() {
  const [marker, setMarker] = useState(null);
  const [searchCity, setSearchCity] = useState("");

  // Handle city search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchCity) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          searchCity
        )}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod !== 200) {
        alert("City not found ❌");
        return;
      }

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

      setMarker({
        coords: [data.coord.lat, data.coord.lon],
        name: data.name,
        country: data.sys?.country,
        temp: data.main?.temp,
        description: data.weather[0]?.description,
        main: data.weather[0]?.main,
        humidity: data.main?.humidity,
        wind: data.wind?.speed,
        icon: data.weather[0]?.icon,
        forecast: forecastData.list.slice(0, 3),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch weather.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", display: "flex", gap: "20px" }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ textAlign: "center" }}>🌎 Enhanced Climate Map</h1>

        <form
          onSubmit={handleSearch}
          style={{ textAlign: "center", marginBottom: "10px" }}
        >
          <input
            type="text"
            placeholder="Enter city name"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <MapContainer
          center={[20, 78]}
          zoom={4}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <WeatherMarker marker={marker} setMarker={setMarker} />
          <FlyToLocation coords={marker?.coords} />
        </MapContainer>
      </div>

      <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <Dashboard weatherData={marker} />
        <WebcamFeed city={marker?.name} />
      </div>
    </div>
  );
}
