"use client"

import { useState } from "react"
import Link from "next/link"
import { signup } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signup(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-alt py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/b0a153eb4f8ae1c916a5742cb518c6e7.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h1 className="text-center text-3xl font-bold text-primary">FreelanceSprint</h1>
          <h2 className="mt-6 text-center text-2xl font-bold">Create your account</h2>
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
              <label htmlFor="name" className="sr-only">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="form-input rounded-t-md"
                placeholder="Full name"
              />
            </div>
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
                className="form-input"
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
                autoComplete="new-password"
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
              className="group relative w-full flex justify-center btn-primary py-3"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
      <div className="hidden xl:block w-1/4 ml-8">
          <Image
            src="/Money wallet with credit card and receipt.png"
            alt="Right decorative image"
            width={400}
            height={800}
            className="rounded-xl shadow-lg"
            priority
          />
        </div>
    </div>
  )
}
