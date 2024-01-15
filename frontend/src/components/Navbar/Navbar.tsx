import { NavLink, NavLinkProps, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { CalendarMonth, Dashboard, LibraryBooks, Logout, Settings } from "@mui/icons-material";
import { useAppSelector } from "../../hooks/useAppSelector";

function CustomNavLink(props: NavLinkProps) {
  return (
    <NavLink
      className={({ isActive }) => `${styles["link"]} ${isActive ? styles["active-link"] : ""}`}
      {...props}
    />
  );
}

export default function Navbar() {
  const { firstName, lastName, email } = useAppSelector(state => state.user.data!);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("/api/session", { method: "DELETE", credentials: "include" });
    navigate("/login");
  };

  return (
    <nav id={styles.navbar}>
      <CustomNavLink to={"/app"} end>
        <Dashboard fill="white" /> Dashboard
      </CustomNavLink>

      <CustomNavLink to={"/app/courses"}>
        <LibraryBooks />
        Courses
      </CustomNavLink>

      <CustomNavLink to={"/app/calendar"}>
        <CalendarMonth /> Calendar
      </CustomNavLink>

      <CustomNavLink to={"/app/settings"}>
        <Settings /> Settings
      </CustomNavLink>

      <div className={styles.profile}>
        <div>
          <p>
            {firstName} {lastName}
          </p>
          <p id={styles.email}>{email}</p>
        </div>
        <div onClick={handleLogout}>
          <Logout className={styles["logout-button"]} />
        </div>
      </div>
    </nav>
  );
}
