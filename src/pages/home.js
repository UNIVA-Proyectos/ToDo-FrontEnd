// Home.js
import React, { useEffect, useState } from "react";
import styles from "../styles/home.module.css";
import Sidebar from "../components/Sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import TaskCard from "../components/TaskCard";
import TaskSummary from "../components/taskSummary";

const Home = () => {
  const [user] = useAuthState(auth);
  const [tasks, setTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        try {
          const tasksRef = collection(db, "tasks");
          const q = query(tasksRef, where("user_id", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const userTasks = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(userTasks);
          // Contar tareas en cada categoría
          const now = new Date();
          setCompletedCount(
            userTasks.filter((task) => task.estado === "Completada").length
          );
          setPendingCount(
            userTasks.filter((task) => task.estado === "Pendiente").length
          );
          setOverdueCount(
            userTasks.filter(
              (task) =>
                task.estado === "Pendiente" && task.dueDate?.toDate() < now
            ).length
          );
        } catch (error) {
          console.error("Error al obtener tareas: ", error);
        }
      }
    };

    fetchTasks();
  }, [user]);

  return (
    <div className={styles["home-container"]}>
      <Sidebar />

      <div className={styles["main-content"]}>
        <header>
          <h1>Hola, {user?.displayName?.split(" ").slice(0, 2).join(" ")} </h1>
        </header>
        {/* Resumen de tareas */}
        <TaskSummary
          completedCount={completedCount}
          pendingCount={pendingCount}
          overdueCount={overdueCount}
        />

        <section className={styles["task-section"]}>
          <h2>Tareas</h2>
          <div className={styles["task-list"]}>
            {tasks.length > 0 ? (
              tasks.map((task) => <TaskCard key={task.id} task={task} />)
            ) : (
              <p>No tienes tareas pendientes</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
