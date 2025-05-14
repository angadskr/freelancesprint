"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  email: string
  name: string
} | null

type AuthContextType = {
  user: User
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function loadUserFromSession() {
      try {
        const res = await fetch("/api/auth/me")

        if (res.ok) {
          const userData = await res.json()
          setUser(userData.user)
        } else {
          setUser(null)

          // Redirect to login if on a protected route
          const publicRoutes = ["/login", "/signup", "/"]
          if (!publicRoutes.includes(pathname)) {
            router.push("/login")
          }
        }
      } catch (error) {
        console.error("Error loading user session:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUserFromSession()
  }, [pathname, router])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}
