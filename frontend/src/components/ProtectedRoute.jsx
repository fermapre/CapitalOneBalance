import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    alert("Debes iniciar sesión primero");
    return <Navigate to="/" />;
  }
  
  return children;
}