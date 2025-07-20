import React from "react";

const Loader = () => (
  <div className="loader" role="status" aria-live="polite" aria-label="Loading weather data">
    <svg className="spinner" viewBox="0 0 50 50" aria-hidden="true">
      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
    </svg>
  </div>
);

export default Loader;