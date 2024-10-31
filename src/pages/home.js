// Home.js
import TaskCard from "../components/tasks/TaskCard";
import TaskSummary from "../components/tasks/taskSummary";
import AddTask from "../components/tasks/AddTask";
import useTasks from "../hooks/useTasks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import useAddTask from "../hooks/useAddTask";

const Home = () => {
    const [user] = useAuthState(auth);
    const { tasks, completedCount, pendingCount, overdueCount, addTaskToList } =
        useTasks(db, user);
    const { addTask } = useAddTask(db, user, addTaskToList); // Pasa el callback

    return (
        <div>
            <header>
                <h1>Hola, {user?.displayName?.split(" ").slice(0, 2).join(" ")} </h1>
            </header>
            <TaskSummary
                completedCount={completedCount}
                pendingCount={pendingCount}
                overdueCount={overdueCount}
            />
            <section className="task-section">
                <h2>Tareas</h2>
                <div className="task-list">
                    {tasks.length > 0 ? (
                        tasks.map((task) => <TaskCard key={task.id} task={task} />)
                    ) : (
                        <p>No tienes tareas pendientes</p>
                    )}
                </div>
                <AddTask addTask={addTask} />
            </section>
        </div>
    );
};

export default Home;