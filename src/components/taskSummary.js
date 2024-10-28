import React from "react";
import styles from "../styles/taskSummary.module.css";

const TaskSummary = ({ completedCount, pendingCount, overdueCount }) => (
  <div className={styles.taskSummaryContainer}>
    <div className={`${styles.taskSummaryCard} ${styles.completed}`}>
      <div className={styles.taskCount}>{completedCount}</div>
      <div>Completadas</div>
    </div>
    <div className={`${styles.taskSummaryCard} ${styles.pending}`}>
      <div className={styles.taskCount}>{pendingCount}</div>
      <div>Pendientes</div>
    </div>
    <div className={`${styles.taskSummaryCard} ${styles.overdue}`}>
      <div className={styles.taskCount}>{overdueCount}</div>
      <div>Vencidas</div>
    </div>
  </div>
);

export default TaskSummary;
