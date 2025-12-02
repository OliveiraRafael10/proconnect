import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; 
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import TokenExpiredHandler from "./components/TokenExpiredHandler";
import "./index.css";
import "./styles/mobile.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TokenExpiredHandler />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);