import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import useTasks from "../../hooks/tasks/useTasks";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../../styles/calendar.css";
import {
  Box,
  Paper,
  Fade,
  Tooltip,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import TaskDetailDialog from "../../components/dialog/TaskDetailDialog";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const PageCalendar = () => {
  const [user] = useAuthState(auth);
  const { tasks } = useTasks(db, user);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const getEventClassName = (task) => {
    if (task.prioridad === "Alta") return "task-high-priority";
    switch (task.estado) {
      case "Completada":
        return "task-completed";
      case "Pendiente":
        return "task-pending";
      case "En Progreso":
        return "task-in-progress";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completada":
        return <CheckCircleIcon fontSize="small" />;
      case "Pendiente":
        return <AccessTimeIcon fontSize="small" />;
      case "En Progreso":
        return <ErrorIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const renderEventContent = (eventInfo) => {
    const task = eventInfo.event.extendedProps.task;
    return (
      <Tooltip
        title={
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" component="div" sx={{ mb: 1 }}>
              {task.titulo}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {getStatusIcon(task.estado)}
              <Chip 
                label={task.estado} 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontWeight: 500
                }}
              />
            </Box>
            {task.prioridad === "Alta" && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PriorityHighIcon fontSize="small" />
                <Typography variant="body2" component="span">
                  Prioridad Alta
                </Typography>
              </Box>
            )}
            {task.descripcion && (
              <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.9)' }}>
                {task.descripcion}
              </Typography>
            )}
          </Box>
        }
        arrow
        placement="top"
      >
        <div className={`fc-event-content ${getEventClassName(task)}`}>
          <div className="event-title">
            {task.titulo}
          </div>
          <div className="event-meta">
            {task.prioridad === "Alta" && <PriorityHighIcon fontSize="small" />}
            {getStatusIcon(task.estado)}
          </div>
        </div>
      </Tooltip>
    );
  };

  const events = tasks
    .filter(task => task && task.dueDate)
    .map((task) => {
      const dueDate = task.dueDate?.toDate();
      if (!dueDate) {
        console.error('Fecha inválida para la tarea:', task);
        return null;
      }

      return {
        id: task.id,
        title: task.titulo || 'Sin título',
        start: dueDate,
        end: dueDate,
        allDay: true,
        className: getEventClassName(task),
        extendedProps: {
          task: task
        }
      };
    })
    .filter(Boolean);

  const handleEventClick = (info) => {
    setSelectedTask(info.event.extendedProps.task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  const handleDateClick = (arg) => {
    console.log('Date clicked:', arg.date);
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ height: "calc(100vh - 100px)", p: 3 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            height: "100%", 
            p: 2,
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            overflow: "hidden",
            '& .fc': {
              '--fc-border-color': '#ebedf0',
            }
          }}
        >
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin
            ]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
            }}
            locale={esLocale}
            events={events}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="100%"
            themeSystem="standard"
            dayMaxEvents={true}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
              hour12: false
            }}
            buttonText={{
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              list: "Lista"
            }}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            }}
            views={{
              dayGridMonth: {
                titleFormat: { year: 'numeric', month: 'long' }
              },
              timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'long', day: '2-digit' }
              },
              timeGridDay: {
                titleFormat: { year: 'numeric', month: 'long', day: '2-digit', weekday: 'long' }
              }
            }}
          />
        </Paper>
        {selectedTask && (
          <TaskDetailDialog
            open={open}
            onClose={handleClose}
            task={selectedTask}
            db={db}
          />
        )}
      </Box>
    </Fade>
  );
};

export default PageCalendar;
