import { Navigate, useLocation } from "react-router-dom";
import AuthenticatedView from "../AuthenticatedView/AuthenticatedView";
import { useEffect, useState } from "react";
import { authService } from "../../auth/authService";

function createRedirectURL(pathname: string) {
  let URL = "/login";
  if (pathname !== "/") URL += `?redirect_to=${pathname}`;
  return URL;
}

export function AuthGuard() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    authService.ensureAuth().then(res => {
      if (!res.ok) {
        setUserId(null);
        return;
      }

      res.json().then(data => {
        setUserId(data["userId"]);
      });
    });
  }, []);

  if (userId === undefined) {
    return <></>;
  }

  if (userId === null) {
    const redirectionURL = createRedirectURL(location.pathname);
    return <Navigate to={redirectionURL} replace />;
  }

  return <AuthenticatedView userId={userId} />;
}
