import React, { useState } from "react";
import DatePickerBtn from "../inputs/DatePickerBtn";
import { Select } from "@mui/material";
import SelectLabels from "../inputs/SelectLabels";

const AddTask = ({ addTask, closeAddTask }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskDescription, setTaskDescription] = useState("");

  const onSelectDate = (date) => {
    setTaskDate(new Date(date));
    console.log(taskDate);
  };

  const handleAddTask = () => {
    if (!taskName) {
      alert("Por favor, ingresa un nombre para la tarea");
      return;
    }

    const newTask = {
      titulo: taskName,
      descripcion: taskDescription,
      estado: "Pendiente", // Estado inicial
      fechaCreacion: new Date(),
      dueDate: taskDate,
      complete: false,
    };

    addTask(newTask);
    setTaskName("");
    setTaskDescription("");
    closeAddTask();
  };

  return (
    <div className="task-form border rounded-4 p-2 ">
      <div className="mb-3">
        <input
          type="text"
          className="form-control custom-input"
          id="taskName"
          placeholder="Nombre de la tarea"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control custom-input"
          id="taskDescription"
          rows="1"
          placeholder="Descripción"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-3 d-flex">
        <div className="me-3">
          <DatePickerBtn handleSelectDate={onSelectDate} />
        </div>
        <SelectLabels />
      </div>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-outline-danger me-2 custom-button"
          onClick={() => {
            setTaskName("");
            setTaskDescription("");
            closeAddTask();
          }}
        >
          Cancelar
        </button>
        <button
          className="btn btn-outline-success custom-button"
          onClick={handleAddTask}
        >
          Añadir tarea
        </button>
      </div>
    </div>
  );
};

export default AddTask;
