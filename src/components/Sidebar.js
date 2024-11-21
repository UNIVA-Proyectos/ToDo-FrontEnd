import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  styled,
  useTheme,
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  List,
  Divider,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TaskIcon from "@mui/icons-material/Task";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import useUserData from "../hooks/user/useUserData";

const drawerWidth = 240;

// Estilos para el AppBar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: "#f9f7f3",
  boxShadow: "none",
  color: "#25283d",
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...{
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: "hidden",
    },
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      backgroundColor: "#25283d",
    },
  }),
  ...(!open && {
    ...{
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: `calc(${theme.spacing(7)} + 1px)`,
      [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
      },
    },
    "& .MuiDrawer-paper": {
      width: `calc(${theme.spacing(7)} + 1px)`,
      backgroundColor: "#25283d",
    },
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function Sidebar() {
  const theme = useTheme();
  const [user] = useAuthState(auth);
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const { userData, loading } = useUserData();
  const displayName = userData?.name || user?.displayName || "Usuario";

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={drawerOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(drawerOpen && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            DoTime
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={drawerOpen}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon sx={{ color: "white" }} />
            ) : (
              <ChevronRightIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {/* Perfil del usuario */}
        {user && (
          <Box
            sx={{
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: drawerOpen ? "flex-start" : "center",
              flexDirection: drawerOpen ? "row" : "column", // Alineación vertical cuando está cerrado
            }}
          >
            <Avatar
              alt={displayName || "User"}
              src={user?.photoURL || ""}
              sx={{
                width: 50,
                height: 50,
                marginRight: drawerOpen ? 2 : 0,
                marginBottom: drawerOpen ? 0 : 1, // Espaciado debajo cuando está cerrado
              }}
            />
            {drawerOpen && (
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  whiteSpace: "normal", // Permite texto multilinea
                  overflowWrap: "break-word", // Rompe palabras largas si es necesario
                }}
              >
                {loading ? "Cargando..." : displayName}
              </Typography>
            )}
          </Box>
        )}

        <List>
          {[
            { text: "Tareas", icon: <TaskIcon />, to: "/home" },
            {
              text: "Calendario",
              icon: <CalendarMonthIcon />,
              to: "/calendar",
            },
            {
              text: "Configuración",
              icon: <SettingsIcon />,
              to: "/configuracion",
            },
            { text: "Soporte y ayuda", icon: <HelpIcon />, to: "/soporte" },
          ].map(({ text, icon, to }) => (
            <ListItem
              button
              key={text}
              component={Link}
              to={to}
              selected={location.pathname === to}
              sx={{
                justifyContent: drawerOpen ? "initial" : "center",
                px: 2.5,
                margin: "5px 0",
                "&:hover": {
                  backgroundColor: "rgba(255, 194, 71, 0.5)",
                },
                ...(location.pathname === to && {
                  border: "2px solid #ffc247",
                  borderRadius: "5px",
                  backgroundColor: "rgba(255, 194, 71, 0.7)",
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 3 : "auto",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {icon}
              </ListItemIcon>
              {drawerOpen && (
                <ListItemText primary={text} sx={{ color: "white" }} />
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
