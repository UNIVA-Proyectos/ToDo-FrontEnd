import styles from "../styles/home.module.css";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import TaskSummary from "../components/taskSummary";
import useTasks from "../hooks/useTasks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";

const Home = () => {
  const [user] = useAuthState(auth);
  const { tasks, completedCount, pendingCount, overdueCount } = useTasks(
    db,
    user
  );

  console.log(tasks);
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
