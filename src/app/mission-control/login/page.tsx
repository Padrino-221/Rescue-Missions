'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PiHeartFill, PiWarning } from 'react-icons/pi'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/mission-control')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-lime rounded-full flex items-center justify-center mx-auto mb-4">
            <PiHeartFill className="w-8 h-8 text-dark" />
          </div>
          <h1 className="text-2xl font-serif text-white">Mission Control</h1>
          <p className="text-white/50 text-sm mt-2">Rescue Mission Orphanage Admin</p>
        </div>

        <div className="bg-white rounded-3xl p-8">
          <h2 className="text-xl font-serif text-dark mb-6">Sign In</h2>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
              <PiWarning className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-dark/15 bg-white text-dark text-sm placeholder:text-dark/35 focus:outline-none focus:border-dark/40 transition-colors"
                placeholder="admin@rescuemission.org"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-dark/15 bg-white text-dark text-sm placeholder:text-dark/35 focus:outline-none focus:border-dark/40 transition-colors"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-dark text-white font-extrabold text-sm tracking-wide hover:bg-dark-50 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-dark/40">
            Default: admin@rescuemission.org / RescueMission2024!
          </p>
        </div>
      </div>
    </div>
  )
}
