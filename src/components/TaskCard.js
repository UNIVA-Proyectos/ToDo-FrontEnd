import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/taskCard.module.css";

const TaskCard = ({ task }) => {
  const { titulo, descripcion, dueDate, estado } = task;
  const getStatusClass = () => {
    if (estado === "Completada") return styles.completed;
    if (estado === "Pendiente") return styles.pending;
    if (estado === "Vencida") return styles.overdue;
    return "";
  };

  return (
    <div className={styles.taskCard}>
      <div className={`${styles.statusIcon} ${getStatusClass()}`}>
        {/* Puedes usar un ícono o la primera letra del estado */}
        {estado[0]}
      </div>
      <h3>{task.titulo}</h3>
      <p>{task.descripcion}</p>
      <p>Vencimiento: {task.dueDate.toDate().toLocaleString()}</p>
      <div className={styles.actions}>
        <button aria-label="Editar tarea">Editar</button>
        <button aria-label="Eliminar tarea">Eliminar</button>
        <button aria-label="Marcar tarea como completa">Completar</button>
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    dueDate: PropTypes.string,
    progress: PropTypes.number.isRequired,
  }).isRequired,
};

export default TaskCard;
