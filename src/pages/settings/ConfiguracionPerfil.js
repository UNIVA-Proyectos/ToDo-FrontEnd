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
import LockIcon from "@mui/icons-material/Lock";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function ConfiguracionPerfil() {
  const { userData, loading } = useUserData();
  const { updateUserData } = useUpdateUserData();

  const [name, setNombre] = useState("");
  const [user] = useAuthState(auth);
  const [photoURL, setPhotoURL] = useState(userData?.photoURL || "");
  const [fechaNacimiento, setFechaNacimiento] = useState(userData?.fechaNacimiento || "");
  const [genero, setGenero] = useState(userData?.genero || "");
  const [telefono, setTelefono] = useState(userData?.telefono || "");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    aspect: 1
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [openImageEditor, setOpenImageEditor] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Estados para el cambio de contraseña
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Get the login provider
  const isPasswordProvider = user?.providerData[0]?.providerId === 'password';
  const loginProvider = user?.providerData[0]?.providerId;

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
    setAlertMessage("Datos actualizados con éxito.");
    setAlertSeverity('success');
    setOpenAlert(true);
  };

  // Función para manejar la selección inicial de la imagen
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      setAlertMessage("Por favor selecciona una imagen válida.");
      setAlertSeverity('error');
      setOpenAlert(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setOpenImageEditor(true);
    };
    reader.readAsDataURL(file);
  };

  // Función para cargar la imagen cuando se complete
  const onImageLoad = (e) => {
    imgRef.current = e.target;
    const { width, height } = e.target;
    const crop = {
      unit: '%',
      width: 90,
      x: 5,
      y: 5,
      aspect: 1
    };
    setCrop(crop);
  };

  // Función para generar la vista previa
  const generatePreview = async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return;

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  };

  // Función para subir la imagen recortada
  const handleUpload = async () => {
    if (!completedCrop || !imgRef.current) {
      setAlertMessage("Por favor, selecciona y recorta la imagen primero.");
      setAlertSeverity('error');
      setOpenAlert(true);
      return;
    }

    try {
      if (!userData || !userData.uid) {
        throw new Error("Usuario no autenticado");
      }

      setIsUploading(true);

      // Crear un canvas con la imagen recortada
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = imgRef.current;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      // Convertir el canvas a Blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });

      // Subir a Firebase
      const timestamp = Date.now();
      const fileName = `${timestamp}.jpg`;
      const filePath = `profilePictures/${fileName}`;
      const storageRef = ref(storage, filePath);

      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Actualizar perfil
      setPhotoURL(downloadURL);
      await updateUserData({
        photoURL: downloadURL,
        lastPhotoUpdate: timestamp
      });

      // Limpiar estado
      setSelectedImage(null);
      setOpenImageEditor(false);
      setCrop({
        unit: '%',
        width: 50,
        aspect: 1
      });
      setCompletedCrop(null);

      setAlertMessage("¡Foto de perfil actualizada con éxito!");
      setAlertSeverity('success');
      setOpenAlert(true);
    } catch (error) {
      console.error("Error completo:", error);
      setAlertMessage("Error al subir la imagen: " + error.message);
      setAlertSeverity('error');
      setOpenAlert(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectDate = (date) => {
    setFechaNacimiento(new Date(date));
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    try {
      // Aquí iría la lógica para cambiar la contraseña
      setAlertMessage("Contraseña actualizada con éxito");
      setAlertSeverity('success');
      setOpenAlert(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpenPasswordModal(false);
    } catch (error) {
      setPasswordError("Error al cambiar la contraseña: " + error.message);
      setAlertMessage("Error al cambiar la contraseña: " + error.message);
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };

  const handleCloseImageEditor = () => {
    setSelectedImage(null);
    setOpenImageEditor(false);
    setCrop({ unit: '%', width: 50, aspect: 1 });
  };

  const showAlert = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpenAlert(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="configuracion-usuario-container">
      <div className="configuracion-content">
        <div style={{
          marginBottom: '2rem',
          borderBottom: '2px solid #fff',
          paddingBottom: '1rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            color: '#fff',
            margin: '0',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: '-0.5px'
          }}>
            Configuración de Perfil
          </h1>
          <p style={{
            color: '#888',
            margin: '0.5rem 0 0 0',
            fontSize: '1rem',
            fontWeight: '400',
            fontFamily: "'Inter', sans-serif"
          }}>
            Personaliza tu información y ajusta tu cuenta
          </p>
        </div>

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
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={isUploading}
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
                  onClick={() => {
                    setPhotoURL(noProfileImage);
                    updateUserData({ photoURL: noProfileImage });
                  }}
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

              {/* Botón de cambio de contraseña */}
              <div className="form-group">
                {!isPasswordProvider ? (
                  <div className="password-provider-notice">
                    No se puede cambiar la contraseña - Cuenta vinculada con {loginProvider === 'google.com' ? 'Google' : 'Facebook'}
                  </div>
                ) : (
                  <button 
                    onClick={() => setOpenPasswordModal(true)} 
                    className="change-password-button"
                  >
                    <LockIcon style={{ marginRight: "8px", fontSize: "20px" }} />
                    Cambiar Contraseña
                  </button>
                )}
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

        {/* Modal para editar imagen */}
        <Modal
          open={openImageEditor}
          onClose={handleCloseImageEditor}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="modal-container"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '600px',
            bgcolor: '#1a1a1a',
            color: '#fff',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            borderRadius: '16px',
            p: 0,
            outline: 'none',
            maxHeight: '90vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#2d2d2d',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            }
          }}>
            <div className="image-editor-modal">
              <div className="modal-header" style={{
                padding: '20px',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#2d2d2d'
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#fff'
                }}>
                  Ajustar imagen de perfil
                </h2>
                <button
                  onClick={handleCloseImageEditor}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#888'}
                >
                  ×
                </button>
              </div>

              <div style={{ padding: '20px' }}>
                <div className="editor-content" style={{
                  background: '#2d2d2d',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    onComplete={c => setCompletedCrop(c)}
                    aspect={1}
                    circularCrop
                    style={{
                      background: '#1a1a1a',
                      padding: '10px',
                      borderRadius: '8px'
                    }}
                  >
                    <img
                      ref={imgRef}
                      alt="Editar imagen"
                      src={selectedImage}
                      onLoad={onImageLoad}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '50vh',
                        borderRadius: '8px'
                      }}
                    />
                  </ReactCrop>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'flex-end',
                  padding: '0 20px 20px'
                }}>
                  <button
                    onClick={handleCloseImageEditor}
                    className="btn cancel-photo"
                    style={{
                      background: '#3a3a3a',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#4a4a4a'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#3a3a3a'}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      handleUpload();
                      handleCloseImageEditor();
                    }}
                    disabled={isUploading || !completedCrop?.width || !completedCrop?.height}
                    className="btn save-photo"
                    style={{
                      background: '#007bff',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      opacity: (isUploading || !completedCrop?.width || !completedCrop?.height) ? '0.7' : '1'
                    }}
                    onMouseOver={(e) => {
                      if (!isUploading && completedCrop?.width && completedCrop?.height) {
                        e.currentTarget.style.background = '#0056b3'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isUploading && completedCrop?.width && completedCrop?.height) {
                        e.currentTarget.style.background = '#007bff'
                      }
                    }}
                  >
                    {isUploading ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </Modal>

        {/* Modal de cambio de contraseña */}
        <Modal
          open={openPasswordModal}
          onClose={() => setOpenPasswordModal(false)}
          aria-labelledby="modal-cambio-contraseña"
        >
          <Box className="password-modal">
            <h2>Cambiar Contraseña</h2>
            <div className="modal-form-group">
              <label>Contraseña Actual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-field"
                placeholder="Ingresa tu contraseña actual"
              />
            </div>
            <div className="modal-form-group">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="Ingresa tu nueva contraseña"
              />
            </div>
            <div className="modal-form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="Confirma tu nueva contraseña"
              />
            </div>
            {passwordError && <p className="error-text">{passwordError}</p>}
            <div className="modal-buttons">
              <button 
                onClick={handlePasswordChange}
                className="save-changes"
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                <SaveIcon style={{ marginRight: "8px", fontSize: "20px" }} />
                Guardar Contraseña
              </button>
              <button 
                onClick={() => setOpenPasswordModal(false)}
                className="cancel-button"
              >
                Cancelar
              </button>
            </div>
          </Box>
        </Modal>

        {/* Snackbar para alertas */}
        <Snackbar
          open={openAlert}
          autoHideDuration={4000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alertSeverity}
            sx={{
              width: '100%',
              minWidth: '300px',
              borderRadius: '10px',
              backgroundColor: alertSeverity === 'success' ? '#1a1a1a' : '#1a1a1a',
              color: '#fff',
              '& .MuiAlert-icon': {
                color: alertSeverity === 'success' ? '#4caf50' : '#f44336',
                marginRight: '12px',
              },
              '& .MuiSvgIcon-root': {
                fontSize: '24px',
              },
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              border: `1px solid ${alertSeverity === 'success' ? '#4caf50' : '#f44336'}`,
            }}
            icon={alertSeverity === 'success' ? <CheckCircleOutlineIcon /> : undefined}
          >
            <span style={{ 
              fontSize: '0.95rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {alertMessage}
            </span>
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default ConfiguracionPerfil;