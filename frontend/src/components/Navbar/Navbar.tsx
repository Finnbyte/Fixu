import { NavLink, NavLinkProps } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { CalendarMonth, Home, LibraryBooks, Logout, Settings } from "@mui/icons-material";

function CustomNavLink(props: NavLinkProps) {
  return (
    <NavLink
      className={({ isActive }) => `${styles["link"]} ${isActive ? styles["active-link"] : ""}`}
      {...props}
    />
  );
}

export default function Navbar() {
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
          <p>Jarmo Jortikka</p>
          <p id={styles.email}>jarmo.jortikka@edu.turku.fi</p>
        </div>
        <div onClick={() => console.log("clicked")}>
          <Logout className={styles["logout-button"]} />
        </div>
      </div>
    </nav>
  );
}
