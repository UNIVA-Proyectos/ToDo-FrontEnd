/**
 * Servicio para manejar las interacciones con Cloudinary
 */

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;

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

    // Crear el FormData con los parámetros necesarios
    const formData = new FormData();
    formData.append('file', file);
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
