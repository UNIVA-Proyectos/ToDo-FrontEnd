import React, { useState } from "react";
import "../styles/sidebar.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

function Sidebar() {
  const [user] = useAuthState(auth);
  return (
    <div className={`sidebar`}>
      <div className="user-info">
        <img src={user?.photoURL} alt="Foto de perfil" className="user-image" />
        <span className="user-name">
          {user?.displayName?.split(" ").slice(0, 2).join(" ")}
        </span>
        <i className="fas fa-bell"></i>
      </div>
      <ul>
        <li>
          <a href="#">
            <i className="fas fa-calendar"></i> Calendario
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fas fa-list-check"></i> Tareas
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fas fa-gear"></i> Configuración
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
