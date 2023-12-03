import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

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
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      const errorMessage = (await res.json()).msg;
      return setError("root", { message: errorMessage })
    }
    
    const searchParams = new URLSearchParams(location.search);
    navigate(searchParams.get("redirect_to") ?? "/app");
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input {...register("email")}/>

        <label>Password</label>
        <input {...register("password")}/>

        <button type="submit">Login</button>
        <span>{errors.root && errors.root.message}</span>
      </form>
    </div>
  );
}
