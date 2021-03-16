import React, { useEffect, useState } from "react";
import { BrowserSettings, LookerBrowserSDK } from "@looker/sdk";
import { BrowserSession, DefaultSettings } from "@looker/sdk-rtl";
// import { BrowserSession } from "@looker/sdk-rtl";
import { ComponentsProvider, Button } from "@looker/components";

import { oauth_login } from "./Oauth";

export const AuthButtonStyled = () => {
  // const [loading, setLoading] = useState(true);
  // const [auth, setAuth] = useState<BrowserSession>();
  // const [oldUrl, setOldUrl] = useState<string>();
  // const history = useHistory();

  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const access_info = sessionStorage.getItem("access_info");
    if (access_info) {
      setAuthed(true);
    } else {
      setAuthed(false);
    }
  }, []);

  const handleSignIn = () => {
    oauth_login("hack.looker.com");
  };

  return (
    <ComponentsProvider>
      <Button size="large" iconBefore="LogoRings" onClick={handleSignIn}>
        {authed ? "Signed In" : "Sign In to Looker"}
      </Button>
      {authed ? "https://hack.looker.com" : ""}
    </ComponentsProvider>
  );
};
