"use server"
import { redirect } from "next/navigation"
import { createSession, deleteSession } from "../lib/auth"
import { connectToDatabase } from "../lib/mongodb"
import { compare, hash } from "bcryptjs"
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ email })

    if (!user || !(await compare(password, user.password))) {
      return { error: "Invalid email or password" }
    }

    const { token } = await createSession({
      id: user._id.toString(),
      email: user.email,
      name: user.name || "",
    })

    // Set cookie server-side
    const cookieStore = await cookies()
    await cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An error occurred during login" }
  }
}

export async function signup(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!name || !email || !password) {
    return { error: "All fields are required" }
  }

  try {
    const { db } = await connectToDatabase()
    const existingUser = await db.collection("users").findOne({ email })

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    const hashedPassword = await hash(password, 10)
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    // Create session and return cookie
    const { cookie } = await createSession({
      id: result.insertedId.toString(),
      email,
      name,
    })

    return { success: true, cookie }
  } catch (error) {
    console.error("Signup error:", error)
    return { error: "An error occurred during signup" }
  }
}

export async function logout() {
  await deleteSession()
  redirect("/")
}
