import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Certo! App deve estar exportado com esse nome
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);