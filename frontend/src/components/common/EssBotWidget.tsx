import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Download,
  Calendar,
  FileText,
  DollarSign,
  CheckCircle2,
  Clock,
  ChevronDown,
  Minimize2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  card?: 'payslip' | 'leave' | 'tax' | 'reimbursement';
}

export const EssBotWidget: React.FC = () => {
  const { success } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [platform, setPlatform] = useState<'whatsapp' | 'slack'>('whatsapp');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: '👋 Hello Rahul! Welcome to Alize ESS Assistant. How can I assist you with your payroll & leaves today?',
      timestamp: '10:42 AM',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    // Bot Response Logic
    setTimeout(() => {
      const lower = query.toLowerCase();
      let botReply: Message = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (lower.includes('payslip') || lower.includes('salary') || lower.includes('pay slip')) {
        botReply.text = 'Here is your salary slip for October 2026. Gross: ₹85,000 | Net Disbursed: ₹73,950.';
        botReply.card = 'payslip';
      } else if (lower.includes('leave') || lower.includes('holiday') || lower.includes('balance') || lower.includes('vacation')) {
        botReply.text = 'You have a total of 18 available leaves remaining for the 2026 calendar year.';
        botReply.card = 'leave';
      } else if (lower.includes('tax') || lower.includes('regime') || lower.includes('tds') || lower.includes('115bac')) {
        botReply.text = 'Your current election is New Tax Regime (Section 115BAC). Estimated monthly TDS: ₹6,450.';
        botReply.card = 'tax';
      } else if (lower.includes('reimbursement') || lower.includes('claim') || lower.includes('expense') || lower.includes('bill')) {
        botReply.text = 'Your latest claim #CLM-2026-081 (Uber Travel ₹1,450) was Approved and queued for disbursement.';
        botReply.card = 'reimbursement';
      } else {
        botReply.text = `I can help you retrieve payslips, check remaining leave balances, simulate tax regime deductions, or track reimbursement claims. Choose an option below!`;
      }

      setMessages((prev) => [...prev, botReply]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all border border-purple-400/40 group"
          title="Open WhatsApp & Slack ESS Bot"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <MessageSquare className="w-4 h-4 text-white group-hover:rotate-6 transition-transform" />
          <span className="text-xs font-bold tracking-wide">
            WhatsApp & Slack ESS Bot
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs">
            AI Live
          </span>
        </button>
      )}

      {/* Expanded Messaging Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-full sm:w-[380px] h-[540px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className={`p-3.5 ${
            platform === 'whatsapp'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white'
              : 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white'
          } transition-colors flex items-center justify-between`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-sm text-white border border-white/30">
                {platform === 'whatsapp' ? '💬' : '⚡'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold font-heading">
                    {platform === 'whatsapp' ? 'Alize WhatsApp ESS' : 'Alize Slack Assistant'}
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                </div>
                <p className="text-[10px] text-white/80">
                  Logged in as: Rahul Sharma (EMP-001)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Platform Switcher */}
              <div className="flex bg-black/20 rounded-lg p-0.5 border border-white/20 text-[10px] font-bold">
                <button
                  onClick={() => setPlatform('whatsapp')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    platform === 'whatsapp' ? 'bg-white text-emerald-800' : 'text-white/80 hover:text-white'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => setPlatform('slack')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    platform === 'slack' ? 'bg-white text-purple-900' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Slack
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-md transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Pills */}
          <div className="p-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleSendMessage('Send my October payslip')}
              className="shrink-0 px-2.5 py-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-full font-medium transition-colors"
            >
              📄 Oct Payslip
            </button>
            <button
              onClick={() => handleSendMessage('Check remaining leave balances')}
              className="shrink-0 px-2.5 py-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-full font-medium transition-colors"
            >
              🏖️ Leaves
            </button>
            <button
              onClick={() => handleSendMessage('What is my TDS deduction this month?')}
              className="shrink-0 px-2.5 py-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-full font-medium transition-colors"
            >
              💰 TDS Tax
            </button>
            <button
              onClick={() => handleSendMessage('Status of my latest reimbursement')}
              className="shrink-0 px-2.5 py-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-full font-medium transition-colors"
            >
              🧾 Expense
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#FAFAFA] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs ${
                    m.sender === 'user'
                      ? platform === 'whatsapp'
                        ? 'bg-[#DCF8C6] text-slate-900 rounded-tr-none'
                        : 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {/* Dynamic Card: Payslip */}
                  {m.card === 'payslip' && (
                    <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[11px]">
                      <div className="flex justify-between items-center font-bold text-slate-900">
                        <span>Payslip: October 2026</span>
                        <span className="font-mono text-emerald-600">₹73,950</span>
                      </div>
                      <div className="flex justify-between text-slate-500 font-mono text-[10px]">
                        <span>Deductions: PF ₹1,800 + PT ₹200 + TDS ₹6,450</span>
                      </div>
                      <button
                        onClick={() => success('Downloaded', 'October 2026 Payslip PDF downloaded.')}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-purple-600 text-white rounded-lg font-bold text-[10px] hover:bg-purple-700 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        Download Secure PDF
                      </button>
                    </div>
                  )}

                  {/* Dynamic Card: Leave */}
                  {m.card === 'leave' && (
                    <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-3 gap-1.5 text-center text-[11px]">
                      <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                        <span className="block text-slate-400 text-[9px] uppercase font-bold">Privilege</span>
                        <span className="font-mono font-bold text-slate-800 text-sm">12</span>
                      </div>
                      <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                        <span className="block text-slate-400 text-[9px] uppercase font-bold">Casual</span>
                        <span className="font-mono font-bold text-slate-800 text-sm">4</span>
                      </div>
                      <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                        <span className="block text-slate-400 text-[9px] uppercase font-bold">Sick</span>
                        <span className="font-mono font-bold text-slate-800 text-sm">2</span>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Card: Tax */}
                  {m.card === 'tax' && (
                    <div className="mt-2.5 p-2.5 bg-purple-50/60 border border-purple-200 rounded-xl text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Active Regime:</span>
                        <span className="font-bold text-purple-700">115BAC New</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">FY 2026-27 Projected Tax:</span>
                        <span className="font-mono font-bold text-slate-900">₹77,400</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Remaining Installments:</span>
                        <span className="font-mono text-slate-700">5 Months</span>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Card: Reimbursement */}
                  {m.card === 'reimbursement' && (
                    <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-800">Claim #CLM-2026-081</span>
                        <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[9px] font-bold">
                          Approved
                        </span>
                      </div>
                      <p className="text-emerald-700 font-mono text-[10px]">
                        Amount: ₹1,450 · Scheduled in Oct Payroll run
                      </p>
                    </div>
                  )}

                  <span className={`block text-[9px] text-right mt-1 ${
                    m.sender === 'user'
                      ? platform === 'whatsapp'
                        ? 'text-slate-500'
                        : 'text-white/70'
                      : 'text-slate-400'
                  }`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Type a query or command...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-600 text-slate-800"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className={`p-2 rounded-xl transition-all ${
                inputMessage.trim()
                  ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-xs'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
