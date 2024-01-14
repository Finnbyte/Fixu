import { Navigate, useLocation } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import AuthenticatedView from "../AuthenticatedView/AuthenticatedView";

function createRedirectURL(pathname: string) {
  let URL = "/login";
  if (pathname !== "/") {
    URL += `?redirect_to=${pathname}`
  }
  return URL;
}

export function AuthGuard() {
  const { data, error } = useFetch<{ userId: string }>("/api/session", {
    method: "GET",
    credentials: "include",
  });
  const location = useLocation();

  if (!data && !error) {
    return null;
  }

  if (!data && error) {
    console.log(error);
    const redirectionURL = createRedirectURL(location.pathname);

    return <Navigate to={redirectionURL} replace />;
  }

  return <AuthenticatedView userId={data!.userId} />;
}
