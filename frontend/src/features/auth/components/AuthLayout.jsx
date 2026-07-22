import React from 'react'

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#050505] text-white">
      {/* Background — matches the dashboard's radial gradient + red glow accents */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-40 left-0 h-96 w-96 rounded-full bg-red-700/5 blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-red-700/5 blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#141414_0%,#090909_45%,#050505_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#111111] px-6 py-10 shadow-lg">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>}
        </header>

        <main>{children}</main>
      </div>
    </div>
  )
}

export default AuthLayout
