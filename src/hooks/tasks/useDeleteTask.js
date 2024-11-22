import { doc, deleteDoc } from "firebase/firestore";
import { useState } from "react";

const useDeleteTask = (db) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);
    console.log("Eliminando tarea con ID:", taskId); // Verificar el taskId

    try {
      if (!taskId) {
        throw new Error("El ID de la tarea no es válido.");
      }

      // Verificar que db sea una referencia válida de Firestore
      if (!db || !db.collection) {
        throw new Error("La instancia de Firestore no es válida.");
      }

      // Crear la referencia al documento de la tarea
      const taskRef = doc(db, "tasks", taskId);

      // Intentar eliminar el documento de la tarea
      await deleteDoc(taskRef);
      console.log("Tarea eliminada con éxito");
    } catch (err) {
      console.error("Error al eliminar la tarea:", err);
      setError("Hubo un problema al eliminar la tarea.");
      console.error("Detalles del error:", err.message); // Captura más detalles del error
    } finally {
      setLoading(false);
    }
  };

  return { deleteTask, loading, error };
};

export default useDeleteTask;
