import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function SignUpScreen() {
  const navigate = useNavigate()
  const { login, intendedDestination, setIntendedDestination } = useApp()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  function navigateTo(path) {
    setExiting(true)
    setTimeout(() => navigate(path), 300)
  }

  function navigateWithFade(path) {
    setVisible(false)
    setTimeout(() => navigate(path), 220)
  }

  function handleSignUp(e) {
    e.preventDefault()
    navigateWithFade('/login')
  }

  return (
    <div className="bg-[#0a0a0a] h-screen overflow-hidden">
      <div
        className="text-[#f5f5f5] font-display h-full flex flex-col antialiased"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 220ms ease-in-out',
        }}
      >
      <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden">

        {/* Left decorative panel — desktop only */}
        <div className="relative hidden lg:flex w-full lg:w-[45%] xl:w-[40%] flex-col justify-between p-8 xl:p-12 overflow-hidden bg-[#1a1a1a] border-r border-[#2a2a2a]">
          <div className="absolute inset-0 z-0">
            <img
              alt="Majestic snowy mountain peaks at twilight"
              className="h-full w-full object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOIDLLXYr9-5uZ8dlKloDPbJlDU8EYgN1fZXVdlLap0SuP_hnELA1Iv1JrbAx93-tOQIqmnAm0YxSki2bxTsx2-ClcDp-CJ_ytEvtsnDsWQOhKwiggJIQLp6d8X1pg2kM1__AVrJp2aqF4nSOZTXD1ioYRikwk04q_zjkGebFZPG1BwGg8Cl8_jKZsiURPxK5uCWFAKJdD_H6oEQSGqmY7PEGdkfhk_8fIQBQeio4Xn8FsF0pLVI-ysXPSbJA3eX_gFq0TSvjtdu0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>

          {/* Panel header — logo */}
          <div className="relative z-10 text-left">
            <div className="absolute -inset-6 bg-[#22c55e]/10 rounded-full blur-2xl opacity-30 pointer-events-none" />
            <h1
              className="font-cursive text-3xl text-[#22c55e] tracking-wide relative z-10 drop-shadow-sm cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={() => navigateWithFade('/home')}
            >
              BillCraft
            </h1>
          </div>

          {/* Panel quote */}
          <div className="relative z-10 mt-auto max-w-md">
            <div className="mb-6">
              <span className="material-symbols-outlined text-[#22c55e] text-4xl">format_quote</span>
            </div>
            <blockquote className="text-2xl font-medium text-white leading-relaxed mb-4">
              "Freelancing, simplified. Manage your contracts and invoices with absolute confidence."
            </blockquote>
            <div className="flex items-center gap-4 text-neutral-300 text-sm font-medium">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-gray-500"></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-gray-400"></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-gray-300"></div>
              </div>
              <div className="h-4 w-px bg-white/20"></div>
              <span>Trusted by 10,000+ freelancers</span>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div
          className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8 lg:p-12 bg-[#0a0a0a] relative"
          style={{
            opacity: exiting ? 0 : 1,
            transform: exiting ? 'translateX(20px)' : 'translateX(0)',
            transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out',
          }}
        >

          {/* Mobile logo — hidden on desktop */}
          <div className="lg:hidden w-full flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#22c55e] text-3xl">receipt_long</span>
              <span className="text-2xl font-bold text-[#f5f5f5]">BillCraft</span>
            </div>
          </div>

          {/* Card */}
          <div className="w-full max-w-[440px] flex flex-col gap-6 p-8">

            {/* Heading */}
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">Create Account</h1>
              <p className="text-base font-medium text-[#a3a3a3]">
                Enter your details to get started.
              </p>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSignUp}>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#f5f5f5]" htmlFor="fullName">Full Name</label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-[#f5f5f5] placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 focus:border-[#22c55e] transition-all duration-200"
                    id="fullName"
                    placeholder="John Doe"
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#a3a3a3]">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#f5f5f5]" htmlFor="email">Email Address</label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-[#f5f5f5] placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 focus:border-[#22c55e] transition-all duration-200"
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#a3a3a3]">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#f5f5f5]" htmlFor="password">Password</label>
                <div className="relative group">
                  <input
                    className="w-full h-12 px-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-[#f5f5f5] placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 focus:border-[#22c55e] transition-all duration-200"
                    id="password"
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[#a3a3a3] hover:text-[#f5f5f5]"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#f5f5f5]" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative group">
                  <input
                    className="w-full h-12 px-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-[#f5f5f5] placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 focus:border-[#22c55e] transition-all duration-200"
                    id="confirmPassword"
                    placeholder="Re-enter your password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[#a3a3a3] hover:text-[#f5f5f5]"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="flex items-center justify-center w-full h-12 mt-2 rounded-lg bg-[#22c55e] text-white font-bold text-base hover:bg-[#22c55e]/90 focus:ring-4 focus:ring-[#22c55e]/30 transition-all duration-200 shadow-lg shadow-[#22c55e]/20"
              >
                Sign Up
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#2a2a2a]"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider">
                Or continue with
              </span>
              <div className="flex-grow border-t border-[#2a2a2a]"></div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-3 h-12 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-sm font-semibold text-[#f5f5f5]">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-3 h-12 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5 fill-white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span className="text-sm font-semibold text-[#f5f5f5]">GitHub</span>
              </button>
            </div>

            {/* Log in link */}
            <p className="text-center text-sm font-medium text-[#a3a3a3]">
              Already have an account?
              <button
                type="button"
                onClick={() => navigateWithFade('/login')}
                className="text-[#22c55e] hover:text-[#22c55e]/80 font-bold ml-1 transition-colors"
              >
                Log In
              </button>
            </p>
          </div>


        </div>

      </div>
      </div>
    </div>
  )
}
