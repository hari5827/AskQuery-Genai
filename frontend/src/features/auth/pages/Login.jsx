import React, { useRef, useState } from "react";
import { Link ,useNavigate,Navigate,useLocation} from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import LoginTransition from "../components/LoginTransition";
import { useSelector } from 'react-redux'
import { useAuth } from '../hook/useAuth'
import { store } from '../../../app/app.store'
import { useLoadingStages } from '../hook/useLoadingStages'

const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showTransition, setShowTransition] = useState(false)
    const location = useLocation()
    const [infoMessage, setInfoMessage] = useState(location.state?.message || null)
    // handleLogin's own setLoading(false)/setUser() dispatches cause a
    // re-render before this function's next line runs — that re-render
    // would otherwise hit the "already logged in" redirect below before
    // we get a chance to set showTransition. This flag suppresses that
    // redirect once a submit is in flight, so only our own transition
    // controls navigation after a fresh login.
    const justSubmittedRef = useRef(false)
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    const { handleLogin } = useAuth()
    const { message: loadingMessage, progress } = useLoadingStages(loading, {
        baseMessage: "Sign In",
        startMessage: "Signing in...",
    })

    const navigate = useNavigate()

    const submitForm = async (event) => {
        event.preventDefault()

        if (loading) return

        const payload = {
            email,
            password,
        }

        justSubmittedRef.current = true
        await handleLogin(payload)

        // handleLogin catches its own errors, so check the live store
        // state to know whether it actually succeeded before animating.
        if (store.getState().auth.user) {
            setShowTransition(true)
        } else {
            justSubmittedRef.current = false
        }

    }

    if (showTransition) {
        return <LoginTransition onComplete={() => navigate("/")} />
    }

    if(!loading && user && !justSubmittedRef.current){
        return <Navigate to="/" replace />
    }

    return (
        <AuthLayout title="Welcome back" subtitle="Sign in to your account">
            <form onSubmit={submitForm} className="space-y-4">
                {infoMessage && (
                    <div className="flex items-start justify-between gap-2 rounded-xl border border-emerald-700/30 bg-emerald-700/10 px-4 py-3 text-sm text-emerald-300">
                        <span>{infoMessage}</span>
                        <button
                            type="button"
                            onClick={() => setInfoMessage(null)}
                            className="shrink-0 text-emerald-400 hover:text-emerald-200"
                            aria-label="Dismiss"
                        >
                            ✕
                        </button>
                    </div>
                )}
                <label className="block">
                    <span className="text-sm text-zinc-400">Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-red-600"
                        placeholder="Enter your email"
                    />
                </label>

                <label className="block relative">
                    <span className="text-sm text-zinc-400">Password</span>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-14 text-white placeholder-zinc-500 outline-none transition focus:border-red-600"
                        placeholder="********"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-[38px] inline-flex items-center justify-center text-zinc-500 hover:text-white"
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.97 9.97 0 012.121-5.657M3 3l18 18" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </label>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-red-700 to-red-600 px-6 py-3 font-semibold text-white shadow-md transition hover:from-red-600 hover:to-red-500 active:scale-[0.98] disabled:opacity-90 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        {loading && (
                            <span
                                className="absolute inset-y-0 left-0 bg-white/20 transition-[width] duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                                aria-hidden="true"
                            />
                        )}
                        <span className="relative flex items-center gap-2">
                            {loading && (
                                <svg
                                    className="h-5 w-5 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {loadingMessage}
                        </span>
                    </button>
                    {loading && (
                        <p className="mt-2 text-center text-xs text-zinc-500">
                            First request after a while can take up to a minute — server is spinning up.
                        </p>
                    )}
                </div>
                <div className="mt-4 text-center text-sm text-zinc-500">
                    <span>New here? </span>
                    <Link to="/register" className="font-medium text-red-400 hover:text-red-300">
                        Create an account
                    </Link>
                </div>
                
            </form>
        </AuthLayout>
    );
};

export default Login;