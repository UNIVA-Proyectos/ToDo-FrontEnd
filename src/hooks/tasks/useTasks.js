import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { useState, useEffect, useCallback, useRef } from "react";

const useTasks = (db, user) => {
  const [tasks, setTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  const processTask = useCallback((doc) => {
    if (!doc.exists()) return null;
    const taskData = doc.data();
    if (!taskData) return null;

    return {
      id: doc.id,
      docId: doc.id,
      descripcion: taskData.descripcion || '',
      titulo: taskData.titulo || '',
      estado: taskData.estado || 'Pendiente',
      tags: Array.isArray(taskData.tags) ? taskData.tags : [],
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || 'normal',
      user_id: taskData.user_id,
      sharedWith: taskData.sharedWith || [],
      isShared: taskData.user_id !== user.uid,
      canEdit: taskData.user_id === user.uid || (taskData.sharedWith || []).some(shared => shared.email === user.email)
    };
  }, [user]);

  const updateCounts = useCallback((tasksList) => {
    const now = new Date();
    const completed = tasksList.filter(task => task.estado === "Completada").length;
    const overdue = tasksList.filter(task => {
      const dueDate = task.dueDate?.toDate();
      return task.estado === "Pendiente" && dueDate && dueDate < now;
    }).length;
    const pending = tasksList.filter(task => {
      const dueDate = task.dueDate?.toDate();
      return task.estado === "Pendiente" && (!dueDate || dueDate >= now);
    }).length;

    setCompletedCount(completed);
    setOverdueCount(overdue);
    setPendingCount(pending);
  }, []);

  useEffect(() => {
    if (!user?.uid || !user?.email || !db) {
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
      // Limpiar suscripción anterior si existe
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      const tasksQuery = query(
        collection(db, "tasks"),
        where("user_id", "==", user.uid)
      );

      const sharedTasksQuery = query(
        collection(db, "tasks"),
        where("sharedWith", "array-contains", { email: user.email })
      );

      const unsubscribe = onSnapshot(
        tasksQuery,
        async (querySnapshot) => {
          try {
            const ownTasks = querySnapshot.docs
              .map(processTask)
              .filter(task => task !== null);

            const sharedSnapshot = await getDocs(sharedTasksQuery);
            const sharedTasks = sharedSnapshot.docs
              .map(processTask)
              .filter(task => task !== null);

            const allTasks = [...ownTasks, ...sharedTasks];
            const uniqueTasks = Array.from(
              new Map(allTasks.map(task => [task.id, task])).values()
            );

            setTasks(uniqueTasks);
            updateCounts(uniqueTasks);
            setLoading(false);
          } catch (error) {
            console.error("Error procesando tareas:", error);
            setError(error);
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error en la suscripción:", error);
          setError(error);
          setLoading(false);
        }
      );

      unsubscribeRef.current = unsubscribe;

      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error al configurar la suscripción:", error);
      setError(error);
      setLoading(false);
    }
  }, [db, user, processTask, updateCounts]);

  return {
    tasks,
    loading,
    error,
    completedCount,
    pendingCount,
    overdueCount
  };
};

export default useTasks;
