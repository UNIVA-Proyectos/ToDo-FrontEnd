import { collection, query, where, onSnapshot, or } from "firebase/firestore";
import { useState, useEffect, useCallback, useMemo } from "react";

const useTasks = (db, user) => {
  const [tasks, setTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processTask = useCallback((doc) => {
    if (!doc.exists()) {
      console.error('Documento no existe:', doc.id);
      return null;
    }

    const taskData = doc.data();
    if (!taskData) {
      console.error('Datos inválidos para el documento:', doc.id);
      return null;
    }

    return {
      id: doc.id,
      docId: doc.id,
      descripcion: taskData.descripcion || '',
      titulo: taskData.titulo || '',
      estado: taskData.estado || 'Pendiente',
      tags: Array.isArray(taskData.tags) ? taskData.tags : [],
      dueDate: taskData.dueDate || null,
      user_id: taskData.user_id,
      sharedWith: taskData.sharedWith || [],
      isShared: taskData.user_id !== user.uid,
      canEdit: taskData.user_id === user.uid || (taskData.sharedWith && taskData.sharedWith.includes(user.uid))
    };
  }, [user.uid]);

  const updateCounts = useCallback((tasksList) => {
    const completed = tasksList.filter(task => task.estado === "Completada");
    const overdue = tasksList.filter(task => {
      const dueDate = task.dueDate?.toDate();
      return task.estado === "Pendiente" && dueDate && dueDate < new Date();
    });
    const pending = tasksList.filter(task => {
      const dueDate = task.dueDate?.toDate();
      return task.estado === "Pendiente" && (!dueDate || dueDate >= new Date());
    });

    setCompletedCount(completed.length);
    setOverdueCount(overdue.length);
    setPendingCount(pending.length);
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setTasks([]);
      setCompletedCount(0);
      setPendingCount(0);
      setOverdueCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Iniciando suscripción a tareas para usuario:', user.uid);

      const q = query(
        collection(db, "tasks"),
        or(
          where("user_id", "==", user.uid),
          where("sharedWith", "array-contains", user.uid)
        )
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedTasks = querySnapshot.docs
          .map(processTask)
          .filter(task => task !== null);

        console.log('Total de tareas obtenidas:', fetchedTasks.length);
        setTasks(fetchedTasks);
        updateCounts(fetchedTasks);
        setLoading(false);
      }, (error) => {
        console.error("Error en la suscripción:", error);
        setError(error);
        setLoading(false);
      });

      return () => {
        console.log('Limpiando suscripción a tareas');
        unsubscribe();
      };
    } catch (error) {
      console.error("Error al configurar la suscripción:", error);
      setError(error);
      setLoading(false);
    }
  }, [db, user, processTask, updateCounts]);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // Primero por estado (pendientes primero)
      if (a.estado !== b.estado) {
        return a.estado === "Pendiente" ? -1 : 1;
      }
      // Luego por fecha de vencimiento
      const dateA = a.dueDate?.toDate() || new Date(9999, 11, 31);
      const dateB = b.dueDate?.toDate() || new Date(9999, 11, 31);
      return dateA - dateB;
    });
  }, [tasks]);

  return { 
    tasks: sortedTasks, 
    completedCount, 
    pendingCount, 
    overdueCount,
    loading,
    error
  };
};

export default useTasks;
