import React from "react";
const AddTask = () => {
  return (
    <div className="task-form border rounded p-2 mt-3">
      <div className="mb-3">
        <input
          type="text"
          className="form-control custom-input"
          id="taskName"
          placeholder="Nombre de la tarea"
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control custom-input"
          id="taskDescription"
          rows="3"
          placeholder="Descripción"
        ></textarea>
      </div>
      <div className="mb-3 d-flex">
        <button className="btn custom-button">
          <i className="fas fa-calendar-days"></i> Fecha de vencimiento
        </button>

        <button className="btn custom-button">
          <i className="fas fa-bell"></i> Recordatorios
        </button>
        <button className="btn custom-button">
          <i className="fas fa-ellipsis"></i>
        </button>
      </div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary custom-button">Cancelar</button>
        <button className="btn btn-danger custom-button">Añadir tarea</button>
      </div>
    </div>
  );
};

export default AddTask;
