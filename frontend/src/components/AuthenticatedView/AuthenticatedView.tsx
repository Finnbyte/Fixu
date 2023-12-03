import { Outlet } from "react-router-dom";
import styles from "./AuthenticatedView.module.scss";
import Navbar from "../Navbar/Navbar"

export default function AuthenticatedView() {
  return (
    <div className={styles.container}>
      <Navbar /> 
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}