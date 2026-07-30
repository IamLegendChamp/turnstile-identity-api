import { readFileSync } from "fs";
import path from "path";
import { SignJWT, jwtVerify, importPKCS8, importSPKI, type KeyLike } from "jose";

const privateKeyPem = readFileSync(
  path.join(process.cwd(), "keys", "private.pem"),
  "utf8"
);
const publicKeyPem = readFileSync(
  path.join(process.cwd(), "keys", "public.pem"),
  "utf8"
);

export type AccessTokenPayload = {
  sub: string;
  email: string;
  userType: string;
  roles: string[];
  permissions: string[];
};

let privateKey: KeyLike;
let publicKey: KeyLike;

export async function initKeys() {
  privateKey = await importPKCS8(privateKeyPem, "RS256");
  publicKey = await importSPKI(publicKeyPem, "RS256");
}

export async function signAccessToken(payload: AccessTokenPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(privateKey);
}

export async function signRefreshToken(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(privateKey);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, publicKey, {
    algorithms: ["RS256"],
  });
  return payload as AccessTokenPayload & { sub: string };
}
