import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import { auth } from "../../config/firebase";
import "../../styles/configUsuario.css"; // CSS global
import useUserData from "../../hooks/user/useUserData";
import { useNavigate } from "react-router-dom";
import useUpdateUserData from "../../hooks/user/useUpdateUserData";
import noProfileImage from "../../assets/no-profile-image.webp";
import DatePickerBtn from "../../components/inputs/DatePickerBtn";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveIcon from "@mui/icons-material/Save";

function ConfiguracionPerfil() {
  const { userData, loading } = useUserData();
  const { updateUserData } = useUpdateUserData();

  const [name, setNombre] = useState("");
  const [user] = useAuthState(auth);
  const [photoURL, setPhotoURL] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [genero, setGenero] = useState("");
  const [telefono, setTelefono] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const opcionesGenero = [
    { value: "", label: "Selecciona una opción" },
    { value: "masculino", label: "Masculino" },
    { value: "femenino", label: "Femenino" },
    { value: "no-binario", label: "No Binario" },
    { value: "genero-fluido", label: "Género Fluido" },
    { value: "transgenero", label: "Transgénero" },
    { value: "agender", label: "Agénero" },
    { value: "otro", label: "Otro" },
    { value: "prefiero-no-decirlo", label: "Prefiero no especificar" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (user?.email) {
      localStorage.setItem("lastEmail", user.email);
    }
    await auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    if (!loading && userData) {
      setNombre(userData.name || "");
      setPhotoURL(userData.photoURL || noProfileImage);
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
      // Validar el tamaño del archivo (máximo 5MB)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB en bytes
      if (file.size > MAX_SIZE) {
        throw new Error("El archivo es demasiado grande. El tamaño máximo es 5MB.");
      }

      // Validar el tipo de archivo
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error("Formato de archivo no válido. Use: JPG, PNG, GIF o WEBP.");
      }

      // Crear nombre de archivo seguro
      const safeFileName = `${userData.uid.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}.${fileExtension}`;
      const filePath = `profilePictures/${safeFileName}`;
      
      console.log('Creando referencia de storage para:', filePath);
      const storageRef = ref(storage, filePath);

      // Configurar los metadatos
      const metadata = {
        contentType: file.type,
        cacheControl: 'public,max-age=7200',
        customMetadata: {
          'uploadedBy': userData.uid,
          'uploadTime': new Date().toISOString()
        }
      };

      // Subir el archivo
      console.log('Iniciando subida de archivo...');
      const uploadTask = await uploadBytes(storageRef, file, metadata);
      console.log('Archivo subido exitosamente:', uploadTask);

      // Esperar un momento antes de obtener la URL
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Obtener la URL de descarga
      console.log('Obteniendo URL de descarga...');
      const downloadURL = await getDownloadURL(uploadTask.ref);
      console.log('URL de descarga obtenida:', downloadURL);

      // Actualizar el estado y Firestore
      setPhotoURL(downloadURL);
      await updateUserData({
        photoURL: downloadURL,
        lastPhotoUpdate: Date.now()
      });

      alert("Foto de perfil actualizada con éxito.");
    } catch (error) {
      console.error("Error detallado:", error);
      
      if (error.message) {
        alert(error.message);
      } else if (error.code === 'storage/unauthorized') {
        alert("No tienes permiso para realizar esta acción. Por favor, inicia sesión nuevamente.");
      } else if (error.code === 'storage/canceled') {
        alert("La subida fue cancelada.");
      } else if (error.code === 'storage/unknown') {
        alert("Ocurrió un error desconocido. Por favor, intenta de nuevo.");
      } else {
        alert("Error al subir la imagen. Por favor, intenta de nuevo.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await updateUserData({ photoURL: "" });
      setPhotoURL(noProfileImage);
      alert("Foto de perfil eliminada.");
    } catch (error) {
      console.error("Error al eliminar la foto:", error);
      alert("Hubo un error al eliminar la foto.");
    }
  };
  const handleSelectDate = (date) => {
    setFechaNacimiento(new Date(date));
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="configuracion-usuario-container">
      <div className="configuracion-content">
        <h1>Configuración de Perfil</h1>
        
        <div className="profile-section">
          {/* Columna Izquierda */}
          <div className="left-column">
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

            <div className="info-section">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setNombre(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="right-column">
            <div className="info-section">
              <div className="form-group">
                <label>Fecha de nacimiento</label>
                <DatePickerBtn handleSelectDate={handleSelectDate} />
              </div>
              <div className="form-group">
                <label>Género</label>
                <div className="custom-select" ref={dropdownRef}>
                  <div 
                    className="select-selected"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {opcionesGenero.find(opt => opt.value === genero)?.label || "Selecciona una opción"}
                    <span className="select-arrow"></span>
                  </div>
                  {isOpen && (
                    <div className="select-items">
                      {opcionesGenero.map((option) => (
                        <div
                          key={option.value}
                          className={`select-item ${genero === option.value ? 'selected' : ''}`}
                          onClick={() => {
                            setGenero(option.value);
                            setIsOpen(false);
                          }}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={handleSaveChanges} className="save-changes">
                <SaveIcon style={{ marginRight: "8px", fontSize: "20px" }} />
                Guardar Cambios
              </button>
              <button onClick={handleLogout} className="logout-button">
                <LogoutIcon style={{ marginRight: "8px", fontSize: "20px" }} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracionPerfil;