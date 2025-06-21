// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { ROUTES } from "./ROUTES";

export default function PrivateRoute({ children }) {
  const isAuth = !!localStorage.getItem("usuarioLogado");
  return isAuth ? children : <Navigate to={ROUTES.LOGINPAGE} replace />;
}
