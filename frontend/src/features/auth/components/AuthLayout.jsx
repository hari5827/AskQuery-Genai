import React from 'react'

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 relative overflow-hidden">
      <div className="absolute -left-24 -top-24 w-72 h-72 bg-purple-800/20 rounded-full blur-3xl transform rotate-12" />
      <div className="absolute right-4 top-32 w-56 h-56 bg-purple-700/10 rounded-full blur-2xl" />

      <div className="relative z-10 w-full max-w-md px-6 py-10 bg-white/4 backdrop-blur-md border border-white/6 rounded-2xl shadow-lg">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-50">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-gray-300">{subtitle}</p>}
        </header>

        <main>{children}</main>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-white/2 to-transparent mix-blend-overlay" />
    </div>
  )
}

export default AuthLayout
