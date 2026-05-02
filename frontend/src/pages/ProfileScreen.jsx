import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'

export default function ProfileScreen() {
  const { user, sidebarCollapsed } = useApp()

  const defaultName  = user?.name  ?? ''
  const defaultEmail = user?.email ?? ''

  // Derive initials from name
  const initials = defaultName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  // Profile form state
  const [fullName,     setFullName]     = useState(defaultName)
  const [email,        setEmail]        = useState(defaultEmail)
  const [phone,        setPhone]        = useState('')
  const [businessName, setBusinessName] = useState('')

  // Password form state
  const [currentPassword,  setCurrentPassword]  = useState('')
  const [newPassword,      setNewPassword]      = useState('')
  const [confirmPassword,  setConfirmPassword]  = useState('')
  const [showCurrent,      setShowCurrent]      = useState(false)
  const [showNew,          setShowNew]          = useState(false)
  const [showConfirm,      setShowConfirm]      = useState(false)
  const [profileErrors,    setProfileErrors]    = useState({})
  const [pwdErrors,        setPwdErrors]        = useState({})

  function errInput(err) {
    return err
      ? 'w-full h-10 px-3 bg-[#0a0a0a] border border-[#ef4444] rounded-lg text-[#f5f5f5] text-sm placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#ef4444]/30 focus:border-[#ef4444] transition-all duration-200'
      : inputClass
  }

  function handleSaveProfile(e) {
    e.preventDefault()
    const errs = {}
    if (!fullName.trim()) errs.fullName = 'Full name is required.'
    if (!email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email.'
    if (Object.keys(errs).length) { setProfileErrors(errs); return }
    setProfileErrors({})
    // save logic here
  }

  function handleChangePassword(e) {
    e.preventDefault()
    const errs = {}
    if (!currentPassword) errs.currentPassword = 'Current password is required.'
    if (!newPassword) errs.newPassword = 'New password is required.'
    else if (newPassword.length < 8) errs.newPassword = 'Must be at least 8 characters.'
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your new password.'
    else if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match.'
    if (Object.keys(errs).length) { setPwdErrors(errs); return }
    setPwdErrors({})
    // password update logic here
  }

  const inputClass =
    'w-full h-10 px-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-[#f5f5f5] text-sm placeholder-[#a3a3a3]/50 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/40 focus:border-[#22c55e] transition-all duration-200'

  const labelClass = 'text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider'

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f5] h-screen overflow-hidden flex font-display antialiased">

      <Sidebar active="profile" />

      <main className="flex-1 h-screen overflow-hidden bg-[#0a0a0a] flex flex-col px-8 pt-0 pb-6 gap-4" style={{ marginLeft: sidebarCollapsed ? '60px' : '260px', transition: 'margin-left 300ms ease-in-out' }}>

        {/* ── Page header ── */}
        <div className="shrink-0 pt-8 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5]">Profile</h2>
            <p className="text-slate-400">Manage your personal details and account settings.</p>
          </div>
        </div>

        {/* ── Avatar + info row ── */}
        <div className="shrink-0 flex items-center gap-5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-6 py-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#22c55e]/20 border-2 border-[#22c55e]/40 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-[#22c55e] select-none">{initials || '?'}</span>
          </div>
          {/* Name + email */}
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-[#f5f5f5]">{defaultName || 'No Name'}</span>
            <span className="text-sm text-slate-400">{defaultEmail || 'No email'}</span>
          </div>
          {/* Accent badge */}
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
            <span className="text-xs font-semibold text-[#22c55e]">Active Account</span>
          </div>
        </div>

        {/* ── Two-column card row ── */}
        <div className="shrink-0 grid grid-cols-2 gap-4 items-start">

          {/* ── Left: Profile Details ── */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#22c55e] text-lg">manage_accounts</span>
              <h3 className="text-base font-bold text-[#f5f5f5]">Profile Details</h3>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass} htmlFor="fullName">Full Name</label>
                  <input
                    className={errInput(profileErrors.fullName)}
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={e => { setFullName(e.target.value); setProfileErrors(p => ({ ...p, fullName: undefined })) }}
                  />
                  {profileErrors.fullName && <p className="text-xs text-[#ef4444]">{profileErrors.fullName}</p>}
                </div>
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass} htmlFor="profEmail">Email Address</label>
                  <input
                    className={errInput(profileErrors.email)}
                    id="profEmail"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setProfileErrors(p => ({ ...p, email: undefined })) }}
                  />
                  {profileErrors.email && <p className="text-xs text-[#ef4444]">{profileErrors.email}</p>}
                </div>
                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass} htmlFor="phone">Phone Number</label>
                  <input
                    className={inputClass}
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                {/* Business Name */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass} htmlFor="business">Business Name</label>
                  <input
                    className={inputClass}
                    id="business"
                    type="text"
                    placeholder="Acme Studio"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="h-10 px-6 rounded-lg bg-[#22c55e] text-white font-bold text-sm hover:bg-[#22c55e]/90 focus:ring-4 focus:ring-[#22c55e]/30 transition-all duration-200 shadow-lg shadow-[#22c55e]/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* ── Right column: Change Password only ── */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#22c55e] text-lg">lock</span>
                <h3 className="text-base font-bold text-[#f5f5f5]">Change Password</h3>
              </div>
              <button
                type="submit"
                form="change-password-form"
                className="h-9 px-4 rounded-lg bg-[#22c55e] text-white font-bold text-sm hover:bg-[#22c55e]/90 focus:ring-4 focus:ring-[#22c55e]/30 transition-all duration-200 shadow-lg shadow-[#22c55e]/20"
              >
                Update Password
              </button>
            </div>

            <form id="change-password-form" className="flex flex-col gap-3" onSubmit={handleChangePassword}>
              {/* Current Password */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="currentPwd">Current Password</label>
                <div className="relative">
                  <input
                    className={errInput(pwdErrors.currentPassword)}
                    id="currentPwd"
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={e => { setCurrentPassword(e.target.value); setPwdErrors(p => ({ ...p, currentPassword: undefined })) }}
                  />
                  <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#a3a3a3] hover:text-[#f5f5f5]">
                    <span className="material-symbols-outlined text-[18px]">{showCurrent ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
                {pwdErrors.currentPassword && <p className="text-xs text-[#ef4444]">{pwdErrors.currentPassword}</p>}
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="newPwd">New Password</label>
                <div className="relative">
                  <input
                    className={errInput(pwdErrors.newPassword)}
                    id="newPwd"
                    type={showNew ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setPwdErrors(p => ({ ...p, newPassword: undefined })) }}
                  />
                  <button type="button" onClick={() => setShowNew(v => !v)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#a3a3a3] hover:text-[#f5f5f5]">
                    <span className="material-symbols-outlined text-[18px]">{showNew ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
                {pwdErrors.newPassword && <p className="text-xs text-[#ef4444]">{pwdErrors.newPassword}</p>}
              </div>

              {/* Confirm New Password */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="confirmPwd">Confirm New Password</label>
                <div className="relative">
                  <input
                    className={errInput(pwdErrors.confirmPassword)}
                    id="confirmPwd"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setPwdErrors(p => ({ ...p, confirmPassword: undefined })) }}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#a3a3a3] hover:text-[#f5f5f5]">
                    <span className="material-symbols-outlined text-[18px]">{showConfirm ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
                {pwdErrors.confirmPassword && <p className="text-xs text-[#ef4444]">{pwdErrors.confirmPassword}</p>}
              </div>
            </form>
          </div>

          {/* ── Danger Zone — spans both columns ── */}
          <div className="col-span-2 bg-[#1a1a1a] border border-[#ef4444]/30 rounded-xl px-6 py-3 flex items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ef4444] text-lg">warning</span>
                <h3 className="text-base font-bold text-[#ef4444]">Danger Zone</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <div className="shrink-0">
              <button
                type="button"
                className="h-10 px-6 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/40 text-[#ef4444] font-bold text-sm hover:bg-[#ef4444] hover:text-white transition-all duration-200"
                onClick={() => {}}
              >
                Delete Account
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  )
}
