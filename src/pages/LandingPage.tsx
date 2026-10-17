import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { COMPANY_INFO } from '../data/mockData';
import { usePageSeo } from '../hooks/usePageSeo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  usePageSeo({
    title: 'Smart Payroll & Workforce Management Platform | Alize',
    description: 'Automate monthly salary disbursements, EPFO ECR 2.0 returns, ESIC, Form 16 DSC signing, and contractor payouts with Alize Payroll.',
    canonicalPath: '/',
  });

  // --- Dynamic State: Interactive CTC & In-Hand Calculator ---
  const [annualCtc, setAnnualCtc] = useState<number>(1200000); // 12 LPA default
  const [taxRegime, setTaxRegime] = useState<'new' | 'old'>('new');
  const [statePt, setStatePt] = useState<'Karnataka' | 'Maharashtra' | 'Tamil Nadu' | 'Delhi'>('Karnataka');

  // --- Dynamic State: Interactive Module Showcase Tabs ---
  const [activeTab, setActiveTab] = useState<'payroll' | 'compliance' | 'attendance' | 'fnf' | 'ess'>('payroll');

  // --- Dynamic State: ROI Calculator ---
  const [teamSize, setTeamSize] = useState<number>(65);

  // --- Dynamic State: FAQ Accordion ---
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<string>('all');

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
      // 115BAC: Standard deduction ₹75,000
      const taxableIncome = Math.max(0, annualCtc - 75000);
      if (taxableIncome <= 700000) {
        annualTax = 0; // Rebate under 87A
      } else {
        // Simple progressive slab approximation
        if (taxableIncome > 1500000) {
          annualTax = 150000 + (taxableIncome - 1500000) * 0.3;
        } else if (taxableIncome > 1200000) {
          annualTax = 90000 + (taxableIncome - 1200000) * 0.2;
        } else if (taxableIncome > 1000000) {
          annualTax = 60000 + (taxableIncome - 1000000) * 0.15;
        } else if (taxableIncome > 700000) {
          annualTax = 20000 + (taxableIncome - 700000) * 0.1;
        }
        annualTax = Math.round(annualTax * 1.04); // 4% cess
      }
    } else {
      // Old Regime: Std deduction 50k + 1.5L 80C
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

  // --- Dynamic Math: ROI Metrics ---
  const roiMetrics = useMemo(() => {
    const manualHours = Math.round(teamSize * 0.65);
    const alizeMinutes = Math.min(10, Math.max(3, Math.round(teamSize * 0.08)));
    const annualSavings = Math.round(teamSize * 3600);
    return { manualHours, alizeMinutes, annualSavings };
  }, [teamSize]);

  // --- FAQs List with Categories ---
  const allFaqs = [
    {
      category: 'compliance',
      q: 'Does Alize Payroll comply with Indian Statutory laws (PF, ESI, PT, TDS)?',
      a: 'Yes. Alize Payroll includes built-in compliance templates for EPFO Electronic Challan Return (ECR), ESIC monthly filings, State-specific Professional Tax schedules (Karnataka, Maharashtra, Tamil Nadu, etc.), and Income Tax Section 192 TDS deductions under both Old and New (115BAC) regimes.',
    },
    {
      category: 'payroll',
      q: 'How fast can our HR team process monthly payroll runs?',
      a: 'Our automated 7-step payroll pipeline connects biometric attendance data, approved leaves, and expense reimbursements in real-time. What previously took days takes under 5 minutes with automated payslip dispatch.',
    },
    {
      category: 'ess',
      q: 'Can employees view and download their own payslips & Form 16?',
      a: 'Yes, Alize Payroll includes an Employee Self-Service (ESS) portal where employees can download digitally signed payslips, track leave balances, declare tax exemptions (80C, 80D, HRA), and submit expense claims.',
    },
    {
      category: 'payroll',
      q: 'Can we define custom salary structures and pay bands?',
      a: 'Absolutely. You can build multi-tier compensation packages using fixed sums, percentage splits of CTC, and custom allowance formulas across different seniority levels and departmental divisions.',
    },
    {
      category: 'compliance',
      q: 'How does Alize handle Full and Final (F&F) Settlements for departing employees?',
      a: 'Alize automatically computes Payment of Gratuity Act 1972 statutory gratuity formula (15 * Last Drawn Basic * Years / 26), unavailed leave encashment, notice period pay/recovery, and generates an audit-ready clearance statement.',
    },
    {
      category: 'pricing',
      q: 'Are there any hidden setup or integration fees?',
      a: 'Zero hidden fees. Our pricing is 100% transparent and billed on per-employee monthly tiers in Indian Rupees (INR) with no long-term lock-in.',
    },
  ];

  const filteredFaqs = faqCategory === 'all' ? allFaqs : allFaqs.filter((f) => f.category === faqCategory);

  const formatINR = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#6D28D9] selection:text-white relative overflow-hidden">
      {/* Dynamic Background Ambient Colorful Glow Orbs (Subtle on Pure White Canvas) */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-br from-purple-200/40 via-indigo-100/30 to-pink-100/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-80 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-emerald-100/35 via-teal-100/25 to-sky-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[1600px] left-0 w-[600px] h-[600px] bg-gradient-to-tr from-amber-100/30 via-orange-100/20 to-purple-100/25 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Floating Announcement Banner */}
      <div className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#4F46E5] text-white text-[11px] font-semibold py-1.5 px-4 text-center shadow-xs flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
          <Sparkles className="w-3 h-3 text-amber-300" /> FY 2026-27 Ready
        </span>
        <span>100% Compliant with Revised Section 115BAC & Unified EPFO ECR Portal</span>
        <Link to="/login" className="underline hover:text-purple-200 transition-colors ml-2 hidden sm:inline">
          Try Live Demo &rarr;
        </Link>
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6D28D9] via-[#7C3AED] to-[#4F46E5] flex items-center justify-center text-white font-extrabold text-base shadow-[0_4px_12px_rgba(109,40,217,0.3)] group-hover:scale-105 transition-transform">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-extrabold tracking-tight text-slate-900 uppercase font-heading leading-tight flex items-center gap-1.5">
                ALIZE PAYROLL
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold">PRO</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide leading-none">
                Alize Software Services LLP
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#6D28D9] transition-colors whitespace-nowrap">
              Features
            </a>
            <a href="#calculator" className="hover:text-[#6D28D9] transition-colors whitespace-nowrap flex items-center gap-1 text-[#6D28D9]">
              <Calculator className="w-3.5 h-3.5" />
              Salary Calculator
            </a>
            <a href="#compliance" className="hover:text-[#6D28D9] transition-colors whitespace-nowrap">
              Statutory Engine
            </a>
            <a href="#roi" className="hover:text-[#6D28D9] transition-colors whitespace-nowrap">
              ROI Savings
            </a>
            <a href="#pricing" className="hover:text-[#6D28D9] transition-colors whitespace-nowrap">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#6D28D9] transition-colors whitespace-nowrap">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/dashboard')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="shadow-[0_4px_14px_rgba(109,40,217,0.25)] hover:shadow-[0_6px_20px_rgba(109,40,217,0.35)]"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="hidden sm:inline-flex text-slate-700 hover:text-[#6D28D9]"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] shadow-[0_4px_14px_rgba(109,40,217,0.3)] transition-all"
                >
                  Launch App
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================
          HERO SECTION: Dynamic, Colorful, High-Impact Fintech UI
          ======================================================== */}
      <section className="pt-14 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
        {/* Floating Animated Pill Badges */}
        <div className="hidden lg:flex items-center justify-between absolute inset-x-8 top-10 pointer-events-none">
          <div className="animate-float px-3 py-1.5 rounded-full bg-white/90 border border-emerald-200 shadow-[0_4px_16px_rgba(16,185,129,0.15)] flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>₹18.4L Disbursed in 3.4s</span>
          </div>
          <div className="animate-float-delayed px-3 py-1.5 rounded-full bg-white/90 border border-indigo-200 shadow-[0_4px_16px_rgba(79,70,229,0.15)] flex items-center gap-2 text-xs font-semibold text-indigo-800">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>100% EPFO ECR & ESIC Remitted</span>
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-200/80 text-[11px] font-bold text-[#6D28D9] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6D28D9] animate-spin" style={{ animationDuration: '6s' }} />
            <span>Built for High-Growth Indian Startups, Scaleups & Tech Enterprises</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-slate-900 font-heading leading-[1.08] uppercase">
            Smart Payroll. <br />
            <span className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#4F46E5] bg-clip-text text-transparent">
              Simplified Workforce.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Automate monthly salary runs, manage biometric attendance, compute statutory PF/ESI/PT/TDS, and generate official payslips from one unified enterprise platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/login')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] shadow-[0_6px_22px_rgba(109,40,217,0.35)] px-7 py-3 text-sm font-bold"
            >
              Start Free Trial
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="border-slate-300 hover:border-purple-300 hover:bg-purple-50/50 text-slate-800 text-sm font-semibold px-6 py-3 shadow-xs"
            >
              Explore Live Demo
            </Button>
          </div>

          {/* Social Proof Checklist */}
          <div className="flex flex-wrap items-center justify-center gap-5 pt-3 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5 bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Indian Statutory Compliant
            </span>
            <span className="flex items-center gap-1.5 bg-indigo-50/80 px-2.5 py-1 rounded-md border border-indigo-100 text-indigo-800">
              <Zap className="w-3.5 h-3.5 text-indigo-600" /> Direct Bank NEFT / RTGS Batches
            </span>
            <span className="flex items-center gap-1.5 bg-purple-50/80 px-2.5 py-1 rounded-md border border-purple-100 text-[#6D28D9]">
              <FileText className="w-3.5 h-3.5 text-[#6D28D9]" /> Form 16, EPFO ECR & ESIC Reports
            </span>
          </div>
        </div>

        {/* ========================================================
            HERO INTERACTIVE SALARY CALCULATOR WIDGET
            ======================================================== */}
        <div id="calculator" className="mt-14 rounded-2xl border-2 border-purple-100 bg-white shadow-[0_20px_50px_rgba(109,40,217,0.08)] overflow-hidden p-4 sm:p-7 relative">
          {/* Subtle Top Gradient Strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#6D28D9] via-[#4F46E5] to-[#059669] absolute top-0 left-0" />

          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pt-2">
            {/* Left: Interactive Controls */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#7C3AED] text-white flex items-center justify-center shadow-xs">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Interactive In-Hand Salary Engine
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Drag the CTC slider to preview live Indian payroll computation
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-[#6D28D9] uppercase font-mono">
                  Live Calculator
                </span>
              </div>

              {/* Annual CTC Slider */}
              <div className="space-y-2.5 p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                    Annual CTC (Cost to Company)
                  </label>
                  <span className="text-lg sm:text-xl font-extrabold font-mono text-[#6D28D9] tabular-nums">
                    {formatINR(annualCtc)} <span className="text-xs text-slate-400 font-normal">/ yr</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={300000}
                  max={4800000}
                  step={50000}
                  value={annualCtc}
                  onChange={(e) => setAnnualCtc(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6D28D9]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>₹3.0 LPA</span>
                  <span>₹12.0 LPA (Default)</span>
                  <span>₹24.0 LPA</span>
                  <span>₹48.0 LPA</span>
                </div>
              </div>

              {/* Quick Select Preset Buttons */}
              <div className="flex flex-wrap gap-2">
                {[600000, 900000, 1200000, 1800000, 2400000, 3600000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAnnualCtc(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      annualCtc === val
                        ? 'bg-[#6D28D9] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50/30'
                    }`}
                  >
                    ₹{(val / 100000).toFixed(1)} LPA
                  </button>
                ))}
              </div>

              {/* Tax Regime & State PT Selectors */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Income Tax Regime
                  </label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setTaxRegime('new')}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                        taxRegime === 'new'
                          ? 'bg-white text-[#6D28D9] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      New (115BAC)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaxRegime('old')}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                        taxRegime === 'old'
                          ? 'bg-white text-[#6D28D9] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Old Regime
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Professional Tax State
                  </label>
                  <select
                    value={statePt}
                    onChange={(e) => setStatePt(e.target.value as any)}
                    className="w-full h-[38px] px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                  >
                    <option value="Karnataka">Karnataka (₹200/mo)</option>
                    <option value="Maharashtra">Maharashtra (₹200/mo)</option>
                    <option value="Tamil Nadu">Tamil Nadu (Slab-based)</option>
                    <option value="Delhi">Delhi (No PT)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right: Real-time Live Salary Slip Preview */}
            <div className="w-full lg:w-1/2 rounded-xl bg-gradient-to-br from-[#FAF5FF] via-white to-[#F0FDF4] p-5 border border-purple-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Estimated Monthly Take-Home (Net Pay)
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 tabular-nums mt-0.5">
                    {formatINR(salaryBreakdown.takeHome)}
                    <span className="text-xs text-slate-500 font-normal ml-1">/ month</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-400">Gross Monthly</span>
                  <p className="text-sm font-bold font-mono text-slate-800 tabular-nums">
                    {formatINR(salaryBreakdown.monthlyGross)}
                  </p>
                </div>
              </div>

              {/* Colorful Multi-Segment Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-700">Salary Composition Ratio</span>
                  <span className="text-emerald-700 font-mono font-bold">
                    {Math.round((salaryBreakdown.takeHome / salaryBreakdown.monthlyGross) * 100)}% In-Hand
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${(salaryBreakdown.basic / salaryBreakdown.monthlyGross) * 100}%` }}
                    className="bg-[#6D28D9] transition-all duration-300"
                    title="Basic Pay (50%)"
                  />
                  <div
                    style={{ width: `${(salaryBreakdown.hra / salaryBreakdown.monthlyGross) * 100}%` }}
                    className="bg-[#4F46E5] transition-all duration-300"
                    title="HRA (25%)"
                  />
                  <div
                    style={{ width: `${(salaryBreakdown.specialAllowance / salaryBreakdown.monthlyGross) * 100}%` }}
                    className="bg-[#059669] transition-all duration-300"
                    title="Special Allowance"
                  />
                  <div
                    style={{ width: `${(salaryBreakdown.totalDeductions / salaryBreakdown.monthlyGross) * 100}%` }}
                    className="bg-[#E11D48] transition-all duration-300"
                    title="Deductions (EPF + PT + TDS)"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#6D28D9]" /> Basic: {formatINR(salaryBreakdown.basic)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#4F46E5]" /> HRA: {formatINR(salaryBreakdown.hra)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#059669]" /> Allowances: {formatINR(salaryBreakdown.specialAllowance)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#E11D48]" /> Deductions: {formatINR(salaryBreakdown.totalDeductions)}
                  </span>
                </div>
              </div>

              {/* Exact Earnings vs Deductions Table */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Monthly Earnings
                  </span>
                  <div className="flex justify-between text-slate-700">
                    <span>Basic (50%)</span>
                    <span className="font-mono font-semibold tabular-nums">{formatINR(salaryBreakdown.basic)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>HRA (25%)</span>
                    <span className="font-mono font-semibold tabular-nums">{formatINR(salaryBreakdown.hra)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Special Allowance</span>
                    <span className="font-mono font-semibold tabular-nums">{formatINR(salaryBreakdown.specialAllowance)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs space-y-1.5">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
                    Statutory Deductions
                  </span>
                  <div className="flex justify-between text-slate-700">
                    <span>EPF (12%)</span>
                    <span className="font-mono font-semibold tabular-nums text-rose-600">-{formatINR(salaryBreakdown.epf)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Professional Tax</span>
                    <span className="font-mono font-semibold tabular-nums text-rose-600">-{formatINR(salaryBreakdown.pt)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Estimated TDS</span>
                    <span className="font-mono font-semibold tabular-nums text-rose-600">-{formatINR(salaryBreakdown.monthlyTds)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Auto-synced with Indian Tax Act Section 115BAC
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login')}
                  rightIcon={<ArrowRight className="w-3 h-3" />}
                  className="bg-[#6D28D9] hover:bg-[#5B21B6] text-xs font-semibold"
                >
                  Configure in App
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          TRUST STRIP: Major Indian Metro Tech Hubs
          ======================================================== */}
      <section className="py-8 border-y border-slate-200 bg-gradient-to-r from-slate-50 via-purple-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4 font-heading">
            Trusted by modern teams across Bengaluru, Hyderabad, Mumbai, Pune, Chennai & Delhi NCR
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-xs font-bold tracking-wider text-slate-600 font-mono">
            <span className="hover:text-[#6D28D9] transition-colors">⚡ BENGALURU FINTECH LABS</span>
            <span className="hover:text-[#6D28D9] transition-colors">🛡️ HYDERABAD HEALTHCLOUD</span>
            <span className="hover:text-[#6D28D9] transition-colors">🚀 MUMBAI LOGISYS</span>
            <span className="hover:text-[#6D28D9] transition-colors">🏢 PUNE DEVSTUDIOS</span>
            <span className="hover:text-[#6D28D9] transition-colors">🌐 GURUGRAM SAAS CORP</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          DYNAMIC INTERACTIVE 5-IN-1 MODULE SHOWCASE
          ======================================================== */}
      <section id="features" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Interactive Platform Tour
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-heading">
              Everything Your HR & Payroll Teams Need
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Click the modules below to test our enterprise workflow engine in real-time.
            </p>
          </div>

          {/* Interactive Module Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab('payroll')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all flex items-center gap-2 ${
                activeTab === 'payroll'
                  ? 'bg-[#6D28D9] text-white shadow-[0_4px_14px_rgba(109,40,217,0.3)]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              7-Step Automated Payroll
            </button>

            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all flex items-center gap-2 ${
                activeTab === 'compliance'
                  ? 'bg-[#059669] text-white shadow-[0_4px_14px_rgba(5,150,105,0.3)]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              EPFO, ESIC & Statutory Engine
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all flex items-center gap-2 ${
                activeTab === 'attendance'
                  ? 'bg-[#4F46E5] text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Biometric Attendance & Leaves
            </button>

            <button
              onClick={() => setActiveTab('fnf')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all flex items-center gap-2 ${
                activeTab === 'fnf'
                  ? 'bg-[#D97706] text-white shadow-[0_4px_14px_rgba(217,119,6,0.3)]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Full & Final (F&F) Settlement
            </button>

            <button
              onClick={() => setActiveTab('ess')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all flex items-center gap-2 ${
                activeTab === 'ess'
                  ? 'bg-[#E11D48] text-white shadow-[0_4px_14px_rgba(225,29,72,0.3)]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Employee Self-Service (ESS)
            </button>
          </div>

          {/* Dynamic Tab Content Display */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            {activeTab === 'payroll' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-50 text-[#6D28D9] font-bold text-xs">
                    <Receipt className="w-3.5 h-3.5" /> 7-Stage Payroll Pipeline
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 font-heading">
                    Execute salary runs for 500+ employees in 4 minutes flat
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Say goodbye to messy Excel spreadsheets. Alize connects attendance records, unpaid leaves (LOP), approved reimbursement receipts, and tax declarations automatically.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#6D28D9] shrink-0" />
                      <span>Direct bank transfer batch generation (HDFC, ICICI, SBI, Axis NEFT/RTGS format).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#6D28D9] shrink-0" />
                      <span>1-click salary freeze with multi-stage approval audit log.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#6D28D9] shrink-0" />
                      <span>Automated email notification & payslip PDF push to all staff.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Button variant="primary" size="sm" onClick={() => navigate('/payroll')} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Explore Payroll Module
                    </Button>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3 font-mono text-xs shadow-inner">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-sans font-bold text-slate-800">
                    <span>Batch ALIZE/2026-10/RUN</span>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">86 / 86 Disbursed</span>
                  </div>
                  <div className="space-y-2 font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-sans">Vikram M. (Lead Architect)</span>
                      <span className="font-bold text-slate-900">₹2,09,500</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-sans">Priya S. (Senior Dev)</span>
                      <span className="font-bold text-slate-900">₹1,21,800</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-sans">Aarav I. (Software Eng)</span>
                      <span className="font-bold text-slate-900">₹61,900</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-600 font-sans">Sneha R. (HR Manager)</span>
                      <span className="font-bold text-slate-900">₹1,45,200</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-sm text-[#6D28D9]">
                    <span className="font-sans">Total Disbursed:</span>
                    <span>₹18,42,500</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Indian Statutory Accuracy
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 font-heading">
                    Zero penalties with automated EPFO ECR & ESIC returns
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Indian statutory compliance is notoriously complex. Alize takes the guesswork out by auto-generating ready-to-upload EPFO ECR files, ESIC monthly statements, and state-wise PT schedules.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>EPFO ₹15,000 wage ceiling & 12% calculation rules built-in.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>ESIC 0.75% (Employee) and 3.25% (Employer) contributions computed.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Quarterly Form 24Q TDS filing register & Form 16 Part A/B.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Button variant="primary" size="sm" onClick={() => navigate('/tax')} rightIcon={<ArrowRight className="w-3.5 h-3.5" />} className="bg-emerald-600 hover:bg-emerald-700">
                      View Compliance Engine
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-800">EPFO ECR Portal</span>
                    <p className="text-lg font-bold font-mono text-emerald-700 mt-1">₹3,42,800</p>
                    <span className="text-[10px] text-slate-500">TRRN 100% Verified</span>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200">
                    <span className="text-[10px] uppercase font-bold text-[#6D28D9]">ESIC Remittance</span>
                    <p className="text-lg font-bold font-mono text-[#6D28D9] mt-1">₹84,200</p>
                    <span className="text-[10px] text-slate-500">Challan Ready</span>
                  </div>
                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200">
                    <span className="text-[10px] uppercase font-bold text-indigo-700">Section 192 TDS</span>
                    <p className="text-lg font-bold font-mono text-indigo-700 mt-1">₹2,18,000</p>
                    <span className="text-[10px] text-slate-500">Form 24Q Register</span>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-700">Professional Tax</span>
                    <p className="text-lg font-bold font-mono text-amber-700 mt-1">₹17,200</p>
                    <span className="text-[10px] text-slate-500">Karnataka Slabs</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                    <CalendarCheck className="w-3.5 h-3.5" /> Biometric Muster Sync
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 font-heading">
                    Real-time biometric sync & multi-tier leave approval
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Track attendance with precision. Automatically convert missing punches or unpaid absences into Loss of Pay (LOP) days without manual calculations.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Biometric fingerprint & facial recognition device synchronization.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Casual, Sick, Privilege & Maternity leave policy allocations.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Manager approval hierarchy with real-time push notifications.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Button variant="primary" size="sm" onClick={() => navigate('/attendance')} rightIcon={<ArrowRight className="w-3.5 h-3.5" />} className="bg-indigo-600 hover:bg-indigo-700">
                      View Attendance Muster
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>Muster Roll · October 2026</span>
                    <span className="text-indigo-600">86 Employees Active</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px]">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                      <span key={i} className="font-bold text-slate-400">{d}</span>
                    ))}
                    {[
                      'P', 'P', 'P', 'P', 'P', 'WO', 'WO',
                      'P', 'P', 'P', 'WFH', 'P', 'WO', 'WO',
                      'P', 'L', 'P', 'P', 'P', 'WO', 'WO',
                      'P', 'P', 'P', 'P', 'P', 'WO', 'WO',
                    ].map((status, idx) => (
                      <span
                        key={idx}
                        className={`p-1.5 rounded font-bold ${
                          status === 'P'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'L'
                            ? 'bg-rose-100 text-rose-800'
                            : status === 'WFH'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fnf' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 text-amber-700 font-bold text-xs">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Full & Final Settlements
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 font-heading">
                    Automated Gratuity Act 1972 & Leave Encashment Calculator
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    When employees transition or exit, Alize computes statutory gratuity, unavailed earned leave encashment, asset recovery, and notice period offsets with legal precision.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Formula: (15 * Last Basic * Service Years) / 26 calculated instantly.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Asset clearance tracking & loan recovery balance deductions.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Official downloadable F&F statement & experience letter generation.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Button variant="primary" size="sm" onClick={() => navigate('/full-and-final')} rightIcon={<ArrowRight className="w-3.5 h-3.5" />} className="bg-amber-600 hover:bg-amber-700">
                      View F&F Module
                    </Button>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-amber-50/30 border border-amber-200 text-xs space-y-2.5 font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-amber-200 font-sans font-bold text-slate-800">
                    <span>F&F Settlement Statement</span>
                    <span className="text-amber-700">EMP0012 · Rajesh K.</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-amber-100">
                    <span className="text-slate-600 font-sans">Statutory Gratuity (5.4 Yrs)</span>
                    <span className="font-bold text-slate-900">₹1,55,769</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-amber-100">
                    <span className="text-slate-600 font-sans">Leave Encashment (14 Days)</span>
                    <span className="font-bold text-slate-900">₹36,400</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-amber-100">
                    <span className="text-slate-600 font-sans">Final Pro-rated Salary</span>
                    <span className="font-bold text-slate-900">₹42,500</span>
                  </div>
                  <div className="flex justify-between py-1 text-rose-600">
                    <span className="font-sans">Loan Recovery Offset</span>
                    <span className="font-bold">-₹15,000</span>
                  </div>
                  <div className="pt-2 border-t border-amber-200 flex justify-between font-bold text-sm text-slate-900 font-sans">
                    <span>Net Payable Settlement:</span>
                    <span className="text-emerald-700 font-mono">₹2,19,669</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ess' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rose-50 text-rose-700 font-bold text-xs">
                    <Smartphone className="w-3.5 h-3.5" /> Employee Self-Service (ESS)
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 font-heading">
                    Empower your workforce with self-service payslips & claims
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Eliminate routine questions sent to HR. Staff can download historical payslips, submit medical and travel bills with photo receipts, and view their TDS tax calculations.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Instant payslip PDF downloads with company seal & verification code.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Reimbursement claim submission with camera receipt upload.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Investment declaration (80C, 80D, HRA) submission & comparison.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Button variant="primary" size="sm" onClick={() => navigate('/payslips')} rightIcon={<ArrowRight className="w-3.5 h-3.5" />} className="bg-rose-600 hover:bg-rose-700">
                      View ESS Portal
                    </Button>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-rose-50/20 border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                    <span className="text-xs font-bold text-slate-800">Employee Portal · Mobile-Ready</span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Active Session
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Latest Slip</span>
                      <p className="font-bold text-slate-800 mt-0.5">Oct 2026 Payslip</p>
                      <span className="text-[10px] text-[#6D28D9] font-semibold flex items-center gap-1 mt-1">
                        <Download className="w-3 h-3" /> Download PDF
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Leave Balance</span>
                      <p className="font-bold text-slate-800 mt-0.5">18.5 Days</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">Casual + Earned</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          DYNAMIC ROI / TIME & COST SAVED CALCULATOR
          ======================================================== */}
      <section id="roi" className="py-16 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> High Return on Investment
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Calculate Your HR Time & Cost Savings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              See the direct impact of replacing manual payroll with Alize's automated engine.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 max-w-4xl mx-auto shadow-xs">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-slate-700 font-heading">
                  Your Current Workforce Size
                </label>
                <span className="text-xl font-bold font-mono text-[#6D28D9]">
                  {teamSize} Employees
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={5}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6D28D9]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>10 Staff</span>
                <span>100 Staff</span>
                <span>250 Staff</span>
                <span>500 Staff</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200">
                <span className="text-[11px] font-bold text-[#6D28D9] uppercase">HR Hours Saved / Mo</span>
                <p className="text-3xl font-extrabold font-mono text-slate-900 mt-1">
                  ~{roiMetrics.manualHours} hrs
                </p>
                <span className="text-[11px] text-slate-500">Eliminates Excel collation</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-700 uppercase">Payroll Run Duration</span>
                <p className="text-3xl font-extrabold font-mono text-emerald-600 mt-1">
                  &lt; {roiMetrics.alizeMinutes} mins
                </p>
                <span className="text-[11px] text-slate-500">From 4 days to 4 minutes</span>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
                <span className="text-[11px] font-bold text-indigo-700 uppercase">Estimated Annual ROI</span>
                <p className="text-3xl font-extrabold font-mono text-indigo-700 mt-1">
                  {formatINR(roiMetrics.annualSavings)}
                </p>
                <span className="text-[11px] text-slate-500">In HR bandwidth & zero fines</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          COLORFUL 6-FEATURE GRID WITH JEWEL GRADIENTS
          ======================================================== */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">
              Comprehensive Modules
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Built for Enterprise Precision
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Each component is engineered specifically for the Indian workforce regulatory ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Purple */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-[0_8px_30px_rgba(109,40,217,0.1)] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(109,40,217,0.25)] group-hover:scale-110 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 font-heading">
                Automated Payroll Runs
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Execute payroll in 7 structured steps. Prorate loss of pay (LOP), process approved reimbursements, and generate bank payment transfer batches.
              </p>
            </div>

            {/* Card 2: Emerald */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-[0_8px_30px_rgba(5,150,105,0.1)] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(5,150,105,0.25)] group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 font-heading">
                Statutory Compliance Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Auto-calculate EPFO 12% ceiling rules, ESIC contributions, State Professional Tax, and Section 192 TDS across both Old and New (115BAC) regimes.
              </p>
            </div>

            {/* Card 3: Indigo */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-[0_8px_30px_rgba(79,70,229,0.1)] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(79,70,229,0.25)] group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 font-heading">
                Attendance Muster & Leaves
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monthly muster roll with biometric synchronization. Track casual, sick, and privilege leaves with multi-tier approval workflows.
              </p>
            </div>

            {/* Card 4: Amber */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-[0_8px_30px_rgba(217,119,6,0.1)] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(217,119,6,0.25)] group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 font-heading">
                Digital Payslip Dispatch
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Publish official, printable salary slips with complete earnings and deductions tables directly to Employee Self-Service.
              </p>
            </div>

            {/* Card 5: Rose */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-300 hover:shadow-[0_8px_30px_rgba(225,29,72,0.1)] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(225,29,72,0.25)] group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 font-heading">
                Audit-Ready Regulatory Reports
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Export 12+ standard reports including monthly payroll registers, EPFO Form 3A/6A, ESIC monthly statements, and Form 16 / 24Q sheets.
              </p>
            </div>

            {/* Card 6: Cyan */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-cyan-300 hover:shadow-[0_8px_30px_rgba(8,145,178,0.1)] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(8,145,178,0.25)] group-hover:scale-110 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 font-heading">
                Role-Based Access Control
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Company Admin, HR Manager, Payroll Manager, Accountant, and Employee roles with granular access matrices across all modules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PRICING SECTION: Clean White Cards with Vibrant Accents
          ======================================================== */}
      <section id="pricing" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full bg-white">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">
            Simple, Transparent Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
            Honest Plans in Indian Rupees (INR)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            No hidden setup fees. Upgrade or adjust headcounts anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Starter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Starter</h3>
              <p className="text-xs text-slate-500 mt-0.5">Early-stage teams up to 25 staff</p>
              <div className="my-4">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">₹2,499</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Up to 25 Employees
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Payroll & Payslips
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Basic Attendance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Email Support
                </li>
              </ul>
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-5 font-semibold" onClick={() => navigate('/login')}>
              Choose Starter
            </Button>
          </div>

          {/* Professional (Featured Most Popular) */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#6D28D9] relative flex flex-col justify-between shadow-[0_8px_30px_rgba(109,40,217,0.12)]">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow-xs">
              Most Popular
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Professional</h3>
              <p className="text-xs text-slate-500 mt-0.5">Growing teams up to 100 staff</p>
              <div className="my-4">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-[#6D28D9]">
                  ₹5,999
                </span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6D28D9]" /> Up to 100 Employees
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6D28D9]" /> Full Statutory PF/ESI/PT
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6D28D9]" /> Tax Declarations Review
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6D28D9]" /> Reimbursements & Loans
                </li>
              </ul>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="w-full mt-6 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] font-bold shadow-[0_4px_14px_rgba(109,40,217,0.3)]"
              onClick={() => navigate('/login')}
            >
              Start Free Trial
            </Button>
          </div>

          {/* Business */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Business</h3>
              <p className="text-xs text-slate-500 mt-0.5">Scaling companies up to 300 staff</p>
              <div className="my-4">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">₹12,499</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Up to 300 Employees
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Full & Final Settlements
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Custom Salary Structures
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Priority Tele-Support
                </li>
              </ul>
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-5 font-semibold" onClick={() => navigate('/login')}>
              Choose Business
            </Button>
          </div>

          {/* Enterprise */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Enterprise</h3>
              <p className="text-xs text-slate-500 mt-0.5">Large enterprises & custom IT</p>
              <div className="my-4">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">Custom</span>
                <span className="text-xs text-slate-400"> quote</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Unlimited Employees
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ERP & Biometric API Sync
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dedicated Account Manager
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Custom SLA Guarantee
                </li>
              </ul>
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-5 font-semibold" onClick={() => navigate('/login')}>
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================
          DYNAMIC FILTERABLE FAQ ACCORDION SECTION
          ======================================================== */}
      <section id="faq" className="py-16 bg-[#F8FAFC] border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 space-y-2">
            <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">
              Answers & Guidance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear answers regarding Indian payroll compliance, statutory filings, and system capability.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'compliance', label: 'Statutory Compliance' },
              { id: 'payroll', label: 'Payroll Runs' },
              { id: 'ess', label: 'Employee Self-Service' },
              { id: 'pricing', label: 'Pricing & Trust' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFaqCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  faqCategory === cat.id
                    ? 'bg-[#6D28D9] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs hover:border-purple-200 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left text-xs font-semibold flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <span className="text-slate-900 font-heading text-sm">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#6D28D9] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          COLORFUL VIBRANT CTA BANNER ON WHITE CANVAS
          ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#4F46E5] text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(109,40,217,0.25)]">
          {/* Subtle Ambient Decorative Circles */}
          <div className="w-64 h-64 rounded-full bg-white/10 blur-2xl absolute -top-20 -left-20 pointer-events-none" />
          <div className="w-64 h-64 rounded-full bg-pink-500/20 blur-2xl absolute -bottom-20 -right-20 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
              <Award className="w-3.5 h-3.5 text-amber-300" /> Start in under 15 minutes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
              Ready to Upgrade Your Indian Payroll Experience?
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
              Join forward-thinking Indian businesses running error-free, automated salary runs with 100% compliance.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/login')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-white text-[#6D28D9] hover:bg-slate-100 font-bold px-6 shadow-md"
              >
                Start Free Trial
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => navigate('/dashboard')}
                className="text-white border border-white/30 hover:bg-white/10 font-semibold"
              >
                Explore Live Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CLEAN WHITE THEME ENTERPRISE FOOTER
          ======================================================== */}
      <footer className="mt-auto bg-white text-slate-600 text-xs py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm tracking-tight">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#7C3AED] flex items-center justify-center text-xs text-white font-extrabold shadow-xs">
                A
              </div>
              <span className="font-heading tracking-tight">ALIZE PAYROLL</span>
            </div>
            <p className="text-slate-600 max-w-sm text-xs leading-relaxed">
              Smart Payroll & Workforce Management Software designed for high-growth Indian enterprises by {COMPANY_INFO.name}.
            </p>
            <p className="text-slate-500 text-[11px]">
              {COMPANY_INFO.address}, {COMPANY_INFO.city}, {COMPANY_INFO.state} - {COMPANY_INFO.pincode}
            </p>
          </div>

          <div>
            <h5 className="text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-3 font-heading">Product</h5>
            <ul className="space-y-2">
              <li><Link to="/payroll" className="hover:text-[#6D28D9] transition-colors">Payroll Engine</Link></li>
              <li><Link to="/attendance" className="hover:text-[#6D28D9] transition-colors">Attendance Muster</Link></li>
              <li><Link to="/leaves" className="hover:text-[#6D28D9] transition-colors">Leave Management</Link></li>
              <li><Link to="/payslips" className="hover:text-[#6D28D9] transition-colors">Payslip Generator</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-3 font-heading">Compliance</h5>
            <ul className="space-y-2">
              <li><Link to="/tax" className="hover:text-[#6D28D9] transition-colors">EPFO & ESIC Returns</Link></li>
              <li><Link to="/tax/declarations" className="hover:text-[#6D28D9] transition-colors">Section 115BAC (TDS)</Link></li>
              <li><Link to="/reports" className="hover:text-[#6D28D9] transition-colors">Form 16 / 24Q Register</Link></li>
              <li><Link to="/full-and-final" className="hover:text-[#6D28D9] transition-colors">F&F Settlements</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-3 font-heading">Company</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#6D28D9] transition-colors">About Alize</a></li>
              <li><a href="#" className="hover:text-[#6D28D9] transition-colors">Security & Trust</a></li>
              <li><a href="#" className="hover:text-[#6D28D9] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#6D28D9] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
          <p className="font-mono">CIN: {COMPANY_INFO.cin} · PAN: {COMPANY_INFO.pan} · TAN: {COMPANY_INFO.tan}</p>
        </div>
      </footer>
    </div>
  );
};
