import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { updateProfile } from "firebase/auth";

const useUpdateUserData = () => {
  const updateUserData = async (updatedData) => {
    if (!auth.currentUser) {
      console.error("No hay usuario autenticado");
      return;
    }

    try {
      console.log("Actualizando datos del usuario:", updatedData);

      // Si hay otros datos para actualizar además de la foto
      if (Object.keys(updatedData).length > 0) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDocRef, updatedData);
        console.log("Datos del usuario actualizados con éxito");

        // Actualizar el perfil en Auth si hay cambios en nombre o foto
        const authUpdates = {};
        if (updatedData.name) authUpdates.displayName = updatedData.name;
        if (updatedData.photoURL) authUpdates.photoURL = updatedData.photoURL;

        if (Object.keys(authUpdates).length > 0) {
          await updateProfile(auth.currentUser, authUpdates);
          console.log("Perfil de Auth actualizado");
        }
      }

      return true;
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
      throw error;
    }
  };

  return { updateUserData };
};

export default useUpdateUserData;
