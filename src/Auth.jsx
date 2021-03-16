// interface OauthResponse {
//   expires_in: Number;
//   expires_at: Date;
// }
import { useLocation } from "react-router-dom";
import queryString from "query-string";

export const Auth = () => {
  const loc = useLocation();
  const access_info = redeem_auth_code(loc);
  console.log(access_info);
  return (
    <>
      Testing Auth
      <br />
      {JSON.stringify(access_info)}
    </>
  );
};

async function redeem_auth_code(location) {
  const parsedLocation = queryString.parse(location.search);
  const auth_code = parsedLocation.code;
  console.log(auth_code);

  if (!auth_code) {
    console.log("ERROR: No authorization code in response");
    return;
  }
  console.log(`auth code received: ${auth_code}`);
  console.log(`state: ${parsedLocation.state}`);

  const code_verifier = sessionStorage.getItem("code_verifier");
  console.log(`retrieved ${code_verifier} from sessionstorage`);
  if (!code_verifier) {
    console.log("ERROR: Missing code_verifier in session storage");
    return;
  }
  sessionStorage.removeItem("code_verifier");
  console.log(`removed ${code_verifier} from sessionstorage`);
  const response = await fetch("https://hack.looker.com:19999/api/token", {
    // This is the URL of your Looker instance's API web service
    method: "POST",
    mode: "cors", // This line is required so that the browser will attempt a CORS request.
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: "lookerbutton",
      redirect_uri: "https://25vio.csb.app/auth",
      code: auth_code,
      code_verifier: code_verifier
    }),
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8" // This header is required.
    }
  }).catch((error) => {
    console.log(`Error: ${error.message}`);
  });

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const info = await response.json();
  console.log(`/token response: ${JSON.stringify(info)}`);
  sessionStorage.setItem("access_info", JSON.stringify(info));

  const expires_at = new Date(Number(Date.now()) + info.expires_in * 1000);
  console.log(
    `Access token expires at ${expires_at.toLocaleTimeString()} local time.`
  );
  console.log(info);
  window.location.replace("/");
}
