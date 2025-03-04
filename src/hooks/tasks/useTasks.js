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
      canEdit: taskData.user_id === user.uid
    };
  }, [user]);

  const updateCounts = useCallback((tasksList) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const completed = tasksList.filter(task => task.estado === "Completada").length;
    const overdue = tasksList.filter(task => {
      if (task.estado !== "Pendiente" || !task.dueDate) return false;
      const dueDate = task.dueDate.toDate();
      const dueDateWithoutTime = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
      return dueDateWithoutTime < today;
    }).length;
    const pending = tasksList.filter(task => task.estado === "Pendiente").length;

    setCompletedCount(completed);
    setOverdueCount(overdue);
    setPendingCount(pending);
  }, []);

  useEffect(() => {
    if (!user?.uid || !user?.email || !db) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      const tasksCollection = collection(db, "tasks");

      // Consulta para tareas propias
      const ownTasksQuery = query(
        tasksCollection,
        where("user_id", "==", user.uid)
      );

      // Consulta para tareas compartidas
      const sharedTasksQuery = query(
        tasksCollection,
        where("sharedWith", "array-contains", user.email)
      );

      // Suscribirse a ambas consultas
      const unsubscribeOwn = onSnapshot(
        ownTasksQuery,
        async (ownSnapshot) => {
          try {
            const sharedSnapshot = await getDocs(sharedTasksQuery);
            
            const ownTasks = ownSnapshot.docs
              .map(processTask)
              .filter(Boolean);
            
            const sharedTasks = sharedSnapshot.docs
              .map(processTask)
              .filter(Boolean);

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

      unsubscribeRef.current = () => {
        unsubscribeOwn();
      };

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
