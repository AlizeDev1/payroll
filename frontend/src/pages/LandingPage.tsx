import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Receipt,
  CalendarCheck,
  BarChart3,
  FileSpreadsheet,
  Building,
  Lock,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Calculator,
  Sliders,
  Clock,
  Sparkles,
  TrendingUp,
  Smartphone,
  Download,
  RefreshCw,
  FileText,
  Check,
  Users,
  Award,
  Play,
  RotateCcw,
  Printer,
  X,
  AlertTriangle,
  BadgeCheck,
  Eye,
  CheckSquare,
  Square,
  CreditCard,
  Send,
  Cpu,
  Layers,
  ThumbsUp,
  Database,
  Briefcase,
  GitBranch,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { COMPANY_INFO } from '../data/mockData';
import { usePageSeo } from '../hooks/usePageSeo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  usePageSeo({
    title: 'Enterprise Indian Payroll & Statutory Compliance Platform | Alize',
    description: 'Automated gross-to-net payroll, EPFO ECR 2.0 returns, ESIC, Form 16 DSC signing, biometric muster, and direct bank NEFT batches by Alize Software Services LLP.',
    canonicalPath: '/',
  });

  // --- Dynamic Scrollspy Active Section State ---
  const [activeSection, setActiveSection] = useState<string>('features');

  useEffect(() => {
    const sectionIds = ['features', 'salary-engine', 'simulator', 'compliance', 'architecture', 'pricing'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Dynamic State: Interactive CTC & In-Hand Calculator ---
  const [annualCtc, setAnnualCtc] = useState<number>(1200000); // 12 LPA default
  const [taxRegime, setTaxRegime] = useState<'new' | 'old'>('new');
  const [statePt, setStatePt] = useState<'Karnataka' | 'Maharashtra' | 'Tamil Nadu' | 'Delhi'>('Karnataka');

  // --- Dynamic State: Live 7-Step Payroll Pipeline Simulation ---
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0); // 0 = idle, 1..7 = running
  const [simCompleted, setSimCompleted] = useState(false);

  // --- Dynamic State: Interactive Statutory Compliance Audit Checklist ---
  const [auditChecklist, setAuditChecklist] = useState({
    epfo: true,
    esic: true,
    pt: true,
    tds192: true,
  });

  // --- Dynamic State: Interactive Sample Payslip Modal ---
  const [showSamplePayslip, setShowSamplePayslip] = useState(false);

  // --- Dynamic Math: Live Salary Calculations ---
  const salaryBreakdown = useMemo(() => {
    const monthlyGross = Math.round(annualCtc / 12);
    // 50% Basic, 25% HRA, 25% Special Allowance
    const basic = Math.round(monthlyGross * 0.5);
    const hra = Math.round(monthlyGross * 0.25);
    const specialAllowance = monthlyGross - basic - hra;

    // EPF: 12% of Basic, capped at statutory ₹1,800 or 12%
    const epf = Math.min(1800, Math.round(basic * 0.12));

    // Professional Tax based on state
    let pt = 0;
    if (statePt === 'Karnataka') pt = monthlyGross > 15000 ? 200 : 0;
    else if (statePt === 'Maharashtra') pt = monthlyGross > 10000 ? 200 : 0;
    else if (statePt === 'Tamil Nadu') pt = monthlyGross > 15000 ? 208 : 0;
    else if (statePt === 'Delhi') pt = 0;

    // Approximate Monthly TDS under New vs Old Regime
    let annualTax = 0;
    if (taxRegime === 'new') {
      const taxableIncome = Math.max(0, annualCtc - 75000);
      if (taxableIncome <= 700000) {
        annualTax = 0;
      } else {
        if (taxableIncome > 1500000) {
          annualTax = 150000 + (taxableIncome - 1500000) * 0.3;
        } else if (taxableIncome > 1200000) {
          annualTax = 90000 + (taxableIncome - 1200000) * 0.2;
        } else if (taxableIncome > 1000000) {
          annualTax = 60000 + (taxableIncome - 1000000) * 0.15;
        } else if (taxableIncome > 700000) {
          annualTax = 20000 + (taxableIncome - 700000) * 0.1;
        }
        annualTax = Math.round(annualTax * 1.04);
      }
    } else {
      const taxableIncome = Math.max(0, annualCtc - 200000);
      if (taxableIncome <= 500000) {
        annualTax = 0;
      } else if (taxableIncome <= 1000000) {
        annualTax = 12500 + (taxableIncome - 500000) * 0.2;
      } else {
        annualTax = 112500 + (taxableIncome - 1000000) * 0.3;
      }
      annualTax = Math.round(annualTax * 1.04);
    }
    const monthlyTds = Math.round(annualTax / 12);
    const totalDeductions = epf + pt + monthlyTds;
    const takeHome = monthlyGross - totalDeductions;

    return {
      monthlyGross,
      basic,
      hra,
      specialAllowance,
      epf,
      pt,
      monthlyTds,
      annualTax,
      totalDeductions,
      takeHome,
    };
  }, [annualCtc, taxRegime, statePt]);

  // --- Dynamic Simulation Handlers ---
  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);
    setSimCompleted(false);

    let step = 1;
    const timer = setInterval(() => {
      step += 1;
      if (step <= 7) {
        setSimStep(step);
      } else {
        clearInterval(timer);
        setSimStep(7);
        setSimCompleted(true);
        setIsSimulating(false);
      }
    }, 550);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimStep(0);
    setSimCompleted(false);
  };

  const toggleAuditItem = (key: keyof typeof auditChecklist) => {
    setAuditChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const complianceScore = useMemo(() => {
    const total = Object.values(auditChecklist).length;
    const active = Object.values(auditChecklist).filter(Boolean).length;
    return Math.round((active / total) * 100);
  }, [auditChecklist]);

  const formatINR = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#2563EB] selection:text-white relative overflow-x-clip">

      {/* ========================================================
          STICKY TOP NAVBAR WITH REAL-TIME SCROLLSPY
          ======================================================== */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_2px_15px_rgba(15,23,42,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
          {/* Logo & Brand Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-xl shadow-[0_4px_14px_rgba(37,99,235,0.35)] group-hover:scale-105 transition-transform">
              A
            </div>
            <div className="flex items-center">
              <span className="text-[15px] sm:text-base font-black tracking-tight text-slate-900 uppercase font-heading leading-tight flex items-center gap-1.5">
                ALIZE PAYROLL
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-100 text-[#2563EB] font-black">PRO</span>
              </span>
            </div>
          </Link>

          {/* Navigation Links with Active Scrollspy Highlighting */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider font-heading">
            <a
              href="#features"
              className={`transition-all duration-200 py-1 border-b-2 ${
                activeSection === 'features'
                  ? 'text-[#2563EB] font-black border-[#2563EB]'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Capabilities
            </a>
            <a
              href="#salary-engine"
              className={`transition-all duration-200 py-1 border-b-2 flex items-center gap-1.5 ${
                activeSection === 'salary-engine'
                  ? 'text-[#2563EB] font-black border-[#2563EB]'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Salary Engine
            </a>
            <a
              href="#simulator"
              className={`transition-all duration-200 py-1 border-b-2 ${
                activeSection === 'simulator'
                  ? 'text-[#2563EB] font-black border-[#2563EB]'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Live Simulator
            </a>
            <a
              href="#compliance"
              className={`transition-all duration-200 py-1 border-b-2 ${
                activeSection === 'compliance'
                  ? 'text-[#2563EB] font-black border-[#2563EB]'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Statutory Matrix
            </a>
            <a
              href="#architecture"
              className={`transition-all duration-200 py-1 border-b-2 ${
                activeSection === 'architecture'
                  ? 'text-[#2563EB] font-black border-[#2563EB]'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Banking &amp; ERP
            </a>
            <a
              href="#pricing"
              className={`transition-all duration-200 py-1 border-b-2 ${
                activeSection === 'pricing'
                  ? 'text-[#2563EB] font-black border-[#2563EB]'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Pricing
            </a>
          </nav>

          {/* Right Action Pill Group */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/dashboard')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black rounded-full px-5 py-2 shadow-md"
              >
                Launch Console
              </Button>
            ) : (
              <>
                <Link
                  to="/login?tab=signin"
                  className="text-xs font-bold text-slate-700 hover:text-[#2563EB] transition-colors px-3 py-2 uppercase font-heading"
                >
                  Sign In
                </Link>
                <button
                  type="button"
                  onClick={() => navigate('/login?tab=signup')}
                  className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs sm:text-sm pl-5 pr-2 py-2 flex items-center gap-2 shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                >
                  <span className="uppercase tracking-wider font-heading">Start Free Trial</span>
                  <div className="w-7 h-7 rounded-full bg-white text-[#2563EB] flex items-center justify-center font-bold shadow-xs group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================
          HERO SECTION: EXPANDED 2-COLUMN LAYOUT WITH LIVE PAYOUT CONSOLE
          ======================================================== */}
      <section className="pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative min-h-[82vh] flex flex-col justify-center">
        {/* Soft background ambient fintech glow */}
        <div className="absolute top-1/4 right-5 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center relative z-10">
          
          {/* Left Column (Col 7): High-Impact Copy, CTA & Social Proof */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Top Kicker Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 text-white text-xs font-black uppercase tracking-wider font-heading border border-slate-800 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>ENTERPRISE INDIAN PAYROLL INFRASTRUCTURE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>

            {/* Giant Bold Headline */}
            <div className="relative">
              <h1 className="text-4xl sm:text-6xl lg:text-[70px] font-black tracking-tight text-slate-950 font-heading leading-[0.98] uppercase">
                <span className="inline-block bg-[#2563EB] text-white px-3 sm:px-4 py-0.5 rounded-2xl mr-2 sm:mr-3 shadow-md">
                  PAYROLL.
                </span>
                <span>HR, &amp;</span>
                <br />
                <span>STATUTORY OS FOR</span>
                <br />
                <span className="text-[#2563EB] inline-flex items-center gap-2 sm:gap-3 flex-wrap">
                  MODERN ENTERPRISES
                  <span className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-300 text-slate-900 text-xl sm:text-2xl shadow-sm rotate-6 border-2 border-black">
                    ⚡
                  </span>
                  <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-[#2563EB] text-base sm:text-lg border border-blue-300 -rotate-12">
                    🔒
                  </span>
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-xl">
              Deterministic Gross-to-Net computation engine for Indian scaleups and enterprises. Complete automation for biometric muster synchronization, 7-step salary runs, EPFO ECR 2.0 returns, ESIC, and digitally signed Form 16.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/login?tab=signup')}
                className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-sm sm:text-base pl-8 pr-2.5 py-4 flex items-center justify-between sm:justify-center gap-4 shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              >
                <span className="uppercase tracking-wider font-heading">START 14-DAY FREE TRIAL</span>
                <div className="w-9 h-9 rounded-full bg-white text-[#2563EB] flex items-center justify-center font-bold shadow-xs group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4 text-[#2563EB]" />
                </div>
              </button>

              <a
                href="#simulator"
                className="px-6 py-4 rounded-full border-2 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-extrabold uppercase tracking-wider font-heading flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Play className="w-4 h-4 text-[#2563EB] fill-[#2563EB]" />
                <span>Watch Live Run</span>
              </a>
            </div>

            {/* Customer Avatars & Trust Banner */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 border-t border-slate-200">
              <div className="flex -space-x-3 shrink-0">
                <img
                  src="/images/hr_manager_smile.jpg"
                  alt="HR Leader"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
                />
                <img
                  src="/images/executive_client_photo.jpg"
                  alt="Enterprise Executive"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
                />
                <img
                  src="/images/tech_founder_avatar.jpg"
                  alt="Tech Leader"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
                />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black font-heading text-slate-900">
                    100% STATUTORY AUDIT PASS
                  </span>
                  <span className="text-yellow-500 font-bold text-xs">★★★★★</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Trusted by 500+ Indian fast-growing companies, CAs &amp; HR Directors. Instant workspace setup.
                </p>
              </div>
            </div>

            {/* 3 Quick Compliance Pill Tags */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold text-slate-600 font-mono">
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> EPFO ECR 2.0 Ready
              </span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Revised 115BAC Slabs
              </span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Sub-4s HDFC NEFT
              </span>
            </div>
          </div>

          {/* Right Column (Col 5): Live Enterprise Payout Console Showcase */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Floating Top-Right Speed Badge */}
            <div className="absolute -top-4 -right-2 z-20 px-3.5 py-1.5 bg-yellow-300 text-slate-950 font-black text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] rotate-2 flex items-center gap-1.5 font-heading">
              <span>⚡ 3.4s WARP DISPATCH</span>
            </div>

            {/* Floating Bottom-Left Stamp */}
            <div className="absolute -bottom-5 -left-4 z-20 px-4 py-2 bg-emerald-500 text-white font-black text-xs rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] -rotate-3 uppercase font-heading flex items-center gap-1.5">
              <span>PAID! 💸 ZERO ERROR RUN</span>
            </div>

            {/* Main Interactive Showcase Console Card */}
            <div className="rounded-3xl border-2 border-black bg-white p-6 sm:p-7 shadow-[10px_10px_0px_#2563EB] space-y-5 relative">
              {/* Card Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-heading">
                    OCTOBER 2026 SALARY RUN
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
                  BATCH #AZ-9842
                </span>
              </div>

              {/* Big Disbursed Amount Hero Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#1E293B] text-white shadow-inner space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                  <span>Total Net Payout Released</span>
                  <span className="text-emerald-400 font-mono">100% RECONCILED</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tabular-nums">
                  ₹18,42,600
                </div>
                <div className="flex justify-between text-[11px] text-slate-300 font-medium pt-1 border-t border-slate-700/60">
                  <span>124 Bank Accounts Dispatched</span>
                  <span className="text-yellow-300 font-bold">Sub-4s Direct NEFT</span>
                </div>
              </div>

              {/* Execution Status Checklist */}
              <div className="space-y-2.5">
                {[
                  {
                    title: '124 Staff Attendance Synced',
                    detail: 'Biometric Muster & 3 Unpaid Leaves (LOP)',
                    icon: '👥',
                  },
                  {
                    title: 'EPFO ECR 2.0 Challan ₹1,48,200',
                    detail: 'Zero Penalty Guarantee · Labour Ministry Pass',
                    icon: '📑',
                  },
                  {
                    title: 'HDFC Bank NEFT Disbursed',
                    detail: 'Bank-verified bulk payment batch verified',
                    icon: '⚡',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs hover:bg-blue-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <span className="font-bold text-slate-900 block font-heading text-[11px]">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {item.detail}
                        </span>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                ))}
              </div>

              {/* Sample Live Employee Disbursed Rows */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-heading block">
                  LIVE EMPLOYEE PAYOUT SAMPLES:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Priya Sharma</span>
                      <span className="text-[10px] text-slate-500">Eng Lead</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-700 block">₹1,42,850</span>
                      <span className="text-[9px] bg-emerald-600 text-white font-bold px-1 rounded-sm">PAID ✓</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Arun Kumar</span>
                      <span className="text-[10px] text-slate-500">UX Lead</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-700 block">₹98,200</span>
                      <span className="text-[9px] bg-emerald-600 text-white font-bold px-1 rounded-sm">PAID ✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Trust Bar in Card */}
              <div className="pt-1 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase font-heading">
                <span>Tally Prime &amp; Zoho Sync Ready</span>
                <span className="text-[#2563EB]">Audit Pass 100%</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          INFINITE MARQUEE TICKER BAR (Electric Blue Ribbon)
          ======================================================== */}
      <div className="w-full bg-[#2563EB] text-white py-3.5 border-y-2 border-black overflow-hidden relative shadow-sm select-none">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs sm:text-sm font-black uppercase tracking-wider font-heading">
          {[1, 2, 3].map((set) => (
            <React.Fragment key={set}>
              <span className="flex items-center gap-2">
                <span className="text-yellow-300">⚡</span> AUTOMATED GROSS-TO-NET ENGINE
              </span>
              <span className="text-blue-200">★</span>
              <span className="flex items-center gap-2">
                <span>🎯</span> REVISED SECTION 115BAC COMPLIANT
              </span>
              <span className="text-blue-200">★</span>
              <span className="flex items-center gap-2">
                <span>🚀</span> UNIFIED EPFO ECR 2.0 &amp; ESIC RETURNS
              </span>
              <span className="text-blue-200">★</span>
              <span className="flex items-center gap-2">
                <span>💼</span> DIRECT HDFC, ICICI, SBI NEFT BATCHES
              </span>
              <span className="text-blue-200">★</span>
              <span className="flex items-center gap-2">
                <span>📋</span> TALLY PRIME &amp; ZOHO BOOKS LEDGER SYNC
              </span>
              <span className="text-blue-200">★</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ========================================================
          SECTION 2: TWO-TONE BENTO GRID (CAPABILITIES & PRICING)
          ======================================================== */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F0F7FF] border-b border-blue-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Card: Workforce Attendance & Leave Muster */}
          <div className="bg-white rounded-3xl p-8 border border-blue-200/80 shadow-[0_10px_30px_rgba(37,99,235,0.06)] flex flex-col justify-between space-y-6">
            <div>
              {/* Photo Frame with Sparkle */}
              <div className="relative mb-6 rounded-2xl overflow-hidden border border-slate-200 group">
                <img
                  src="/images/hr_manager_smile.jpg"
                  alt="HR Operations Director"
                  className="w-full h-64 object-cover object-top group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-black uppercase text-[#2563EB] shadow-xs flex items-center gap-1.5 font-heading">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Workforce Governance</span>
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase font-heading leading-tight mb-3">
                AUTOMATED ATTENDANCE &amp; LEAVE MUSTER
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium mb-6">
                Directly ingest biometric logs, geofenced mobile check-ins, and multi-tier leave workflows. Unpaid leaves (LOP), shift allowances, and overtime auto-compute before final payroll approval.
              </p>

              <button
                type="button"
                onClick={() => navigate('/login?tab=signup')}
                className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs pl-5 pr-2 py-2 flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <span className="uppercase tracking-wider font-heading">EXPLORE WORKFORCE ENGINE</span>
                <div className="w-6 h-6 rounded-full bg-white text-[#2563EB] flex items-center justify-center font-bold">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </div>

            {/* Circular Donut Metric Card */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-blue-100"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#2563EB]"
                      strokeDasharray="40, 100"
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-black font-heading text-slate-900">40%</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-slate-800 font-heading block">
                    40% Reduction in Admin Bandwidth
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Eliminates manual attendance collation and Excel cross-checks.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Transparent Enterprise Pricing */}
          <div id="pricing" className="bg-[#2563EB] text-white rounded-3xl p-8 shadow-[0_15px_35px_rgba(37,99,235,0.35)] flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="w-72 h-72 rounded-full bg-white/10 blur-2xl absolute -top-20 -right-20 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider font-heading">
                TRANSPARENT ENTERPRISE TIER
              </span>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black font-heading tracking-tight text-white">
                  ₹46
                </span>
                <span className="text-sm font-bold text-blue-100 uppercase tracking-wider font-heading">
                  / employee / mo
                </span>
              </div>

              <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed max-w-md">
                Predictable, volume-discounted pricing for high-growth Indian startups, tech enterprises, and multi-location businesses. Zero hidden maintenance retainers.
              </p>

              {/* 38% Donut Graphic inside blue card */}
              <div className="py-4 flex items-center gap-4 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20">
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/20"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-yellow-300"
                      strokeDasharray="38, 100"
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-black font-heading text-white">38%</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-white font-heading block">
                    38% Lower Total Cost
                  </span>
                  <span className="text-[11px] text-blue-100 font-medium">
                    Compared to traditional outsourced CA payroll retainers.
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-200 font-heading block">
                  ALL-INCLUSIVE ENTERPRISE SUITE:
                </span>
                {[
                  'Gross-to-Net automated 7-step salary pipeline',
                  'Unified EPFO ECR 2.0 & ESIC monthly returns',
                  'State Professional Tax (KA, MH, TN, DL) schedules',
                  'Bulk Form 16 Part A & B with digital DSC signatures',
                  'Direct HDFC, ICICI, SBI NEFT/RTGS payment batches',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-white">
                    <div className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-4">
              <button
                type="button"
                onClick={() => navigate('/login?tab=signup')}
                className="w-full rounded-2xl bg-white text-[#2563EB] hover:bg-blue-50 font-black text-sm py-3.5 px-6 shadow-lg transition-all hover:scale-102 active:scale-98 cursor-pointer uppercase tracking-wider font-heading flex items-center justify-center gap-2"
              >
                <span>DEPLOY WORKSPACE ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: STATUTORY ACCURACY ENGINE (BLUEPRINT GRID)
          ======================================================== */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F8FAFC] via-[#EEF4FF] to-[#F1F5F9] border-b-2 border-slate-200 relative overflow-hidden">
        {/* Technical Blueprint Dot Grid & Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#2563EB_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-[0.08] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
            {/* Left Column: Heading + Playful Caution Tape Badge */}
            <div className="space-y-4">
              {/* Neo-Brutalist Tilted Caution Tape Sticker */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-yellow-300 text-slate-900 border-2 border-black font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] -rotate-1 font-heading">
                <span>⚡ 0.00% MATH ERROR TOLERANCE</span>
                <span className="text-[10px] bg-black text-yellow-300 px-1.5 py-0.5 rounded-sm font-mono">100% DETERMINISTIC</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#2563EB] text-[11px] font-black uppercase tracking-wider font-heading border border-blue-200 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                Statutory Accuracy Engine
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase font-heading leading-tight">
                BUILT FOR MAXIMUM REGULATORY PRECISION &amp; SPEED
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-lg">
                Engineered with deterministic gross-to-net computation rules. Alize automatically accounts for Section 115BAC progressive slabs, Section 87A rebates, EPF 12% salary ceilings, and contractor withholding under Sections 194C &amp; 194J.
              </p>

              {/* Playful Illustrated Sticker Badge */}
              <div className="flex items-center gap-3 p-3 bg-white/90 backdrop-blur-xs rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] max-w-md">
                <img
                  src="/images/fintech_doodles.jpg"
                  alt="Fintech Doodles"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-[#2563EB] tracking-wider font-heading">EPFO + ESIC + 115BAC</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">LIVE</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700 leading-tight mt-0.5">
                    Deterministic zero-deviation rules. Central Labour Ministry 2026 codes baked into core runtime.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/login?tab=signup')}
                  className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs pl-6 pr-2 py-2.5 flex items-center gap-3 shadow-[0_8px_20px_rgba(37,99,235,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer group"
                >
                  <span className="uppercase tracking-wider font-heading">START 14-DAY EVALUATION</span>
                  <div className="w-7 h-7 rounded-full bg-white text-[#2563EB] flex items-center justify-center font-bold">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>
            </div>

            {/* Right: Mockup Card & Rotating Stamp Seal + Zero CA Notices Sticker */}
            <div className="relative flex items-center justify-center pt-4 sm:pt-0">
              {/* Rotating Circular Stamp Seal */}
              <div className="absolute -top-6 -left-6 z-20 w-28 h-28 rounded-full bg-white border-2 border-[#2563EB] text-[#2563EB] flex items-center justify-center shadow-lg animate-spin-slow pointer-events-none">
                <div className="text-[8px] font-black uppercase tracking-widest text-center px-1 font-heading leading-tight">
                  ★ 100% STATUTORY AUDIT PASS ★ MINISTRY OF LABOUR &amp; EPFO ★
                </div>
              </div>

              {/* Playful Rubber Stamp Sticker */}
              <div className="absolute -bottom-4 -right-4 z-20 bg-rose-500 text-white font-black text-[11px] px-3.5 py-1.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] rotate-3 uppercase font-heading flex items-center gap-1.5">
                <span>🛡️ ZERO CA NOTICES</span>
              </div>

              {/* Blue UI Mockup Card with Floating Tasks */}
              <div className="w-full max-w-md bg-[#2563EB] rounded-3xl p-6 text-white shadow-2xl space-y-4 relative overflow-hidden border-2 border-black">
                <div className="flex items-center justify-between pb-3 border-b border-white/20">
                  <span className="text-xs font-black uppercase tracking-wider font-heading flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ENTERPRISE CORE RUNTIME
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">ACTIVE</span>
                </div>

                {/* Floating Task Pills */}
                <div className="space-y-2.5">
                  {[
                    { title: '124 Employees Synchronized', time: 'Biometric Muster Synced', icon: '👥' },
                    { title: 'EPFO ECR 2.0 Text File Ready', time: 'Challan ₹1,48,200', icon: '📑' },
                    { title: 'HDFC Bank NEFT Disbursed', time: 'Sub-4s Execution Batch', icon: '⚡' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white text-slate-900 flex items-center justify-between shadow-xs transform hover:scale-102 transition-transform border border-slate-200"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{item.icon}</span>
                        <div>
                          <span className="text-xs font-bold font-heading block">{item.title}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3 Neo-Brutalist Engineered Capability Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Card 1 */}
            <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-[5px_5px_0px_#000] flex flex-col justify-between hover:-translate-y-1 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#2563EB] text-white flex flex-col items-center justify-center shrink-0 border-2 border-black shadow-[2px_2px_0px_#000]">
                  <span className="text-xl font-black font-heading leading-none">99.9%</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-blue-200">ACCURACY</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['STATUTORY', '115BAC', 'EPFO 2.0'].map((tag) => (
                      <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#2563EB] border border-blue-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 uppercase font-heading leading-tight">
                    DETERMINISTIC GROSS-TO-NET ENGINE
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Calculates income tax TDS, Section 80 deductions, and state professional taxes with zero manual intervention.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-[5px_5px_0px_#000] flex flex-col justify-between hover:-translate-y-1 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-emerald-600 text-white flex flex-col items-center justify-center shrink-0 border-2 border-black shadow-[2px_2px_0px_#000]">
                  <span className="text-xl font-black font-heading leading-none">3.4s</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-100">RUNTIME</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['NEFT', 'RTGS', 'HDFC BATCH'].map((tag) => (
                      <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 uppercase font-heading leading-tight">
                    HIGH-CONCURRENCY PAYOUT BATCHES
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Processes hundreds of employee disbursements simultaneously and exports bank-approved bulk salary files.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-[5px_5px_0px_#000] flex flex-col justify-between hover:-translate-y-1 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-amber-500 text-slate-950 flex flex-col items-center justify-center shrink-0 border-2 border-black shadow-[2px_2px_0px_#000]">
                  <span className="text-xl font-black font-heading leading-none">100%</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-amber-950">AUDIT READY</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['TALLY', 'ZOHO', 'FORM 16'].map((tag) => (
                      <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 uppercase font-heading leading-tight">
                    MULTI-ENTITY &amp; CONTRACTOR SCALING
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Supports consolidated parent-subsidiary payroll, 194C/194J contractor TDS, and instant journal ledger export.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: INTERACTIVE CTC & IN-HAND SALARY ENGINE (MINT CANVAS)
          ======================================================== */}
      <section id="salary-engine" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#ECFDF5] via-[#F0FDF4] to-[#F8FAFC] border-b-2 border-emerald-200 relative overflow-hidden">
        {/* Soft emerald currency glow & background watermarks */}
        <div className="absolute top-10 left-10 text-9xl font-black text-emerald-200/20 select-none pointer-events-none font-mono">₹</div>
        <div className="absolute bottom-10 right-10 text-9xl font-black text-emerald-200/20 select-none pointer-events-none font-mono">₹</div>
        <div className="w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl absolute -top-20 -left-20 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            <div className="text-center md:text-left space-y-2">
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5 font-heading">
                <Calculator className="w-4 h-4 text-emerald-600" /> Interactive Salary Engine
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 uppercase font-heading">
                Indian In-Hand Salary &amp; Tax Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
                Test live Indian statutory payroll computation with revised Section 115BAC tax slabs, EPF 12% ceiling rules, and state professional taxes.
              </p>
            </div>

            {/* Funny Sticky Note Doodle */}
            <div className="hidden md:flex items-center gap-2.5 bg-yellow-200 text-yellow-950 px-4 py-2.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] -rotate-2 text-xs font-black font-heading max-w-xs shrink-0">
              <span className="text-xl">📌</span>
              <span>Zero Salary Day Surprises: What employees see here = exactly what hits their bank account!</span>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0px_#000]">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Controls */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-black uppercase text-slate-800 font-heading flex items-center gap-1.5">
                      <span>Annual CTC (Cost to Company)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">100% Configurable</span>
                    </label>
                    <span className="text-2xl font-black font-mono text-emerald-600">
                      {formatINR(annualCtc)}
                      <span className="text-xs text-slate-400 font-normal ml-1">/ yr</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={300000}
                    max={4800000}
                    step={50000}
                    value={annualCtc}
                    onChange={(e) => setAnnualCtc(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1 font-bold">
                    <span>₹3.0 LPA</span>
                    <span>₹12.0 LPA (Default)</span>
                    <span>₹24.0 LPA</span>
                    <span>₹48.0 LPA</span>
                  </div>
                </div>

                {/* Quick Preset Badges */}
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-heading block mb-2">
                    POPULAR INDIAN IT SALARY BANDS:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[600000, 900000, 1200000, 1800000, 2400000, 3600000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAnnualCtc(preset)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                          annualCtc === preset
                            ? 'bg-emerald-600 text-white border-black shadow-[2px_2px_0px_#000]'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                      >
                        ₹{(preset / 100000).toFixed(1)} LPA
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tax Regime & PT State Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase mb-1.5 font-heading">
                      Income Tax Regime
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-300">
                      <button
                        type="button"
                        onClick={() => setTaxRegime('new')}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                          taxRegime === 'new'
                            ? 'bg-white text-emerald-700 shadow-xs font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        New (115BAC)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaxRegime('old')}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                          taxRegime === 'old'
                            ? 'bg-white text-emerald-700 shadow-xs font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Old Regime
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase mb-1.5 font-heading">
                      Professional Tax State
                    </label>
                    <select
                      value={statePt}
                      onChange={(e) => setStatePt(e.target.value as any)}
                      className="w-full h-[40px] px-3 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Karnataka">Karnataka (₹200/mo)</option>
                      <option value="Maharashtra">Maharashtra (₹200/mo)</option>
                      <option value="Tamil Nadu">Tamil Nadu (Slab-based)</option>
                      <option value="Delhi">Delhi (No PT)</option>
                    </select>
                  </div>
                </div>

                {/* Flying Money Doodle Tag */}
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-heading">
                  <span className="text-base">💸</span>
                  <span>Direct Bank Dispatch Ready: Sub-4s bulk transfer batch ready for your bank on the 1st</span>
                </div>
              </div>

              {/* Right: Real-time Live Salary Slip Preview */}
              <div className="w-full lg:w-1/2 rounded-2xl bg-[#F0FDF4] p-6 border-2 border-emerald-300 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 font-heading">
                      Estimated Monthly Take-Home (Net Pay)
                    </span>
                    <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-700 tabular-nums mt-0.5">
                      {formatINR(salaryBreakdown.takeHome)}
                      <span className="text-xs text-slate-500 font-normal ml-1">/ month</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 font-heading">Gross Monthly</span>
                    <p className="text-sm font-black font-mono text-slate-800 tabular-nums">
                      {formatINR(salaryBreakdown.monthlyGross)}
                    </p>
                  </div>
                </div>

                {/* Colorful Multi-Segment Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-700 font-heading">Salary Composition Ratio</span>
                    <span className="text-emerald-700 font-mono font-bold">
                      {Math.round((salaryBreakdown.takeHome / salaryBreakdown.monthlyGross) * 100)}% In-Hand
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                    <div
                      style={{ width: `${(salaryBreakdown.basic / salaryBreakdown.monthlyGross) * 100}%` }}
                      className="bg-[#2563EB] transition-all duration-300"
                      title="Basic Pay (50%)"
                    />
                    <div
                      style={{ width: `${(salaryBreakdown.hra / salaryBreakdown.monthlyGross) * 100}%` }}
                      className="bg-[#3B82F6] transition-all duration-300"
                      title="HRA (25%)"
                    />
                    <div
                      style={{ width: `${(salaryBreakdown.specialAllowance / salaryBreakdown.monthlyGross) * 100}%` }}
                      className="bg-emerald-500 transition-all duration-300"
                      title="Special Allowance"
                    />
                    <div
                      style={{ width: `${(salaryBreakdown.totalDeductions / salaryBreakdown.monthlyGross) * 100}%` }}
                      className="bg-rose-500 transition-all duration-300"
                      title="Statutory Deductions (EPF + PT + TDS)"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3 text-[10px] text-slate-500 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#2563EB]" /> Basic: {formatINR(salaryBreakdown.basic)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#3B82F6]" /> HRA: {formatINR(salaryBreakdown.hra)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Allowances: {formatINR(salaryBreakdown.specialAllowance)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" /> Deductions: {formatINR(salaryBreakdown.totalDeductions)}
                    </span>
                  </div>
                </div>

                {/* Deductions Breakdown Mini Table */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-heading block">Monthly Earnings</span>
                    <div className="space-y-1 font-mono text-[11px] mt-1">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Basic (50%)</span>
                        <span className="font-semibold text-slate-900">{formatINR(salaryBreakdown.basic)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">HRA (25%)</span>
                        <span className="font-semibold text-slate-900">{formatINR(salaryBreakdown.hra)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Special Allowance</span>
                        <span className="font-semibold text-slate-900">{formatINR(salaryBreakdown.specialAllowance)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-xs">
                    <span className="text-[10px] font-bold text-rose-500 uppercase font-heading block">Statutory Deductions</span>
                    <div className="space-y-1 font-mono text-[11px] mt-1 text-rose-600">
                      <div className="flex justify-between">
                        <span>EPF (12%)</span>
                        <span className="font-semibold">-{formatINR(salaryBreakdown.epf)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Professional Tax</span>
                        <span className="font-semibold">-{formatINR(salaryBreakdown.pt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated TDS</span>
                        <span className="font-semibold">-{formatINR(salaryBreakdown.monthlyTds)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons for Preview */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Auto-synced with Indian Tax Act Section 115BAC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSamplePayslip(true)}
                      className="px-3.5 py-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs font-heading"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview Sample Payslip
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('/login?tab=signup')}
                      rightIcon={<ArrowRight className="w-3 h-3" />}
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-bold font-heading rounded-xl"
                    >
                      Configure in App
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5: LIVE 7-STEP RUN SIMULATOR (MISSION CONTROL CONSOLE)
          ======================================================== */}
      <section id="simulator" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#090D16] text-white border-b-2 border-black relative overflow-hidden">
        {/* Cyber Space Mission Control Grid & Neon Orbs */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="rounded-3xl border-2 border-blue-500/40 bg-[#0F172A]/90 backdrop-blur-md p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Header with Arcade & Speed Badges */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-700/80">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-black uppercase tracking-wider font-heading">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Live Pipeline Simulator
                  </div>
                  <div className="px-3 py-1 bg-yellow-400 text-black font-black text-xs rounded-lg border border-black shadow-[2px_2px_0px_#000] rotate-1 flex items-center gap-1 font-heading">
                    <span>⚡ 3.4s WARP SPEED</span>
                    <span className="text-[10px] font-sans font-semibold">(124 Employees)</span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white font-heading uppercase">
                  Experience the 7-Step Automated Gross-to-Net Run
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xl">
                  Execute live simulation to inspect how Alize processes 124 employees, calculates EPFO/ESIC/TDS, and creates bank payout batches in 3.4 seconds.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                {simCompleted && (
                  <button
                    type="button"
                    onClick={resetSimulation}
                    className="px-4 py-2.5 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer font-heading"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                    Reset Run
                  </button>
                )}
                <button
                  type="button"
                  onClick={startSimulation}
                  disabled={isSimulating}
                  className={`px-6 py-2.5 rounded-xl text-white font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer uppercase font-heading ${
                    isSimulating
                      ? 'bg-slate-600 cursor-not-allowed opacity-80'
                      : 'bg-[#2563EB] hover:bg-[#1D4ED8] hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-blue-400'
                  }`}
                >
                  <Play className={`w-4 h-4 fill-white ${isSimulating ? 'animate-spin' : ''}`} />
                  {isSimulating ? `Processing Step ${simStep}/7...` : simCompleted ? 'Re-run Simulation' : 'Execute Live Run'}
                </button>
              </div>
            </div>

            {/* Simulation Real-time Progress Bar */}
            <div className="py-5 space-y-2">
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className="text-slate-300 flex items-center gap-2 font-sans">
                  {isSimulating ? (
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  ) : simCompleted ? (
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  ) : (
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-500" />
                  )}
                  Pipeline Execution: {isSimulating ? `Executing Stage ${simStep} of 7` : simCompleted ? '100% Disbursed & Reconciled' : 'Engine Ready'}
                </span>
                <span className="text-blue-400 font-mono">
                  {simStep === 0 ? '0%' : simCompleted ? '100%' : `${Math.round((simStep / 7) * 100)}%`}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden shadow-inner border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-[#2563EB] via-indigo-500 to-emerald-400 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                  style={{ width: `${(simStep / 7) * 100}%` }}
                />
              </div>
            </div>

            {/* 7 Interactive Stage Cards with Futuristic Neon Styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 pt-2">
              {[
                { num: 1, title: 'Biometrics', desc: '124 staff attendance synced' },
                { num: 2, title: 'Leaves & LOP', desc: '3 unpaid leaves deducted' },
                { num: 3, title: 'PF & ESIC', desc: '₹1.48L ECR challan ready' },
                { num: 4, title: 'TDS (192)', desc: '115BAC taxes deducted' },
                { num: 5, title: 'Claims', desc: '₹34,500 approved expenses' },
                { num: 6, title: 'Bank Batch', desc: 'HDFC NEFT file generated' },
                { num: 7, title: 'Payslips', desc: 'Encrypted PDFs emailed' },
              ].map((stage) => {
                const isActive = simStep === stage.num;
                const isPast = simStep > stage.num || simCompleted;
                return (
                  <div
                    key={stage.num}
                    className={`p-3 rounded-2xl border text-xs transition-all duration-300 ${
                      isActive
                        ? 'border-blue-400 bg-blue-950/80 shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-102 ring-2 ring-blue-400'
                        : isPast
                        ? 'border-emerald-500/60 bg-emerald-950/40 text-slate-200'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          isPast
                            ? 'bg-emerald-500 text-black font-black'
                            : isActive
                            ? 'bg-blue-500 text-white animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isPast ? '✓' : stage.num}
                      </span>
                      <span className="text-[9px] font-mono font-semibold uppercase text-slate-400">
                        Step {stage.num}
                      </span>
                    </div>
                    <h4
                      className={`font-bold font-heading leading-tight ${
                        isPast ? 'text-emerald-300' : isActive ? 'text-blue-300' : 'text-slate-300'
                      }`}
                    >
                      {stage.title}
                    </h4>
                    <p className="text-[10px] mt-1 text-slate-400 leading-snug">
                      {stage.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Live Outcome Banner upon completion */}
            {simCompleted && (
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-[#2563EB] to-indigo-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    🎉
                  </div>
                  <div>
                    <h4 className="text-sm font-black font-heading uppercase">
                      October 2026 Payroll Run Completed in 3.4 Seconds!
                    </h4>
                    <p className="text-xs text-blue-100">
                      124 Employees Disbursed · Total Amount: ₹18,42,600 · Bank NEFT Batch Downloadable · Form 16 / Payslips Emailed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSamplePayslip(true)}
                    className="px-4 py-2 rounded-xl bg-white text-[#2563EB] hover:bg-blue-50 font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer font-heading"
                  >
                    View Sample Payslip
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/login?tab=signup')}
                    className="px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-white font-bold text-xs border border-white/30 transition-all hover:scale-105 active:scale-95 cursor-pointer font-heading"
                  >
                    Deploy in Your Company &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: STATUTORY COMPLIANCE AUDIT HEALTH CHECK (WARM GOLD PARCHMENT)
          ======================================================== */}
      <section id="compliance" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFFDF0] via-[#FEF9C3]/40 to-[#F8FAFC] border-b-2 border-amber-200 relative overflow-hidden">
        {/* Subtle regulatory parchment pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0px_#000]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-xl space-y-2">
                {/* Hazard Tape Sticker */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-amber-950 border-2 border-black font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000] -rotate-1 font-heading">
                  <span>🛡️ LABOUR LAW &amp; IT DEPT AUDIT DEFENSE</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider font-heading block">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Statutory Compliance Health Meter
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading uppercase">
                  Is Your Workplace 100% Indian Statutory Audit-Ready?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Toggle your current payroll processes to verify regulatory risk exposure under Indian labour codes and Income Tax Act rules.
                </p>

                {/* Funny Penalty Strikethrough Sticker */}
                <div className="inline-flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  <span className="text-xs font-bold text-rose-500 line-through">₹50,000 Govt Notice Penalty</span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-heading">SAVED: ₹0 FINES</span>
                </div>
              </div>

              {/* Score Ring Display */}
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-amber-50/80 border-2 border-black shadow-[4px_4px_0px_#000] shrink-0">
                <div className="text-center">
                  <span className={`text-4xl font-black font-mono tabular-nums ${
                    complianceScore === 100 ? 'text-emerald-600' : complianceScore >= 75 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {complianceScore}%
                  </span>
                  <span className="block text-[10px] uppercase font-black text-slate-500 mt-0.5 font-heading">Audit Readiness</span>
                </div>
                <div className="border-l-2 border-slate-300 pl-4 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      complianceScore === 100 ? 'bg-emerald-500 animate-pulse' : complianceScore >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                    <span className="text-xs font-black text-slate-900 font-heading">
                      {complianceScore === 100 ? 'Zero Regulatory Liability' : complianceScore >= 75 ? 'Moderate Audit Risk' : 'High Penalty Exposure'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium">
                    {complianceScore === 100
                      ? '100% EPFO ECR 2.0, ESIC, State PT & Section 192 compliant.'
                      : 'Risk of EPFO 14B damages, interest penalties & IT Dept notices.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Interactive Toggle Cards with Playful Hover */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {[
                {
                  key: 'epfo' as const,
                  title: 'EPFO ECR 2.0 Automation',
                  act: 'Employees Provident Funds Act 1952',
                  risk: 'Penalty up to 25% under Section 14B + 12% interest',
                },
                {
                  key: 'esic' as const,
                  title: 'ESIC Monthly Return',
                  act: 'ESI Act 1948 (Wage Ceiling ₹21,000)',
                  risk: 'Damages under Regulation 31C for late contributions',
                },
                {
                  key: 'pt' as const,
                  title: 'State Professional Tax',
                  act: 'State PT Acts (KA, MH, TN, DL, etc.)',
                  risk: 'Compounding monthly interest & employer liability',
                },
                {
                  key: 'tds192' as const,
                  title: 'Income Tax TDS (Section 192)',
                  act: 'Finance Act 2026 (Revised 115BAC Slabs)',
                  risk: 'Section 201(1A) 1.5% monthly interest on delay',
                },
              ].map((item) => {
                const isChecked = auditChecklist[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleAuditItem(item.key)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-[3px_3px_0px_#059669]'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                        Statutory Rule
                      </span>
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs font-heading">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-1 leading-snug">{item.act}</p>
                    <div className="mt-3 pt-2 border-t border-slate-100 text-[9px] font-bold text-slate-500">
                      <span className={isChecked ? 'text-emerald-700 font-black' : 'text-rose-600'}>
                        {isChecked ? '✓ Automated in Alize' : item.risk}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 7: CONNECTED BANKING & ENTERPRISE ARCHITECTURE (ISOMETRIC VAULT)
          ======================================================== */}
      <section id="architecture" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#EFF6FF] via-[#DBEAFE]/40 to-[#F8FAFC] border-b-2 border-blue-200 relative overflow-hidden">
        {/* Blended Isometric Banking Vault Mesh Background */}
        <img
          src="/images/banking_vault_mesh.jpg"
          alt="Banking Vault Grid"
          className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply pointer-events-none"
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            {/* Funny RIP Excel VLOOKUP Sticker */}
            <div className="inline-flex items-center gap-2.5 bg-white px-4 py-2 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] -rotate-1">
              <span className="text-xl">🪦</span>
              <div className="text-left">
                <span className="text-[10px] font-black uppercase text-rose-600 font-heading block">RIP Excel VLOOKUP (1985 - 2026)</span>
                <span className="text-[11px] font-bold text-slate-700">Never corrupt another payroll spreadsheet again</span>
              </div>
            </div>

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2563EB] text-white text-2xl shadow-md border-2 border-black mx-auto block">
              🏛️
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase font-heading leading-tight tracking-tight">
              CONNECTED BANKING &amp; ENTERPRISE ARCHITECTURE
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
              Directly connect your corporate bank accounts and general ledgers for seamless, audit-ready financial operations.
            </p>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => navigate('/login?tab=signup')}
                className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs pl-6 pr-2 py-2.5 flex items-center gap-3 shadow-[0_8px_20px_rgba(37,99,235,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <span className="uppercase tracking-wider font-heading">CONNECT BANKING CONSOLE</span>
                <div className="w-7 h-7 rounded-full bg-white text-[#2563EB] flex items-center justify-center font-bold">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>

          {/* 3 Royal Blue Feature Box Cards with Neo-Brutalist Pop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="rounded-3xl bg-[#2563EB] text-white p-7 shadow-[6px_6px_0px_#000] border-2 border-black flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-transform">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center text-2xl border border-white/20">
                  🏦
                </div>
                <h3 className="text-xl font-black uppercase font-heading leading-tight">
                  DIRECT BANK DISBURSEMENTS
                </h3>
                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  Direct integration with HDFC, ICICI, Axis, SBI, and RazorpayX for sub-5-minute salary batch processing with real-time payout tracking and zero bounce liability.
                </p>
              </div>
              <div className="pt-4 border-t border-white/20 flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-wider font-heading">
                <span>Instant Bank NEFT &amp; RTGS</span>
                <span>→</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl bg-[#2563EB] text-white p-7 shadow-[6px_6px_0px_#000] border-2 border-black flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-transform">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center text-2xl border border-white/20">
                  📊
                </div>
                <h3 className="text-xl font-black uppercase font-heading leading-tight">
                  GENERAL LEDGER &amp; ERP SYNC
                </h3>
                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  Seamless journal voucher exports to Tally Prime, Zoho Books, SAP, and QuickBooks in one click. Eliminate double-entry reconciliation between HR and Accounts.
                </p>
              </div>
              <div className="pt-4 border-t border-white/20 flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-wider font-heading">
                <span>Tally Prime &amp; Zoho Sync</span>
                <span>→</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl bg-[#2563EB] text-white p-7 shadow-[6px_6px_0px_#000] border-2 border-black flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-transform">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center text-2xl border border-white/20">
                  🛡️
                </div>
                <h3 className="text-xl font-black uppercase font-heading leading-tight">
                  MAKER-CHECKER GOVERNANCE
                </h3>
                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  Dual authorization protocols ensuring payroll calculations initiated by HR are formally approved by Finance Officers before bank release. Complete audit logging.
                </p>
              </div>
              <div className="pt-4 border-t border-white/20 flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-wider font-heading">
                <span>Dual Approval Protocol</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 8: PRE-FOOTER GIANT BOLD CTA BANNER
          ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="rounded-3xl bg-[#F0F7FF] border-2 border-[#2563EB] p-8 sm:p-14 text-center relative overflow-hidden shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2563EB] text-white text-3xl shadow-md border-2 border-black mb-4">
            🖥️
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-slate-900 uppercase font-heading leading-[0.98] tracking-tight max-w-3xl mx-auto">
            DEPLOY ALIZE ENTERPRISE IN YOUR COMPANY
          </h2>

          {/* Feature Badges in Black Pill Bar */}
          <div className="mt-8 mb-6 inline-flex flex-wrap items-center justify-center gap-3 bg-black text-white px-5 py-3 rounded-full text-xs font-black uppercase font-heading shadow-md">
            <span className="flex items-center gap-1.5">
              <span>📱</span> Biometric Muster Sync
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <span>💼</span> 1-Click Bank NEFT
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <span>📄</span> Instant Form 16 DSC
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate('/login?tab=signup')}
              className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-sm pl-8 pr-2.5 py-3.5 flex items-center gap-4 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer group uppercase font-heading"
            >
              <span>START FREE 14-DAY TRIAL</span>
              <div className="w-8 h-8 rounded-full bg-white text-[#2563EB] flex items-center justify-center font-bold">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => navigate('/login?tab=signin')}
              className="rounded-full bg-white hover:bg-slate-50 text-slate-900 border-2 border-black font-black text-sm px-7 py-3.5 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase font-heading"
            >
              SIGN IN TO CONSOLE
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 9: DEEP ROYAL BLUE FOOTER WITH WATERMARK
          ======================================================== */}
      <footer className="mt-auto bg-[#1D4ED8] text-white pt-16 pb-8 border-t-2 border-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 relative z-10">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white text-[#1D4ED8] flex items-center justify-center font-black text-lg shadow-sm">
                A
              </div>
              <span className="font-black text-lg tracking-tight uppercase font-heading">
                ALIZE PAYROLL
              </span>
            </div>
            <p className="text-xs text-blue-100 max-w-sm font-medium leading-relaxed">
              India's premier high-speed workforce payroll engine by {COMPANY_INFO.name}. Fully compliant with Ministry of Labour, EPFO ECR 2.0, ESIC, and Income Tax Department.
            </p>
            <p className="text-[11px] font-mono text-blue-200">
              CIN: {COMPANY_INFO.cin} · TAN: {COMPANY_INFO.tan}
            </p>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider mb-3 font-heading text-white">
              Product
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-blue-100">
              <li><a href="#salary-engine" className="hover:text-white transition-colors">Salary Engine</a></li>
              <li><a href="#simulator" className="hover:text-white transition-colors">7-Step Simulator</a></li>
              <li><a href="#compliance" className="hover:text-white transition-colors">Statutory Health</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors">Banking &amp; ERP</a></li>
              <li><Link to="/login?tab=signup" className="hover:text-white transition-colors">Free Trial</Link></li>
            </ul>
          </div>

          {/* Column 2: Statutory */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider mb-3 font-heading text-white">
              Statutory
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-blue-100">
              <li>EPFO ECR 2.0</li>
              <li>ESIC Portal Return</li>
              <li>Section 115BAC TDS</li>
              <li>State Professional Tax</li>
              <li>Form 16 DSC Generator</li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider mb-3 font-heading text-white">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-blue-100">
              <li><Link to="/login?tab=signin" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/login?tab=signup" className="hover:text-white transition-colors">Register</Link></li>
              <li>Security &amp; Encryption</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        {/* Giant Bold Watermark Marquee */}
        <div className="py-6 border-y border-white/20 overflow-hidden relative select-none opacity-90">
          <div className="animate-marquee flex items-center gap-6 whitespace-nowrap text-3xl sm:text-5xl font-black uppercase tracking-tight font-heading text-white">
            {[1, 2, 3].map((idx) => (
              <React.Fragment key={idx}>
                <span>ENTERPRISE PAYROLL INFRASTRUCTURE</span>
                <span className="text-yellow-300">★</span>
                <span>AUTOMATED STATUTORY WORKFORCE OS</span>
                <span className="text-yellow-300">★</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-blue-200 font-medium relative z-10">
          <div>
            &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved. Made for Indian Enterprises.
          </div>
          <div className="flex items-center gap-6">
            <span>ISO 27001 Certified</span>
            <span>256-Bit SSL Encrypted</span>
            <span>Bank-Grade Payouts</span>
          </div>
        </div>
      </footer>

      {/* ========================================================
          FLOATING QUICK-ACTION PILL (Appears on Scroll)
          ======================================================== */}
      <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-white/20 flex items-center gap-3 animate-fade-in text-xs font-bold font-heading">
          <span className="flex items-center gap-1.5 text-blue-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Automate Indian Payroll in 4 Mins
          </span>
          <button
            type="button"
            onClick={() => navigate('/login?tab=signup')}
            className="px-4 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-black shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/login?tab=signin')}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* ========================================================
          INTERACTIVE SAMPLE PAYSLIP PREVIEW MODAL
          ======================================================== */}
      {showSamplePayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-black text-base shadow-xs">
                  A
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase font-heading leading-tight">
                    {COMPANY_INFO.name}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {COMPANY_INFO.address}, Bengaluru, Karnataka - {COMPANY_INFO.pincode}
                  </p>
                  <p className="text-[9px] font-mono text-slate-400">
                    CIN: {COMPANY_INFO.cin} · TAN: {COMPANY_INFO.tan}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSamplePayslip(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Payslip Title */}
            <div className="text-center py-1.5 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-xs font-black text-[#2563EB] uppercase tracking-wider font-heading">
                Payslip for the Month of October 2026
              </span>
            </div>

            {/* Employee Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold font-heading">Employee Name</span>
                <span className="font-bold text-slate-800">Aarav Iyer</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold font-heading">Employee ID</span>
                <span className="font-mono font-bold text-slate-800">EMP-1024</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold font-heading">Designation</span>
                <span className="font-semibold text-slate-700">Senior Software Eng (L2)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold font-heading">PAN Number</span>
                <span className="font-mono font-semibold text-slate-700">ABCDE1234F</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold font-heading">UAN Number</span>
                <span className="font-mono font-semibold text-slate-700">100928374615</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold font-heading">Tax Regime</span>
                <span className="font-semibold text-[#2563EB]">{taxRegime === 'new' ? 'New (115BAC)' : 'Old Regime'}</span>
              </div>
            </div>

            {/* Earnings vs Deductions Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Earnings */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <div className="bg-blue-100/60 px-3 py-2 font-black text-[#2563EB] uppercase text-[11px] font-heading flex justify-between">
                  <span>Earnings Component</span>
                  <span>Amount (₹)</span>
                </div>
                <div className="divide-y divide-slate-100 p-3 space-y-2">
                  <div className="flex justify-between text-slate-700">
                    <span>Basic Salary (50%)</span>
                    <span className="font-mono font-semibold tabular-nums">{formatINR(salaryBreakdown.basic)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 pt-1.5">
                    <span>House Rent Allowance (HRA)</span>
                    <span className="font-mono font-semibold tabular-nums">{formatINR(salaryBreakdown.hra)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 pt-1.5">
                    <span>Special Allowance</span>
                    <span className="font-mono font-semibold tabular-nums">{formatINR(salaryBreakdown.specialAllowance)}</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 pt-2 border-t border-slate-200 font-heading">
                    <span>Total Gross Earnings</span>
                    <span className="font-mono tabular-nums">{formatINR(salaryBreakdown.monthlyGross)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <div className="bg-rose-100/60 px-3 py-2 font-black text-rose-700 uppercase text-[11px] font-heading flex justify-between">
                  <span>Deduction Component</span>
                  <span>Amount (₹)</span>
                </div>
                <div className="divide-y divide-slate-100 p-3 space-y-2">
                  <div className="flex justify-between text-slate-700">
                    <span>Provident Fund (EPF 12%)</span>
                    <span className="font-mono font-semibold tabular-nums text-rose-600">-{formatINR(salaryBreakdown.epf)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 pt-1.5">
                    <span>Professional Tax ({statePt})</span>
                    <span className="font-mono font-semibold tabular-nums text-rose-600">-{formatINR(salaryBreakdown.pt)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 pt-1.5">
                    <span>Income Tax (TDS Section 192)</span>
                    <span className="font-mono font-semibold tabular-nums text-rose-600">-{formatINR(salaryBreakdown.monthlyTds)}</span>
                  </div>
                  <div className="flex justify-between font-black text-rose-800 pt-2 border-t border-slate-200 font-heading">
                    <span>Total Deductions</span>
                    <span className="font-mono tabular-nums">-{formatINR(salaryBreakdown.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Highlight */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 block font-heading">
                  Net Salary Disbursed to Bank
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 tabular-nums">
                  {formatINR(salaryBreakdown.takeHome)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                <span>Digitally Verified &amp; Encrypted</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowSamplePayslip(false)}
              >
                Close Preview
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowSamplePayslip(false);
                  navigate('/login?tab=signup');
                }}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="bg-[#2563EB] hover:bg-[#1D4ED8]"
              >
                Start Free Trial &amp; Generate Real Payslips
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
