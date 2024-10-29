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
        (task) => task.status === "completed"
      );
      setCompletedCount(completed.length);

      const pending = fetchedTasks.filter((task) => task.status === "pending");
      setPendingCount(pending.length);

      const overdue = fetchedTasks.filter((task) => task.status === "overdue");
      setOverdueCount(overdue.length);
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
