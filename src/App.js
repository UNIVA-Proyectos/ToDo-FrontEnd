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
import Calendar from "./pages/calendar";
import BlankLayout from "./layout/blankLayout";
import MainLayout from "./layout/mainLayout";

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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<BlankLayout />}>
          <Route path="/" element={<AppLogin />} />
        </Route>
        <Route element={<PrivateRoute element={<MainLayout />} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
