import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
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

  const onSubmit: SubmitHandler<ILoginInputs> = async (data) => {
    const res = await fetch("/api/session", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorMessage = (await res.json()).msg;
      return setError("root", { message: errorMessage });
    }

    const searchParams = new URLSearchParams(location.search);
    navigate(searchParams.get("redirect_to") ?? "/app");
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
            <button type="submit" className={styles["login-btn"]}>Login</button>
          </div>

          <span color="red">{errors.root && errors.root.message}</span>
        </form>
      </div>
    </div>
  );
}
