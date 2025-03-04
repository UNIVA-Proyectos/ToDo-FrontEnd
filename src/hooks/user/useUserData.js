import { useState, useEffect } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateUserPhoto } from "../../services/userPhotoService";

const useUserData = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastPhotoUpdate, setLastPhotoUpdate] = useState(null);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    // Suscribirse a cambios en el documento del usuario
    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUserData(data);
        } else {
          // Si el documento no existe, crear uno nuevo
          const newUserData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL || null,
            createdAt: new Date(),
            lastLogin: new Date()
          };
          
          try {
            await updateDoc(doc(db, "users", user.uid), newUserData);
            setUserData(newUserData);
          } catch (error) {
            console.error("Error al crear documento de usuario:", error);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error al obtener datos del usuario:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Función para actualizar la foto del usuario
  const updatePhoto = async (photoURL) => {
    if (!user || !photoURL || photoURL === lastPhotoUpdate) return;
    
    try {
      setLastPhotoUpdate(photoURL);
      await updateUserPhoto(db, auth, photoURL);
      
      // Actualizar el documento del usuario
      await updateDoc(doc(db, "users", user.uid), {
        photoURL: photoURL
      });
      
      console.log("Foto actualizada con éxito");
    } catch (error) {
      console.error("Error al actualizar la foto:", error);
      throw error;
    }
  };

  return {
    userData,
    loading,
    updatePhoto
  };
};

export default useUserData;
