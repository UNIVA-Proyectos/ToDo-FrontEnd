import { useState } from 'react';
import { uploadToCloudinary } from '../../services/cloudinaryService';

const useCloudinaryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    setIsUploading(true);
    setError(null);

    try {
      console.log('Preparando imagen para subir...', file);
      
      // Validar el archivo
      if (!file || !file.type.startsWith('image/')) {
        throw new Error('Por favor selecciona una imagen válida');
      }

      // Validar el tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error(`La imagen es demasiado grande. El tamaño máximo es ${Math.round(maxSize/1024/1024)}MB`);
      }

      // Subir la imagen
      console.log('Subiendo imagen a Cloudinary...');
      const imageUrl = await uploadToCloudinary(file);
      console.log('Imagen subida exitosamente:', imageUrl);
      
      return imageUrl;
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    error
  };
};

export default useCloudinaryUpload;
