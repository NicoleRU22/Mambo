import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
