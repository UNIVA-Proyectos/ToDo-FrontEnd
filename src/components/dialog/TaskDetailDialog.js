import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  Chip,
  Avatar,
  DialogActions,
  Slide,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faCalendarAlt,
  faFolderOpen,
  faXmark,
  faCheckCircle,
  faExclamationCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import { Timestamp } from "firebase/firestore";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TaskDetailDialog = ({ open, handleClose, task }) => {
  const [user] = useAuthState(auth);

  const parseDueDate = (dueDate) =>
    dueDate && dueDate instanceof Timestamp ? dueDate.toDate() : null;

  const dueDateFormatted = parseDueDate(task.dueDate);
  const isOverdue =
    dueDateFormatted &&
    dueDateFormatted < new Date() &&
    task.estado === "Pendiente";

  const getStatusIcon = () => {
    if (task.estado === "Completada")
      return (
        <FontAwesomeIcon icon={faCheckCircle} style={{ color: "green" }} />
      );
    if (task.estado === "Pendiente") {
      return isOverdue ? (
        <FontAwesomeIcon icon={faExclamationCircle} style={{ color: "red" }} />
      ) : (
        <FontAwesomeIcon icon={faClock} style={{ color: "orange" }} />
      );
    }
    return <FontAwesomeIcon icon={faFolderOpen} />;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
      keepMounted
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          backgroundColor: "background.paper",
          boxShadow: 3,
        },
      }}
    >
      <DialogActions>
        <Button
          onClick={handleClose}
          startIcon={<FontAwesomeIcon icon={faXmark} />}
          aria-label="Cerrar diálogo"
          sx={{
            alignSelf: "flex-end",
            color: "text.secondary",
          }}
        />
      </DialogActions>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              fontSize: "1.5rem",
              color: isOverdue ? "error.main" : "text.primary",
            }}
          >
            {getStatusIcon()}
          </Box>
          <Typography variant="h6" component="div">
            {task.titulo}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" gap={2} flexWrap="wrap">
          {/* Left Column */}
          <Box flex={2} sx={{ pr: 2 }}>
            <Typography variant="body1">
              {task.descripcion || "No hay descripción"}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} sx={{ my: 2 }}>
              <FontAwesomeIcon
                icon={faPaperclip}
                style={{ color: "#ffc107" }} // Color amarillo del icono
              />
              <Button
                variant="text"
                sx={{
                  color: "#ffc107", // Color amarillo del botón
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Adjuntar Archivo
              </Button>
            </Box>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Comentar"
              className="comment-input"
              InputProps={{
                startAdornment: (
                  <Avatar
                    alt={user?.displayName || "Usuario"}
                    src={user?.photoURL || ""}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                ),
              }}
            />
          </Box>

          {/* Right Column */}
          <Box flex={1} sx={{ pl: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Proyecto
              </Typography>
              <Typography variant="body1">#Tareas</Typography>
            </Box>
            <Divider />
            <Box sx={{ my: 2 }}>
              <Typography variant="body2" color="textSecondary">
                {task.dueDate
                  ? task.dueDate.toDate().toLocaleDateString()
                  : "Sin fecha"}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  style={{ color: "#ffc107" }}
                />
                <Typography variant="body1">
                  {task.dueDate
                    ? task.dueDate.toDate().toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Sin fecha"}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ my: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Prioridad
              </Typography>
              <Typography variant="body1">Media</Typography>
            </Box>
            <Divider />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Etiquetas
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {task.tags && task.tags.length > 0 ? (
                  task.tags.map((etiqueta, index) => (
                    <Chip
                      key={index}
                      label={etiqueta}
                      size="small"
                      color="success"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No hay etiquetas
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
