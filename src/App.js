// App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import AppLogin from "./pages/Login"; // Componente de login
import Home from "./pages/home"; // Pantalla de inicio después del login
import { auth } from "./config/firebase"; // Autenticación de Firebase

// Componente para proteger rutas privadas
const PrivateRoute = ({ element }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!auth.currentUser; // Verificar si el usuario está autenticado

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); // Si no está autenticado, redirigir al login
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? element : null; // Mostrar el componente si está autenticado
};

// Componente principal de la aplicación
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLogin />} />{" "}
        {/* Página de inicio de sesión */}
        <Route
          path="/home"
          element={<PrivateRoute element={<Home />} />}
        />{" "}
        {/* Ruta protegida */}
      </Routes>
    </Router>
  );
};

export default App;
