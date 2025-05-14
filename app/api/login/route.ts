// app/api/login/route.ts

import { NextResponse } from "next/server"
import { createSession } from "@/app/lib/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import { compare } from "bcryptjs"

export async function POST(req: Request) {
    try {
      const { email, password } = await req.json()
  
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
      }
  
      const { db } = await connectToDatabase()
      const user = await db.collection("users").findOne({ email })
  
      if (!user || !(await compare(password, user.password))) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }
  
      const { token, cookie } = await createSession({
        id: user._id.toString(),
        email: user.email,
        name: user.name || "",
      })
  
      const res = NextResponse.json({ success: true, redirectTo: "/dashboard" })
      res.headers.set("Set-Cookie", cookie)
      return res
    } catch (error) {
      console.error("Login error:", error)
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
  }