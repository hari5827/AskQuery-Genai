import React, { useState } from "react";
import { Link ,useNavigate,Navigate} from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useSelector } from 'react-redux'
import { useAuth } from '../hook/useAuth'

const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    const { handleLogin } = useAuth()

    const navigate = useNavigate()

    const submitForm = async (event) => {
        event.preventDefault()

        const payload = {
            email,
            password,
        }

        await handleLogin(payload)
        navigate("/")

    }

    if(!loading && user){
        return <Navigate to="/" replace />
    }

    return (
        <AuthLayout title="Welcome back" subtitle="Sign in to your account">
            <form onSubmit={submitForm} className="space-y-4">
                <label className="block">
                    <span className="text-sm text-gray-300">Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        placeholder="Enter your email"
                    />
                </label>

                <label className="block relative">
                    <span className="text-sm text-gray-300">Password</span>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full pr-14 px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        placeholder="********"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-[38px] inline-flex items-center justify-center text-gray-300 hover:text-gray-100"
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
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold shadow-md hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    >
                        Sign In
                    </button>
                </div>
                <div className="mt-4 text-center text-sm text-gray-400">
                    <span>New here? </span>
                    <Link to="/register" className="text-purple-300 hover:text-purple-100 font-medium">
                        Create an account
                    </Link>
                </div>
                
            </form>
        </AuthLayout>
    );
};

export default Login;