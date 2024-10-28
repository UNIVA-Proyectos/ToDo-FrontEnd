import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/taskCard.module.css";

const TaskCard = ({ task }) => {
  return (
    <div className={styles.taskCard}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Vencimiento: {task.dueDate}</p>
      <div className={styles.progress}>
        <div
          className={styles.progressBar}
          style={{ width: `${task.progress}%` }}
        />
        <span>{task.progress}%</span>
      </div>
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
