import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

// Función para actualizar la foto del usuario
export const updateUserPhoto = async (db, auth, photoURL) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No hay usuario autenticado');

        console.log('Iniciando actualización de foto de usuario:', {
            userId: user.uid,
            newPhotoURL: photoURL
        });

        // 1. Actualizar en Firebase Auth
        await updateProfile(user, { photoURL });
        console.log('Foto actualizada en Firebase Auth');

        // 2. Actualizar en Firestore users collection
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { photoURL });
        console.log('Foto actualizada en documento de usuario');

        return { success: true };
    } catch (error) {
        console.error('Error actualizando foto de usuario:', error);
        throw error;
    }
};
