import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import { type NextRequest, NextResponse } from "next/server"

// Secret key for JWT signing - in production, use an environment variable
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your_jwt_secret_key_min_32_chars_long")

export type UserJwtPayload = {
  id: string
  email: string
  name: string
}

// Create a session token
// createSession now returns the token string
export async function createSession(user: UserJwtPayload) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET)

  // Return both token and cookie value
  return {
    token,
    cookie: `session_token=${token}; Path=/; HttpOnly; SameSite=Lax; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    } Expires=${expiresAt.toUTCString()}`,
  }
}
// Get the current session
export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  if (!token) return null

  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as UserJwtPayload
  } catch (error) {
    // Token is invalid or expired
    return null
  }
}

// Delete the session (logout)
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session_token")
}



// Middleware-safe function: uses request.cookies.get()
export async function authMiddleware(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    await jwtVerify(token, JWT_SECRET)
    return NextResponse.next()
  } catch (error) {
    console.error("Invalid or expired session token:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}
