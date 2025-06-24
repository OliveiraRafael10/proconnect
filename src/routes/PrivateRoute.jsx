// src/routes/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "./ROUTES";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { usuario } = useAuth();
  const location = useLocation();

  // Se não estiver logado, redireciona para login
  if (!usuario) {
    return <Navigate to={ROUTES.LOGINPAGE} state={{ from: location }} replace />;
  }

  return children;
}
