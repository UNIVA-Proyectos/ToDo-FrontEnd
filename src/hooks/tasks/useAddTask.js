import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useCallback } from "react";

const useAddTask = (db, user) => {
  const addTask = useCallback(
    async (newTask) => {
      if (!user?.uid) return;

      const sanitizedTask = {
        titulo: newTask.titulo || "",
        descripcion: newTask.descripcion || "",
        estado: newTask.estado || "Pendiente",
        fechaCreacion: newTask.fechaCreacion || new Date(),
        dueDate: newTask.dueDate || null,
        complete: newTask.complete === true,
        priority: newTask.priority || "normal",
        user_id: user.uid,
        createdAt: serverTimestamp(),
        tags: Array.isArray(newTask.tags) ? newTask.tags.filter(tag => tag !== undefined && tag !== null && tag !== "") : []
      };

      try {
        const docRef = await addDoc(collection(db, "tasks"), sanitizedTask);
        console.log("Tarea añadida con ID:", docRef.id);
      } catch (error) {
        console.error("Error añadiendo la tarea:", error);
        throw error;
      }
    },
    [db, user?.uid]
  );

  return { addTask };
};

export default useAddTask;
