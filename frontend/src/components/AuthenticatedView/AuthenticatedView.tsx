import { Outlet } from "react-router-dom";
import styles from "./AuthenticatedView.module.scss";
import Navbar from "../Navbar/Navbar"
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchUserData } from "../../slices/user";
import { useAppSelector } from "../../hooks/useAppSelector";

interface IAuthenticatedViewProps {
  userId: string
}

export default function AuthenticatedView({ userId }: IAuthenticatedViewProps) {
  const userState = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userState.status === "idle") {
      dispatch(fetchUserData(userId));
    }
  }, [userId, userState.status, dispatch]);

  if (userState.status !== "succeeded") {
    return null;
  }

  return (
    <div className={styles.container}>
      <Navbar /> 
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}