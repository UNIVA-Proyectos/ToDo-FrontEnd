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
import Slide from "@mui/material/Slide";
import { Timestamp } from "firebase/firestore";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TaskDetailDialog = ({ open, handleClose, task }) => {
  const [user] = useAuthState(auth);
  const isDueDateValid = task.dueDate && task.dueDate instanceof Timestamp;
  const dueDateFormatted = isDueDateValid ? task.dueDate.toDate() : null;
  const isOverdue =
    dueDateFormatted &&
    dueDateFormatted < new Date() &&
    task.estado === "Pendiente";

  const getStatusIcon = () => {
    // Determinar el icono dependiendo del estado y si está vencida
    switch (task.estado) {
      case "Completada":
        return (
          <FontAwesomeIcon icon={faCheckCircle} style={{ color: "green" }} />
        );
      case "Pendiente":
        if (isOverdue) {
          return (
            <FontAwesomeIcon
              icon={faExclamationCircle}
              style={{ color: "red" }}
            />
          );
        }
        return <FontAwesomeIcon icon={faClock} style={{ color: "orange" }} />;
      default:
        return <FontAwesomeIcon icon={faFolderOpen} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
      aria-describedby="alert-dialog-slide-description"
      keepMounted
      className="task-dialog"
    >
      <DialogActions>
        <Button
          onClick={handleClose}
          startIcon={<FontAwesomeIcon icon={faXmark} />}
        />
      </DialogActions>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <div
            className={`statusIcon ${
              task.estado === "Pendiente" && isOverdue ? "overdue" : ""
            }`}
          >
            {getStatusIcon()}{" "}
            {/* Aquí usamos el icono que devuelve la función */}
          </div>
          <Typography variant="h6" component="div">
            {task.titulo}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" className="content-wrapper">
          <Box flex={2} className="left-column">
            <Typography variant="body1">
              {task.descripcion || "No hay descripción"}
            </Typography>

            <Box display="flex" alignItems="center" gap={1} my={2}>
              <FontAwesomeIcon
                icon={faPaperclip}
                style={{ color: "#ffc107" }}
              />
              <Button
                color="primary"
                variant="text"
                style={{ color: "#ffc107" }}
              >
                Adjuntar Archivo
              </Button>
            </Box>

            <TextField
              freeSolo
              fullWidth
              variant="outlined"
              placeholder="Comentar"
              className="comment-input"
              InputProps={{
                startAdornment: (
                  <Box display="flex" alignItems="center" mr={1}>
                    <Avatar
                      alt={user.displayName || "User"}
                      src={user.photoURL || ""}
                      sx={{ width: 50, height: 50, marginRight: 2 }}
                    />
                  </Box>
                ),
              }}
            />
          </Box>

          {/* Right Column: Task Actions */}
          <Box flex={1} className="right-column">
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Proyecto
              </Typography>
              <Typography variant="body1">#Tareas</Typography>
            </Box>
            <Divider />
            <Box my={2}>
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
            <Box my={2}>
              <Typography variant="body2" color="textSecondary">
                Prioridad
              </Typography>
              <Typography variant="body1">Media</Typography>
            </Box>
            <Divider />
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                Etiquetas
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                {task.etiquetas && task.etiquetas.length > 0 ? (
                  task.etiquetas.map((etiqueta, index) => (
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
