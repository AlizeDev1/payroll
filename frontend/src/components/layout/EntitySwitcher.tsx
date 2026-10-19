import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  ChevronDown,
  Check,
  Globe,
  Layers,
  BarChart3,
} from 'lucide-react';
import { useEntity } from '../../context/EntityContext';
import { useToast } from '../../context/ToastContext';

export const EntitySwitcher: React.FC = () => {
  const { activeEntity, entities, switchEntity, setIsConsolidatedModalOpen } = useEntity();
  const { success } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/50 transition-all text-xs group"
        title="Switch Corporate Entity / Subsidiary"
      >
        <div className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
          <Building2 className="w-3 h-3" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 group-hover:text-purple-700 truncate max-w-[140px] block font-heading">
              {activeEntity?.name ? activeEntity.name.split(' ').slice(0, 2).join(' ') : 'Corporate Entity'}
            </span>
            <span className="text-[10px] text-purple-700 bg-purple-100/70 font-bold px-1.5 py-0.2 rounded font-mono">
              {activeEntity?.isHQ ? 'HQ' : (activeEntity?.code?.split('-')[1] || activeEntity?.code || 'SUB')}
            </span>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-150">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 font-heading block">
                Corporate Subsidiaries
              </span>
              <span className="text-[10px] text-slate-500">
                Select entity workspace context
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              {entities.length} Entities
            </span>
          </div>

          <div className="p-1.5 space-y-1 max-h-64 overflow-y-auto">
            {entities.map((ent) => {
              const isSelected = ent.id === activeEntity.id;

              return (
                <button
                  key={ent.id}
                  onClick={() => {
                    switchEntity(ent.id);
                    setIsOpen(false);
                    success('Corporate Context Switched', `Active workspace set to ${ent.name}.`);
                  }}
                  className={`w-full p-2 text-left rounded-lg transition-all flex items-start justify-between text-xs ${
                    isSelected
                      ? 'bg-purple-50/70 border border-purple-200 text-purple-900'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold truncate block">{ent.name}</span>
                      {ent.isHQ && (
                        <span className="text-[9px] bg-purple-600 text-white font-bold px-1 py-0.2 rounded">
                          HQ
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                      {ent.location} · {ent.employeeCount} Staff
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-2 bg-slate-50/80 border-t border-slate-200">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsConsolidatedModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 hover:bg-purple-100/60 rounded-lg transition-colors border border-purple-200"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Consolidated CFO Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
