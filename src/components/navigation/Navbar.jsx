import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import TaskIcon from "@mui/icons-material/Task";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";

export default function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue); // Cambia la ruta según el valor seleccionado
  };

  return (
    <>
      <div style={{ paddingBottom: "70px" }}>
        {" "}
        {/* Deja espacio para el BottomNavigation */}
        {/* Aquí va el contenido principal de tu página */}
      </div>

      <BottomNavigation
        sx={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          backgroundColor: "#25283d",
          height: "60px",
          zIndex: 1000,
          borderTop: "2px solid rgba(255, 194, 71, 0.1)",
          "& .MuiBottomNavigationAction-root": {
            minWidth: "auto",
            color: "#666",
            "&.Mui-selected": {
              color: "#ffc247",
              "& .MuiSvgIcon-root": {
                filter: "drop-shadow(0 0 2px rgba(255, 194, 71, 0.3))",
              },
            },
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.7rem",
            marginTop: "4px",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "1.4rem",
          },
        }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Tareas"
          value="/home"
          icon={<TaskIcon />}
        />
        <BottomNavigationAction
          label="Calendario"
          value="/calendar"
          icon={<CalendarMonthIcon />}
        />
        <BottomNavigationAction
          label="Configuración"
          value="/settings"
          icon={<SettingsIcon />}
        />
        <BottomNavigationAction
          label="Soporte"
          value="/help"
          icon={<HelpIcon />}
        />
      </BottomNavigation>
    </>
  );
}
