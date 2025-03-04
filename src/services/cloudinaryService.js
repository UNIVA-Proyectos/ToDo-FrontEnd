/**
 * Servicio para manejar las interacciones con Cloudinary
 */

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en bytes

/**
 * Comprime una imagen antes de subirla
 * @param {File} file - Archivo de imagen a comprimir
 * @returns {Promise<Blob>} Imagen comprimida
 */
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Si la imagen es más grande que 1200px, redimensionarla manteniendo el aspect ratio
        if (width > 1200) {
          height = Math.round((height * 1200) / width);
          width = 1200;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          0.7 // Calidad de compresión (0.7 = 70%)
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Valida y procesa una imagen antes de subirla
 * @param {File} file - Archivo de imagen a validar
 * @returns {Promise<Blob>} Imagen procesada
 */
const validateAndProcessImage = async (file) => {
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen');
  }

  // Validar tamaño inicial
  if (file.size > MAX_FILE_SIZE * 2) {
    throw new Error('La imagen es demasiado grande. El tamaño máximo es 5MB');
  }

  // Comprimir la imagen
  const compressedImage = await compressImage(file);
  
  // Validar tamaño después de compresión
  if (compressedImage.size > MAX_FILE_SIZE) {
    throw new Error('La imagen sigue siendo demasiado grande después de la compresión');
  }

  return compressedImage;
};

/**
 * Sube una imagen a Cloudinary
 * @param {File} file - Archivo de imagen a subir
 * @returns {Promise<string>} URL de la imagen subida
 */
export const uploadToCloudinary = async (file) => {
  try {
    // Validar que tengamos las credenciales necesarias
    if (!process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || !process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Faltan las credenciales de Cloudinary. Verifica tu archivo .env');
    }

    // Procesar la imagen
    const processedImage = await validateAndProcessImage(file);

    // Crear el FormData con los parámetros necesarios
    const formData = new FormData();
    formData.append('file', processedImage);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

    // Realizar la petición a Cloudinary
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error al subir la imagen a Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error en cloudinaryService:', error);
    throw new Error('Error al subir la imagen: ' + error.message);
  }
};
