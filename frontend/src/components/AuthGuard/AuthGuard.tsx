import { Navigate, useLocation } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import AuthenticatedView from "../AuthenticatedView/AuthenticatedView";

export function AuthGuard() {
  const { data, error } = useFetch<{ userId: string }>("/api/session", {
    method: "GET",
    credentials: "include",
  });
  const location = useLocation();
  const intendedDestination = location.pathname;

  if (!data && !error) {
    return null;
  }

  if (!data && error) {
    console.log(error);
    const url = `/login?redirect_to=${intendedDestination}`;

    return <Navigate to={url} replace />;
  }

  return <AuthenticatedView userId={data!.userId} />;
}
