import { NavLink, NavLinkProps, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { CalendarMonth, Home, LibraryBooks, Logout, Settings } from "@mui/icons-material";
import { User } from "../../../../backend/db/schemas/users";
import { useUserStore } from "../../store/user";

function CustomNavLink(props: NavLinkProps) {
  return (
    <NavLink
      className={({ isActive }) => `${styles["link"]} ${isActive ? styles["active-link"] : ""}`}
      {...props}
    />
  );
}

export default function Navbar() {
  const { firstName, lastName, email } = useUserStore((state) => ({
    firstName: state.data?.firstName,
    lastName: state.data?.lastName,
    email: state.data?.email,
  }));
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("/api/session", { method: "DELETE", credentials: "include" });
    navigate("/login");
  };

  return (
    <nav id={styles.navbar}>
      <CustomNavLink to={"/app"} end>
        <Home fill="white" /> Home
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
