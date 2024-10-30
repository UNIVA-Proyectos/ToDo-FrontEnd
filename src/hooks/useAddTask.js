// useAddTasks.js
import { collection, addDoc } from "firebase/firestore";
import { useCallback } from "react";

const useAddTasks = (db, user, addTaskToList) => {
  const addTask = useCallback(
    async (newTask) => {
      if (!user?.uid) return;

      const taskWithUserId = { ...newTask, user_id: user.uid };

      try {
        const docRef = await addDoc(collection(db, "tasks"), taskWithUserId);
        const taskWithId = { ...taskWithUserId, id: docRef.id }; // Añadir el id a la tarea

        addTaskToList(taskWithId); // Llama al callback para añadir la tarea al estado local
        console.log("Tarea añadida!");
      } catch (error) {
        console.error("Error añadiendo la tarea: ", error);
      }
    },
    [db, user?.uid, addTaskToList]
  );

  return { addTask };
};

export default useAddTasks;
