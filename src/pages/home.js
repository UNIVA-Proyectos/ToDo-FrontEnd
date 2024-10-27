// Home.js
import React from "react";
import styles from "../styles/home.module.css";

const Home = () => {
  return (
    <div className={styles["home-container"]}>
      <div className={styles.sidebar}>
        <h2>Mis Tareas</h2>
        <ul>
          <li>
            <a href="#">
              <i className="fas fa-inbox"></i> Inbox
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fas fa-list"></i> Actividad
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fas fa-chart-bar"></i> Reportes
            </a>
          </li>
        </ul>
      </div>

      <div className={styles["main-content"]}>
        <header>
          <h1>Inbox</h1>
          <p>Revisa tus mensajes y tareas recientes</p>
        </header>

        <section className={styles["task-section"]}>
          <h2>Tareas Faltantes</h2>
          <div className={styles["task-list"]}>
            <div className={`${styles["task-item"]} ${styles.pending}`}>
              <h3>Escribir documento de requisitos</h3>
              <p>Vencimiento: 12 de diciembre, 2024</p>
              <p className={styles["task-progress"]}>Progreso: 20%</p>
            </div>
            <div className={`${styles["task-item"]} ${styles.pending}`}>
              <h3>Investigar herramientas de gestión</h3>
              <p>Vencimiento: 5 de diciembre, 2024</p>
              <p className={styles["task-progress"]}>Progreso: 50%</p>
            </div>
          </div>
        </section>

        <section className={styles["task-section"]}>
          <h2>Tareas Vencidas</h2>
          <div className={styles["task-list"]}>
            <div className={`${styles["task-item"]} ${styles.overdue}`}>
              <h3>Enviar agenda de la reunión</h3>
              <p>Vencimiento: 1 de diciembre, 2024</p>
            </div>
          </div>
        </section>

        <section className={styles["task-section"]}>
          <h2>Tareas Completadas</h2>
          <div className={styles["task-list"]}>
            <div className={`${styles["task-item"]} ${styles.completed}`}>
              <h3>Diseñar el dashboard de usuario</h3>
              <p>Completado: 30 de noviembre, 2024</p>
              <p className={styles["task-progress"]}>Progreso: 100%</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
