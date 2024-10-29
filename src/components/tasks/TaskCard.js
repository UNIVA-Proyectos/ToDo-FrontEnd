import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const TaskCard = ({ task }) => {
  const { titulo, descripcion, dueDate, estado } = task;

  const getStatusClass = () => {
    if (estado === "Completada") return "completed";
    if (estado === "Pendiente") return "pending";
    if (estado === "Vencida") return "overdue";
    return "";
  };

  const getStatusIcon = () => {
    if (estado === "Completada")
      return <FontAwesomeIcon icon={faCheckCircle} />;
    if (estado === "Pendiente") return <FontAwesomeIcon icon={faClock} />;
    if (estado === "Vencida")
      return <FontAwesomeIcon icon={faExclamationCircle} />;
    return null;
  };

  return (
    <div className="taskCard">
      <div className={`statusIcon ${getStatusClass()}`}>{getStatusIcon()}</div>
      <h3>{titulo}</h3>
      <p>Vencimiento: {dueDate.toDate().toLocaleString()}</p>
      <div className="actions">
        <button className="btn btn-warning me-3" aria-label="Editar tarea">
          Editar
        </button>
        <button className="btn btn-danger me-3" aria-label="Eliminar tarea">
          Eliminar
        </button>
        <button
          className="btn btn-success me-3"
          aria-label="Marcar tarea como completa"
        >
          Completar
        </button>
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
    dueDate: PropTypes.object, // Cambié esto para que acepte un objeto fecha
    estado: PropTypes.string.isRequired,
  }).isRequired,
};

export default TaskCard;
