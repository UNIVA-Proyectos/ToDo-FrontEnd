import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate
} from "react-router-dom";
import "./styles/app.css";
import Login from "./pages/auth/Login.js";
import MobileLogin from "./pages/auth/MobileLogin.js";
import Home from "./pages/dashboard/home.js";
import Calendar from "./pages/calendar/calendar.js";
import ProfileSettings from "./pages/settings/ConfiguracionPerfil.js";
import BlankLayout from "./layout/blankLayout.js";
import MainLayout from "./layout/mainLayout.js";
import FAQ from "./pages/help/faq.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase.js";
import { useTheme, useMediaQuery } from "@mui/material";

// Componente para la página de login que selecciona la versión correcta según el dispositivo
const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  return isMobile ? <MobileLogin /> : <Login />;
};

// Componente para proteger rutas privadas
const PrivateRoute = ({ element }) => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return user ? element : null;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<BlankLayout />}>
          <Route path="/" element={<LoginPage />} />
        </Route>
        <Route element={<PrivateRoute element={<MainLayout />} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Navigate to="/home" replace />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/help" element={<FAQ />} />
          {/* Ruta para manejar URLs no encontradas */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
