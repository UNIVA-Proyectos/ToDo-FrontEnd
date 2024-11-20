import React, { useState, useEffect } from "react";
import "../styles/configUsuario.css"; // CSS global
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useUserData from "../hooks/user/useUserData";
import useUpdateUserData from "../hooks/user/useUpdateUserData";
import NoImage from "../assets/no-profile-image.webp";

function ConfiguracionPerfil() {
  const { userData, loading } = useUserData();
  const { updateUserData } = useUpdateUserData();

  const [name, setNombre] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [telefono, setTelefono] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!loading && userData) {
      setNombre(userData.name || "");
      setPhotoURL(userData.photoURL || NoImage);
      setFechaNacimiento(userData.fechaNacimiento || "");
      setGenero(userData.genero || "");
      setTelefono(userData.telefono || "");
    }
  }, [userData, loading]);

  const handleSaveChanges = async () => {
    const updatedData = {
      name,
      photoURL,
      fechaNacimiento,
      genero,
      telefono,
    };
    await updateUserData(updatedData);
    alert("Datos actualizados con éxito.");
  };

  const handleChangePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida.");
      return;
    }
    if (!userData?.uid) {
      alert("Usuario no encontrado. Inténtalo de nuevo.");
      return;
    }

    setIsUploading(true);
    try {
      // Subir la imagen a Firebase Storage
      const storageRef = ref(storage, `profilePictures/${userData.uid}`);
      await uploadBytes(storageRef, file);

      // Obtener la URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      setPhotoURL(downloadURL);

      // Actualizar en Firestore
      await updateUserData({ photoURL: downloadURL });
      alert("Foto de perfil actualizada con éxito.");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Hubo un error al subir la imagen. Inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await updateUserData({ photoURL: "" });
      setPhotoURL(NoImage);
      alert("Foto de perfil eliminada.");
    } catch (error) {
      console.error("Error al eliminar la foto:", error);
      alert("Hubo un error al eliminar la foto.");
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="configuracion-usuario-container">
      <div className="configuracion-content">
        <h1>Configuración de Perfil</h1>
        <div className="user-info">
          <img src={photoURL} alt="Foto de perfil" className="profile-photo" />
          <div className="settings">
            <input
              type="file"
              id="uploadPhoto"
              style={{ display: "none" }}
              onChange={handleChangePhoto}
            />
            <button
              className="btn change-photo"
              onClick={() => document.getElementById("uploadPhoto").click()}
              disabled={isUploading}
            >
              {isUploading ? "Subiendo..." : "Cambiar foto"}
            </button>
            <button
              className="btn delete-photo"
              onClick={handleDeletePhoto}
              disabled={isUploading}
            >
              Eliminar foto
            </button>
          </div>
        </div>

        <div className="basic-info-section info-section">
          <h2>Información Básica</h2>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setNombre(e.target.value)}
            className="input-field"
          />
          <label>Fecha de nacimiento</label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="input-field"
          />
          <label>Género</label>
          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            className="input-field"
          >
            <option value="">Selecciona tu género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="No Binario">No Binario</option>
            <option value="Otro">Otro</option>
            <option value="prefiero-no-decirlo">Prefiero no decirlo</option>
          </select>
          <label>Teléfono</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="input-field"
          />
          <button onClick={handleSaveChanges} className="btn save-changes">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracionPerfil;
