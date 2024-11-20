import React, { useState } from "react";
import dayjs from "dayjs";
import useTasks from "../hooks/tasks/useTasks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendar.css"; // Importar el CSS personalizado
import { CardContent, Box } from "@mui/material";
import moment from "moment";
import TaskDetailDialog from "../components/dialog/TaskDetailDialog";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const PageCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [user] = useAuthState(auth);
  const { tasks } = useTasks(db, user);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  console.log(tasks);

  const events = tasks.map((task) => ({
    title: task.titulo,
    allDay: true,
    start: new Date(task.dueDate.toDate()),
    end: new Date(task.dueDate.toDate()),
    // ESTADOS, PENDIENRE, COMPLETADA,
    color: task.estado,
  }));

  const eventColors = (event) => {
    let style = {
      backgroundColor: "lightblue",
      color: "black",
      borderRadius: "12px",
      border: "none",
    };

    if (event.color === "Completada") {
      style.backgroundColor = "#ffc247";
    } else if (event.color === "Pendiente") {
      style.backgroundColor = "#ffc247";
    }

    return {
      style: style,
    };
  };

  console.log(events);

  return (
    <>
      <Box
        className="calendar-container"
        sx={{ height: "80vh", padding: 1.5, margin: 0 }}
      >
        <CardContent sx={{ height: "100%", padding: 2 }}>
          <BigCalendar
            selectable
            defaultView="month"
            events={events}
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            localizer={localizer}
            style={{ height: "100%", width: "100%" }}
            eventPropGetter={(event) => eventColors(event)}
            onSelectEvent={(event) => {
              setOpen(true);
              setSelectedTask(event);
            }}
          />
        </CardContent>
      </Box>
      <TaskDetailDialog
        open={open}
        handleClose={() => setOpen(false)}
        task={selectedTask || {}}
      />
    </>
  );
};

export default PageCalendar;
