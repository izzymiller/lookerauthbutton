import { AuthToken, BrowserTransport } from "@looker/sdk";
import { OAuthSession, BrowserSession } from "@looker/sdk-rtl";

export class BrowserAuthSession extends BrowserSession {
  constructor(settings, transport) {
    super(
      new BrowserServices({
        settings,
        transport: transport || new BrowserTransport(settings)
      })
    );
  }
  fetchToken() {
    return fetch("");
  }
  activeToken = new AuthToken();
  isAuthenticated() {
    const token = this.activeToken;
    if (!(token && token.access_token)) return false;
    return token.isActive();
  }
  async getToken() {
    if (!this.isAuthenticated()) {
      const token = await this.fetchToken();
      this.activeToken.setToken(await token.json());
    }
    return this.activeToken;
  }
  async authenticate(props) {
    const token = await this.getToken();
    if (token && token.access_token) {
      props.mode = "cors";
      delete props.credentials;
      props.headers = {
        ...props.headers,
        Authorization: `Bearer ${this.activeToken.access_token}`
      };
    }
    return props;
  }
  async redeem_auth_code(auth_code) {
    console.log(auth_code);

    if (!auth_code) {
      console.log("ERROR: No authorization code in response");
      return;
    }
    console.log(`auth code received: ${auth_code}`);

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
    return info;
  }
}
