import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";

interface ILoginInputs {
  email: string
  password: string
}

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ILoginInputs>();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit: SubmitHandler<ILoginInputs> = (data) => {
    fetch("/api/session", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (!res.ok) {
        res.json().then(payload => setError("root", { message: payload.msg }))
        return;
      }

      const searchParams = new URLSearchParams(location.search);
      navigate(searchParams.get("redirect_to") ?? "/app");
    });
  };

  return (
    <div className={styles.page}>
      <h1 style={{ fontSize: "3rem" }}>Fixu</h1>
      <h3>Good to see you again</h3>
      <div className={styles["login-container"]}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Email
            <input
              placeholder="e.g. john.doe@gmail.com"
              {...register("email")}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="e.g. password123"
              {...register("password")}
            />
          </label>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button type="submit" className={styles["login-btn"]}>
              Login
            </button>
          </div>

          <span color="red">{errors.root && errors.root.message}</span>
          <Link to="/register">Don't have an account?</Link>
        </form>
      </div>
    </div>
  );
}
