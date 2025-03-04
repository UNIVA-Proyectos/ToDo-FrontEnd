import { useState, useCallback } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';

const useComments = (db) => {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cargarComentarios = useCallback(async (taskId) => {
        if (!taskId) return;
        
        setLoading(true);
        setError(null);
        try {
            const comentariosRef = collection(db, 'tasks', taskId, 'comentarios');
            const querySnapshot = await getDocs(comentariosRef);
            const comentariosData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            comentariosData.sort((a, b) => b.fecha.seconds - a.fecha.seconds);
            setComentarios(comentariosData);
        } catch (error) {
            console.error("Error al cargar comentarios:", error);
            setError("No tienes permisos para ver los comentarios de esta tarea");
        } finally {
            setLoading(false);
        }
    }, [db]);

    const agregarComentario = async (comentarioData) => {
        if (!comentarioData.taskId) return;

        try {
            const docRef = await addDoc(
                collection(db, 'tasks', comentarioData.taskId, 'comentarios'),
                {
                    texto: comentarioData.texto,
                    userId: comentarioData.userId,
                    userEmail: comentarioData.userEmail,
                    userName: comentarioData.userName,
                    userPhoto: comentarioData.userPhoto,
                    fecha: Timestamp.now(),
                }
            );
            
            const nuevoComentario = {
                id: docRef.id,
                texto: comentarioData.texto,
                userId: comentarioData.userId,
                userEmail: comentarioData.userEmail,
                userName: comentarioData.userName,
                userPhoto: comentarioData.userPhoto,
                fecha: Timestamp.now()
            };
            
            setComentarios(prevComentarios => 
                [nuevoComentario, ...prevComentarios]
            );
            
            return docRef;
        } catch (error) {
            console.error("Error al agregar comentario:", error);
            setError("No tienes permisos para comentar en esta tarea");
            throw error;
        }
    };

    const eliminarComentario = async (taskId, comentarioId) => {
        if (!comentarioId || !taskId) {
            console.error("Faltan datos necesarios para eliminar el comentario");
            return;
        }

        try {
            const comentarioRef = doc(db, 'tasks', taskId, 'comentarios', comentarioId);
            await deleteDoc(comentarioRef);
            
            // Actualizar el estado local después de eliminar
            setComentarios(prevComentarios => 
                prevComentarios.filter(com => com.id !== comentarioId)
            );
        } catch (error) {
            console.error("Error al eliminar comentario:", error);
            setError("No tienes permisos para eliminar este comentario");
            throw error;
        }
    };

    return {
        comentarios,
        loading,
        error,
        cargarComentarios,
        agregarComentario,
        eliminarComentario
    };
};

export default useComments;
