"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { login } from "@/app/actions/auth"
import Image from "next/image"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await login(formData)

      if ('error' in result && result.error) {
        setError(result.error)
      } else if ('success' in result) {
        // Just redirect - cookie will be set by the server
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-alt py-12 px-4 sm:px-6 lg:px-8">
       <div className="hidden lg:block lg:w-1/4 relative h-[600px] mr-8">
        <Image
          src="/a04f4ebfe51a6e1c28fe19237444b2f9.jpg" 
          alt="Decorative left"
          fill
          className="object-cover rounded-xl shadow-lg"
          priority
        />
      </div>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h1 className="text-center text-3xl font-bold text-primary">FreelanceSprint</h1>
          <h2 className="mt-6 text-center text-2xl font-bold">Sign in to your account</h2>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" action={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input rounded-t-md"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="form-input rounded-b-md"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center btn-green py-3"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:text-primary-dark font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
      <div className="hidden lg:block lg:w-1/4 relative h-[600px] ml-8">
        <Image
          src="/c3.jpg"
          alt="Decorative right"
          fill
          className="object-cover rounded-xl shadow-lg"
          priority
        />
      </div>
    </div>
  )
}
