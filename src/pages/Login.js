import React, { useState } from "react";
import "../App.css";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase"; // Firestore import
import { setDoc, doc } from "firebase/firestore"; // Para guardar usuario

const AppLogin = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState(false); // Estado para error en email
  const [passwordError, setPasswordError] = useState(false); // Estado para error en password
  const [message, setMessage] = useState(""); // Mensajes de éxito o error
  const navigate = useNavigate();

  const handleSignUpClick = () => setIsRightPanelActive(true);
  const handleSignInClick = () => setIsRightPanelActive(false);

  // Validar campos vacíos
  const validateFields = () => {
    let valid = true;

    // Verificar si los campos están vacíos
    if (!email) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (!password) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (!valid) {
      setMessage("Por favor, completa todos los campos.");
    }

    return valid;
  };

  // Inicio de sesión con Google
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Usuario autenticado con Google:", user);
      setMessage("Inicio de sesión con Google exitoso.");

      // Guardar o actualizar usuario en Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          provider: "Google",
          lastLogin: new Date(),
        },
        { merge: true }
      ); // El merge asegura que no sobrescribas datos existentes

      navigate("/home");
    } catch (error) {
      setMessage("Error al autenticar con Google: " + error.message);
    }
  };

  // Inicio de sesión con Facebook
  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      console.log("Usuario autenticado con Facebook:", user);
      setMessage("Inicio de sesión con Facebook exitoso.");

      // Guardar o actualizar usuario en Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          name: user.displayName, // Guardar el nombre del usuario
          provider: "Facebook", // Indicar el proveedor de autenticación
          lastLogin: new Date(), // Guardar la última fecha de login
        },
        { merge: true }
      ); // El merge asegura que no sobrescribas datos existentes

      navigate("/home");
    } catch (error) {
      setMessage("Error al autenticar con Facebook: " + error.message);
    }
  };

  // Inicio de sesión con email y contraseña
  const handleEmailSignIn = async () => {
    if (!validateFields()) return;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Usuario autenticado con email:", user);
      setMessage("Inicio de sesión con email exitoso.");
      navigate("/home");
    } catch (error) {
      setMessage("Error al iniciar sesión con email: " + error.message);
    }
  };

  // Registro con email y contraseña
  const handleEmailSignUp = async () => {
    if (!validateFields()) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Usuario registrado:", user);
      setMessage("Registro exitoso.");

      // Guardar usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: name,
        createdAt: new Date(),
      });

      navigate("/home");
    } catch (error) {
      setMessage("Error al registrarse con email: " + error.message);
    }
  };

  return (
    <div
      className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}
    >
      {/* Contenedor para Iniciar Sesión */}
      <div className="form-container sign-in-container">
        <form>
          <h1>Sign In</h1>
          {message && <p className="message">{message}</p>}
          <div className="social-container">
            <a href="#" className="social" onClick={handleFacebookSignIn}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social" onClick={handleGoogleSignIn}>
              <i className="fab fa-google-plus-g"></i>
            </a>
          </div>
          <span>or use your account</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={emailError ? "input-error" : ""}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={passwordError ? "input-error" : ""}
          />
          <button type="button" onClick={handleEmailSignIn}>
            Sign In
          </button>
        </form>
      </div>

      {/* Contenedor para Crear Cuenta */}
      <div className="form-container sign-up-container">
        <form>
          <h1>Create Account</h1>
          {message && <p className="message">{message}</p>}{" "}
          {/* Mensaje de éxito o error */}
          <div className="social-container">
            <a href="#" className="social" onClick={handleFacebookSignIn}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social" onClick={handleGoogleSignIn}>
              <i className="fab fa-google-plus-g"></i>
            </a>
          </div>
          <span>or use your email for registration</span>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)} // Maneja el cambio del nombre
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={emailError ? "input-error" : ""}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={passwordError ? "input-error" : ""}
          />
          <button type="button" onClick={handleEmailSignUp}>
            Sign Up
          </button>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us, please login with your personal info
            </p>
            <button className="ghost" onClick={handleSignInClick}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start to-do list.</p>
            <button className="ghost" onClick={handleSignUpClick}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLogin;
