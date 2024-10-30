import { collection, query, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

const useTasks = (db, user) => {
  const [tasks, setTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    if (!user?.uid) {
      setTasks([]);
      setCompletedCount(0);
      setPendingCount(0);
      setOverdueCount(0);
      return;
    }

    const fetchTasks = async () => {
      const q = query(
        collection(db, "tasks"),
        where("user_id", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedTasks = [];

      querySnapshot.forEach((doc) => {
        fetchedTasks.push({ id: doc.id, ...doc.data() });
      });

      setTasks(fetchedTasks);

      const completed = fetchedTasks.filter(
        (task) => task.estado === "Completada"
      );
      setCompletedCount(completed.length);

      const overdue = fetchedTasks.filter((task) => {
        const dueDate = task.dueDate?.toDate();
        const isOverdue = dueDate && dueDate < new Date();
        return task.estado === "Pendiente" && isOverdue;
      });
      setOverdueCount(overdue.length);

      const pending = fetchedTasks.filter((task) => {
        const dueDate = task.dueDate?.toDate();
        const isNotOverdue = !dueDate || dueDate >= new Date();
        return task.estado === "Pendiente" && isNotOverdue;
      });
      setPendingCount(pending.length);
    };

    fetchTasks();
  }, [db, user?.uid]);

  return {
    tasks,
    completedCount,
    pendingCount,
    overdueCount,
  };
};

export default useTasks;
