import { Navigate, useLocation } from "react-router-dom";
import AuthenticatedView from "../AuthenticatedView/AuthenticatedView";
import { useGetUserDataQuery } from "../../slices/api";

function createRedirectURL(pathname: string) {
  let URL = "/login";
  if (pathname !== "/") URL += `?redirect_to=${pathname}`;
  return URL;
}

export function AuthGuard() {
  const { data, error } = useGetUserDataQuery();
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
