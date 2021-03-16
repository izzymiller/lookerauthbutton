export function randBuffer(bytelen) {
  var array = new Uint8Array(bytelen || 16);
  crypto.getRandomValues(array);
  return array.buffer;
}
export async function asyncSha256(str) {
  const bufferIn = new TextEncoder("utf-8").encode(str);
  const bufferOut = await crypto.subtle.digest("SHA-256", bufferIn);
  return bufferOut;
}
export function b64uEncode(buffer) {
  var str = "";
  var bytes = new Uint8Array(buffer);
  for (var i = 0, l = bytes.byteLength; i < l; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}
export function b64upadEncode(buffer) {
  //this time with padding
  var str = "";
  var bytes = new Uint8Array(buffer);
  for (var i = 0, l = bytes.byteLength; i < l; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_");
}
export function encodeObj(o) {
  return Object.entries(o)
    .filter(([k, v]) => v !== undefined)
    .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
    .join("&");
}
export function decodeObj(str, from) {
  return (from ? str.slice(1 + str.indexOf(from)) : str)
    .split("&")
    .map((pair) => pair.split("=").map(decodeURIComponent))
    .reduce((o, [k, ...v]) => ({ ...o, [k]: (v || "").join("=") }), {});
}
