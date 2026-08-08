import React from "react";
import ReactDOM from "react-dom/client";
import StrongholdDemo from "./StrongholdDemo.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div style={{ minHeight: "100vh", padding: 16, boxSizing: "border-box", background: "#e8e6e1" }}>
      <StrongholdDemo />
    </div>
  </React.StrictMode>
);
