import { useState } from 'react';
import { uploadToCloudinary } from '../../services/cloudinaryService';

const useCloudinaryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    setIsUploading(true);
    setError(null);

    try {
      // Validar el archivo
      if (!file || !file.type.startsWith('image/')) {
        throw new Error('Por favor selecciona una imagen válida');
      }

      // Validar el tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La imagen es demasiado grande. El tamaño máximo es 5MB');
      }

      const imageUrl = await uploadToCloudinary(file);
      return imageUrl;
    } catch (err) {
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
