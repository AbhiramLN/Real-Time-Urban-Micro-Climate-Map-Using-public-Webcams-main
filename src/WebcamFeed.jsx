import React from "react";

const webcams = {
  "New York": "https://www.earthcam.com/usa/newyork/timessquare/?cam=tsrobo1",
  "London": "https://www.earthcam.com/usa/newyork/timessquare/?cam=tsrobo1",
  "Tokyo": "https://www.earthcam.com/usa/newyork/timessquare/?cam=tsrobo1",
  "Paris": "https://www.earthcam.com/usa/newyork/timessquare/?cam=tsrobo1",
  "Sydney": "https://www.earthcam.com/usa/newyork/timessquare/?cam=tsrobo1",
  "Mumbai": "https://www.earthcam.com/world/india/mumbai/gatewayofindia/?cam=gateway_hd",
  "Delhi": "https://www.earthcam.com/world/india/newdelhi/redfort/?cam=redfort_hd",
};

export default function WebcamFeed({ city }) {
  if (!city || !webcams[city]) {
    return (
      <div style={{ padding: "10px", width: "300px", background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white", borderRadius: "8px" }}>
        <h2 style={{ color: "#fff" }}>Webcam Feed</h2>
        <p>No webcam available for this location.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px", width: "300px", background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white", borderRadius: "8px" }}>
      <h2 style={{ color: "#fff" }}>Webcam Feed - <span style={{ color: "#ffd700" }}>{city}</span></h2>
      <iframe
        title={`Webcam for ${city}`}
        src={webcams[city]}
        width="280"
        height="210"
        frameBorder="0"
        allowFullScreen
        style={{ borderRadius: "8px" }}
      ></iframe>
    </div>
  );
}
