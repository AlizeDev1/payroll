import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { usePageSeo } from '../hooks/usePageSeo';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemoRole } = useAuth();
  const { success, error } = useToast();

  usePageSeo({
    title: 'Sign In to Corporate Console | Alize Payroll',
    description: 'Secure corporate login for Alize Payroll & Workforce Management Console. Access salary registers, tax compliance, and HR records.',
    canonicalPath: '/login',
  });

  const [email, setEmail] = useState('jayanthr239@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Please enter your corporate email address');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      success('Welcome back to Alize Payroll', `Signed in as ${email}`);
      navigate('/dashboard');
    } catch {
      error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoRole = (role: UserRole) => {
    loginAsDemoRole(role);
    success('Demo Access Granted', `Switched session to ${role}`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-[#6D28D9] selection:text-white">
      {/* Left Column: Clean Light Enterprise Brand Presentation */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#FAF5FF] via-[#F8FAFC] to-white text-slate-800 p-12 flex-col justify-between relative border-r border-slate-200">
        {/* Top Brand */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6D28D9] text-white flex items-center justify-center font-bold text-sm shadow-[0_1px_2px_rgba(109,40,217,0.3)]">
              A
            </div>
            <div>
              <span className="text-[13px] font-extrabold tracking-tight uppercase block text-slate-900 font-heading leading-tight">
                ALIZE PAYROLL
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Alize Software Services LLP
              </span>
            </div>
          </Link>
        </div>

        {/* Mid Value Proposition */}
        <div className="relative z-10 max-w-lg space-y-5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-purple-200 bg-[#F5F3FF] text-[11px] font-semibold text-[#6D28D9]">
            <span>Enterprise Indian Payroll Infrastructure</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-slate-900 font-heading uppercase">
            Smart Payroll. <br />
            <span className="text-[#6D28D9]">Compliant Workforce.</span>
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            Automate monthly salary disbursements, manage biometric attendance, compute EPFO and ESIC remittances, and generate official payslips with enterprise financial precision.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
              <span>Full compliance with PF ECR, ESI, Professional Tax & TDS 192</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
              <span>7-step automated payroll run with direct bank file generation</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
              <span>Self-service portal for staff payslips, leaves & tax regimes</span>
            </div>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="relative z-10 text-[11px] text-slate-500 pt-8 border-t border-slate-200 flex items-center justify-between">
          <span>Enterprise SaaS Security · ISO 27001 Ready</span>
          <span>© {new Date().getFullYear()} Alize Software Services LLP</span>
        </div>
      </div>

      {/* Right Column: Clean Form & 1-Click Role Switcher */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-7">
          <div>
            <div className="lg:hidden flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#6D28D9] text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <span className="font-extrabold text-sm uppercase font-heading">ALIZE PAYROLL</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
              Sign in to your workplace
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your corporate email credentials to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@alizesoftware.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 h-[42px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-[#6D28D9] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 h-[42px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#6D28D9] focus:ring-[#6D28D9]"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full h-[42px]"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Alize Payroll
            </Button>
          </form>

          {/* Quick Demo Login Switcher */}
          <div className="pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                1-Click Demo Login
              </p>
              <span className="text-[10px] text-slate-400">Select role to test</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoRole('Company Admin')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-[#6D28D9] text-left hover:bg-[#F3E8FF]/30 transition-all text-xs bg-white shadow-xs"
              >
                <p className="font-semibold text-slate-900">Company Admin</p>
                <p className="text-[10px] text-slate-500">Full system access (Jayanth R)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('HR Manager')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-[#6D28D9] text-left hover:bg-[#F3E8FF]/30 transition-all text-xs bg-white shadow-xs"
              >
                <p className="font-semibold text-slate-900">HR Manager</p>
                <p className="text-[10px] text-slate-500">Workforce & leaves (Sneha Reddy)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('Payroll Manager')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-[#6D28D9] text-left hover:bg-[#F3E8FF]/30 transition-all text-xs bg-white shadow-xs"
              >
                <p className="font-semibold text-slate-900">Payroll Manager</p>
                <p className="text-[10px] text-slate-500">Salary & payouts (Vikram M.)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('Accountant')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-[#6D28D9] text-left hover:bg-[#F3E8FF]/30 transition-all text-xs bg-white shadow-xs"
              >
                <p className="font-semibold text-slate-900">Accountant</p>
                <p className="text-[10px] text-slate-500">Tax & claims (Rajesh Kulkarni)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('Employee')}
                className="sm:col-span-2 p-2.5 rounded-lg border border-slate-200 hover:border-[#6D28D9] text-left hover:bg-[#F3E8FF]/30 transition-all text-xs bg-white shadow-xs"
              >
                <p className="font-semibold text-slate-900">Employee Self-Service</p>
                <p className="text-[10px] text-slate-500">Staff view: payslips & attendance (Aarav Iyer)</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
