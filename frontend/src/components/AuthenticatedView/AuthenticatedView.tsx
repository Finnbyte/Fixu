import { Outlet } from "react-router-dom";
import styles from "./AuthenticatedView.module.scss";
import Navbar from "../Navbar/Navbar"
import { useUserStore } from "../../store/user";
import { useEffect } from "react";

interface IAuthenticatedViewProps {
  userId: string
}

export default function AuthenticatedView({ userId }: IAuthenticatedViewProps) {
  const user = useUserStore();
  useEffect(() => {
    user.fetch(userId);
  }, [userId, user])
  return (
    <div className={styles.container}>
      <Navbar /> 
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}