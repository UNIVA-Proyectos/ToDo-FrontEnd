import React, { useState } from "react";
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
    Snackbar,
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
    faBars,
    faCircleArrowUp,  // Importando el icono 'circle-arrow-up'
} from "@fortawesome/free-solid-svg-icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import { Timestamp } from "firebase/firestore";
import useDeleteTask from "../../hooks/tasks/useDeleteTask";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TaskDetailDialog = ({ open, handleClose, task, db, updateTaskList }) => {
    const [user] = useAuthState(auth);
    const { deleteTask, loading, error } = useDeleteTask(db);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const parseDueDate = (dueDate) =>
        dueDate && dueDate instanceof Timestamp ? dueDate.toDate() : null;

    const dueDateFormatted = parseDueDate(task.dueDate);
    const isOverdue =
        dueDateFormatted && dueDateFormatted < new Date() && task.estado === "Pendiente";

    const getStatusIcon = () => {
        if (task.estado === "Completada")
            return <FontAwesomeIcon icon={faCheckCircle} style={{ color: "green" }} />;
        if (task.estado === "Pendiente") {
            return isOverdue ? (
                <FontAwesomeIcon icon={faExclamationCircle} style={{ color: "red" }} />
            ) : (
                <FontAwesomeIcon icon={faClock} style={{ color: "orange" }} />
            );
        }
        return <FontAwesomeIcon icon={faFolderOpen} />;
    };

    const handleDelete = async () => {
        if (!task.id) {
            setSnackbarMessage("ID de tarea no válido");
            setSnackbarOpen(true);
            return;
        }

        try {
            await deleteTask(task.id);
            updateTaskList(task.id);
            handleClose();
            setSnackbarMessage("Tarea eliminada con éxito");
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Error al eliminar la tarea:", err);
            setSnackbarMessage("Hubo un problema al eliminar la tarea.");
            setSnackbarOpen(true);
        }
    };

    return (
        <>
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
                        backgroundColor: "#F9F7F3",
                        boxShadow: 3,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        height: "80vh",
                    },
                }}
            >
                <DialogActions
                    sx={{
                        backgroundColor: "#FFFFFF", // Color blanco para toda la barra
                        padding: "8px 16px", // Espaciado
                        display: "flex",
                        justifyContent: "space-between", // Asegura la distribución correcta
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Detalles de la tarea
                    </Typography>
                    <Button
                        onClick={handleClose}
                        startIcon={<FontAwesomeIcon icon={faXmark} />}
                        aria-label="Cerrar diálogo"
                        sx={{
                            color: "text.secondary",
                            alignSelf: "flex-end",
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

                <DialogContent sx={{ display: "flex", p: 2, height: "100%" }}>
                    {/* Columna Izquierda */}
                    <Box
                        flex={2}
                        sx={{
                            pr: 2,
                            backgroundColor: "#F9F7F3",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <FontAwesomeIcon icon={faBars} style={{ color: "#757575" }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                Descripción:
                            </Typography>
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{
                                mt: 0.5,
                                mb: 50,
                                fontSize: "0.9rem",
                                lineHeight: 1.4,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {task.descripcion || "No hay descripción"}
                        </Typography>
                        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Comentar"
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
                            <Button
                                sx={{
                                    marginLeft: "8px",
                                    padding: 0,
                                    minWidth: "auto",
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "1.5rem",
                                }}
                                aria-label="Enviar comentario"
                            >
                                <FontAwesomeIcon
                                    icon={faCircleArrowUp}
                                    size="lg"
                                    style={{
                                        fontSize: "2rem",
                                        color: "#757575",
                                    }}
                                />
                            </Button>
                        </Box>
                    </Box>

                    {/* Columna Derecha */}
                    <Box
                        flex={1}
                        sx={{
                            pl: 2,
                            backgroundColor: "#F9F7F3",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            overflow: "hidden",
                            borderLeft: "1px solid #d0d0d0",
                        }}
                    >
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="textSecondary">
                                Proyecto:
                            </Typography>
                            <Typography variant="body1">#Tareas</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ my: 1 }}>
                            <Typography variant="body2" color="textSecondary">
                                Fecha de vencimiento:
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                <FontAwesomeIcon icon={faCalendarAlt} style={{ color: "#CE2121" }} />
                                <Typography variant="body1">
                                    {task.dueDate
                                        ? task.dueDate.toDate().toLocaleDateString("es-ES", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })
                                        : "Sin fecha"}
                                </Typography>
                            </Box>
                        </Box>
                        <Divider />
                        <Box sx={{ my: 1 }}>
                            <Typography variant="body2" color="textSecondary">
                                Prioridad:
                            </Typography>
                            <Typography variant="body1">Media</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="textSecondary">
                                Etiquetas:
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                {task.etiquetas && task.etiquetas.length > 0 ? (
                                    task.etiquetas.map((etiqueta, index) => (
                                        <Chip key={index} label={etiqueta} size="small" color="success" />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        No hay etiquetas
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ mt: 37, display: "flex", justifyContent: "left" }}>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                {loading ? "Eliminando..." : "Eliminar"}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </>
    );
};

export default TaskDetailDialog;
