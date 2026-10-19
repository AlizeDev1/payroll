import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building2,
  User,
  Eye,
  EyeOff,
  Briefcase,
  Sparkles,
  KeyRound,
  AlertCircle,
  HelpCircle,
  Star,
  Zap,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { usePageSeo } from '../hooks/usePageSeo';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, register, loginAsDemoRole } = useAuth();
  const { success, error, info } = useToast();

  usePageSeo({
    title: 'Enterprise Authentication & Access Console | Alize Payroll',
    description: 'Secure corporate login and workspace registration for Alize Payroll & Workforce Platform. Access salary registers, tax compliance, and HR records.',
    canonicalPath: '/login',
  });

  // Active Tab: 'signin' | 'signup'
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin';
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);

  // Sync tab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'signup' && activeTab !== 'signup') {
      setActiveTab('signup');
    } else if (tabParam === 'signin' && activeTab !== 'signin') {
      setActiveTab('signin');
    }
  }, [searchParams]);

  const switchTab = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('jayanthr239@gmail.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpCompany, setSignUpCompany] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpRole, setSignUpRole] = useState<UserRole>('Company Admin');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Handle Sign In Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      error('Please enter your corporate email address');
      return;
    }
    setIsLoading(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        success('Welcome back to Alize Payroll', `Signed in as ${loginEmail}`);
        navigate('/dashboard');
      } else {
        error(res.message || 'Invalid email or password');
      }
    } catch (err: any) {
      error(err.message || 'Login failed. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up Submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName.trim()) {
      error('Please enter your full name');
      return;
    }
    if (!signUpEmail.trim()) {
      error('Please enter a valid work email');
      return;
    }
    if (signUpPassword.length < 6) {
      error('Password must be at least 6 characters long');
      return;
    }
    if (!agreeTerms) {
      error('Please accept the Terms of Service & Privacy Policy');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        role: signUpRole,
        companyName: signUpCompany || 'Alize Enterprise Client',
      });

      if (res.success) {
        success('Account Created Successfully!', `Welcome aboard, ${signUpName}. Your role is ${signUpRole}.`);
        navigate('/dashboard');
      } else {
        error(res.message || 'Registration failed');
      }
    } catch (err: any) {
      error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Quick Demo Switcher
  const handleQuickDemoRole = (role: UserRole) => {
    loginAsDemoRole(role);
    success('Demo Access Granted', `Session active as ${role}`);
    navigate('/dashboard');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      error('Please enter your registered email');
      return;
    }
    setForgotSent(true);
    info('Password Reset Link Sent', `If ${forgotEmail} is registered, a password reset link has been dispatched.`);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-[#2563EB] selection:text-white">
      {/* ========================================================
          LEFT COLUMN: VIBRANT ROYAL BLUE ENTERPRISE HERO PILLAR
          ======================================================== */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white p-12 flex-col justify-between relative overflow-hidden shadow-2xl">
        {/* Subtle Ambient Background Elements */}
        <div className="w-96 h-96 rounded-full bg-white/10 blur-3xl absolute -top-20 -left-20 pointer-events-none" />
        <div className="w-96 h-96 rounded-full bg-blue-400/20 blur-3xl absolute -bottom-20 -right-20 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.07] bg-cover bg-center pointer-events-none -z-0"
          style={{ backgroundImage: "url('/images/hero_mesh.jpg')" }}
        />

        {/* Top Brand & Back to Home */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1D4ED8] flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="text-base font-black tracking-tight uppercase block text-white font-heading leading-tight">
                ALIZE PAYROLL
              </span>
              <span className="text-[10px] text-blue-200 font-semibold tracking-wider uppercase">
                Workforce &amp; Statutory OS
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all backdrop-blur-xs font-heading uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Mid Value Proposition & Testimonial Card */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/25 text-[11px] font-black uppercase tracking-wider text-white font-heading backdrop-blur-xs">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>FY 2026-27 Compliant Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.02] text-white font-heading uppercase">
            THE SMARTEST WAY <br />
            TO PAY &amp; MANAGE <br />
            <span className="text-yellow-300">INDIAN TEAMS.</span>
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
            Automate monthly salary disbursements, biometric muster synchronization, EPFO ECR 2.0 returns, ESIC, and Form 16 DSC signatures with banking-grade precision.
          </p>

          {/* Social Proof Floating Card */}
          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/images/hr_manager_smile.jpg"
                  alt="HR Leader"
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="text-xs font-black uppercase text-white font-heading">
                    Priya Sundaram
                  </h4>
                  <p className="text-[10px] text-blue-200 font-medium">
                    Head of People Ops, RazorWave Tech
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-yellow-300">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-yellow-300" />
                ))}
              </div>
            </div>
            <p className="text-xs text-white/90 italic font-medium leading-relaxed">
              "We disburse 124+ employee salaries in under 3.4 seconds without a single calculation error. Alize eliminated 4 stressful days of spreadsheet work every month."
            </p>
          </div>

          {/* 4 Compliance Value Checkmarks */}
          <div className="space-y-2.5 pt-1">
            {[
              '100% Automated EPFO ECR 2.0 & ESIC Monthly Remittances',
              'Instant Bank NEFT / RTGS Payout Batches (HDFC, ICICI, SBI)',
              'Form 16 Part A & B with Digital DSC Signature',
              'Biometric Attendance Muster & Geofence Leave Sync',
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-blue-100 font-semibold">
                <div className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="relative z-10 text-[11px] text-blue-200 pt-6 border-t border-white/20 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ISO 27001 Certified · 256-Bit SSL Encrypted · SOC2 Type II</span>
          </div>
          <span>&copy; {new Date().getFullYear()} Alize Software Services</span>
        </div>
      </div>

      {/* ========================================================
          RIGHT COLUMN: MODERN HIGH-CONVERTING AUTH CONSOLE
          ======================================================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Top Brand Bar */}
          <div className="lg:hidden flex items-center justify-between pb-3 border-b border-slate-200">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-black text-sm shadow-xs">
                A
              </div>
              <span className="font-black text-sm uppercase font-heading text-slate-900">
                ALIZE PAYROLL
              </span>
            </Link>
            <Link to="/" className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 font-heading uppercase">
              <ArrowLeft className="w-3 h-3" />
              <span>Back</span>
            </Link>
          </div>

          {/* Header Title */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#2563EB] font-heading block mb-1">
              {activeTab === 'signin' ? 'Corporate Sign In' : 'New Enterprise Workspace'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-heading uppercase">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Workspace'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {activeTab === 'signin'
                ? 'Enter your corporate credentials to access salary runs & tax registers.'
                : 'Get started with a free workspace or join an existing organization.'}
            </p>
          </div>

          {/* Primary Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-2xl text-xs font-bold font-heading uppercase tracking-wider">
            <button
              type="button"
              onClick={() => switchTab('signin')}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-white text-slate-900 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className={`w-3.5 h-3.5 ${activeTab === 'signin' ? 'text-[#2563EB]' : 'text-slate-400'}`} />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchTab('signup')}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'signup' ? 'text-[#2563EB]' : 'text-slate-400'}`} />
              Create Account
            </button>
          </div>

          {/* ========================================================
              TAB 1: SIGN IN FORM
              ======================================================== */}
          {activeTab === 'signin' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5 font-heading">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@alizesoftware.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-3 h-[44px] text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] shadow-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black uppercase text-slate-700 font-heading">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-bold text-[#2563EB] hover:underline font-heading"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 h-[44px] text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] font-mono shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[46px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-sm uppercase tracking-wider font-heading shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In to Alize Console'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ========================================================
              TAB 2: SIGN UP / REGISTRATION FORM
              ======================================================== */}
          {activeTab === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Sharma"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full pl-10 pr-3 h-[42px] text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">
                  Corporate / Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full pl-10 pr-3 h-[42px] text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Acme Tech Labs"
                      value={signUpCompany}
                      onChange={(e) => setSignUpCompany(e.target.value)}
                      className="w-full pl-10 pr-3 h-[42px] text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">
                    Select Your Role
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      value={signUpRole}
                      onChange={(e) => setSignUpRole(e.target.value as UserRole)}
                      className="w-full pl-10 pr-3 h-[42px] text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] shadow-xs cursor-pointer"
                    >
                      <option value="Company Admin">Company Admin (Full Access)</option>
                      <option value="HR Manager">HR Manager</option>
                      <option value="Payroll Manager">Payroll Specialist</option>
                      <option value="Accountant">Finance Accountant</option>
                      <option value="Employee">Employee (Self-Service)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full pl-10 pr-10 h-[42px] text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] font-mono shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {signUpPassword && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          signUpPassword.length < 6
                            ? 'w-1/3 bg-amber-500'
                            : signUpPassword.length < 10
                            ? 'w-2/3 bg-blue-500'
                            : 'w-full bg-emerald-500'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 font-heading uppercase">
                      {signUpPassword.length < 6 ? 'Too short' : signUpPassword.length < 10 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer pt-1 select-none font-medium">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-[#2563EB] focus:ring-[#2563EB] mt-0.5"
                />
                <span>
                  I agree to the Enterprise Master Service Agreement and Data Processing Addendum.
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[46px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-sm uppercase tracking-wider font-heading shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account & Launch Console'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ========================================================
              1-CLICK EVALUATOR ROLE SWITCHER (SANDBOX ACCESS)
              ======================================================== */}
          <div className="pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider font-heading flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                1-Click Demo Sandbox Testing
              </p>
              <span className="text-[10px] text-slate-400 font-medium">Instant evaluator access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoRole('Company Admin')}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#2563EB] text-left hover:bg-blue-50/50 transition-all text-xs bg-white shadow-xs group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 group-hover:text-[#2563EB] font-heading">Company Admin</p>
                  <span className="text-[9px] bg-blue-100 text-[#2563EB] px-1.5 py-0.5 rounded-md font-black">ALL</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Full system access (Jayanth R)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('HR Manager')}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#2563EB] text-left hover:bg-blue-50/50 transition-all text-xs bg-white shadow-xs group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 group-hover:text-[#2563EB] font-heading">HR Manager</p>
                  <span className="text-[9px] bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded-md font-black">HR</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Workforce &amp; leaves (Sneha Reddy)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('Payroll Manager')}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#2563EB] text-left hover:bg-blue-50/50 transition-all text-xs bg-white shadow-xs group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 group-hover:text-[#2563EB] font-heading">Payroll Specialist</p>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-black">PAY</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Salary &amp; payouts (Vikram M.)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('Accountant')}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#2563EB] text-left hover:bg-blue-50/50 transition-all text-xs bg-white shadow-xs group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 group-hover:text-[#2563EB] font-heading">Accountant</p>
                  <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-black">TAX</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Tax &amp; claims (Rajesh Kulkarni)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('Employee')}
                className="sm:col-span-2 p-3 rounded-xl border border-slate-200 hover:border-[#2563EB] text-left hover:bg-blue-50/50 transition-all text-xs bg-white shadow-xs group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 group-hover:text-[#2563EB] font-heading">Employee Self-Service (ESS)</p>
                    <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md font-black">STAFF</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Staff view: payslips, leaves &amp; tax declarations (Aarav Iyer)</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FORGOT PASSWORD MODAL
          ======================================================== */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 font-heading uppercase">
                Reset your account password
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Enter your registered corporate email and we will send you a secure verification link.
              </p>
            </div>

            {forgotSent ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">Verification instructions dispatched to your mailbox!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1 font-heading">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@alizesoftware.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 h-[40px] text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowForgotModal(false)}
                  >
                    Cancel
                  </Button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs font-heading uppercase transition-all shadow-sm"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
