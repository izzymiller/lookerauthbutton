import {
  randBuffer,
  decodeObj,
  encodeObj,
  asyncSha256,
  b64uEncode,
  b64upadEncode
} from "./encoding";
export async function oauth_login(base_url) {
  const state = b64uEncode(randBuffer(8));
  const code_verifier = b64uEncode(randBuffer(32));
  const code_challenge = b64upadEncode(await asyncSha256(code_verifier)); // Workaround until standards compliant flow is available
  // const code_challenge = await sha256_hash(code_verifier);
  // const params = {
  //   response_type: "code",
  //   client_id: "lookerbutton",
  //   redirect_uri: "https://25vio.csb.app/auth",
  //   scope: "cors_api",
  //   state: state,
  //   code_challenge_method: "S256",
  //   code_challenge: code_challenge
  // };
  const url =
    "https://" +
    base_url +
    "/auth" +
    "?" +
    encodeObj({
      client_id: "lookerbutton",
      redirect_uri: "https://25vio.csb.app/auth",
      response_type: "code",
      scope: "cors_api",
      state: state,
      code_challenge_method: "S256",
      code_challenge: code_challenge
    });
  console.log(url);

  // Stash the code verifier we created in sessionStorage, which
  // will survive page loads caused by login redirects
  // The code verifier value is needed after the login redirect
  // to redeem the auth_code received for an access_token
  //

  sessionStorage.setItem("code_verifier", code_verifier);
  console.log(`set ${code_verifier} to sessionstorage!`);

  document.location = url;
}
