import jwt, { Algorithm } from "jsonwebtoken";

const SECRET_KEY = "fixu";
const ALGORITHM: Algorithm = "HS256";
const ISSUER = "fixu";

export interface ITokenPayload {
    userId: string
}

export function signJwtToken(payload: ITokenPayload) {
  const oneHour = Math.floor(Date.now() / 1000) + 60 * 60;

  const token = jwt.sign({ ...payload, exp: oneHour }, SECRET_KEY, { issuer: ISSUER, algorithm: ALGORITHM });
  return token;
}

export async function verifyJwtToken(token: string): Promise<ITokenPayload | null> {
  return new Promise((resolve, reject) => {
    try {
      const tokenPayload = jwt.verify(token, SECRET_KEY, {
        algorithms: [ALGORITHM],
      });
      resolve(tokenPayload as ITokenPayload);
    } catch (err) {
      reject(null);
    }
  });
}