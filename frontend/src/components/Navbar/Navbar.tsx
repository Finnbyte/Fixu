function CustomNavLink(props: NavLinkProps) {
  return (
    <NavLink
      className={({ isActive }) => `${styles["link"]} ${isActive ? styles["active-link"] : ""}`}
      {...props}
    />
  );
}
