import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { documentService } from '../services/documentService';
import { SystemNotification } from '../types';
import { useToast } from '../context/ToastContext';

export const NotificationsPage: React.FC = () => {
  const { success } = useToast();
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [activeType, setActiveType] = useState<string>('All');

  useEffect(() => {
    documentService.getNotifications().then(setNotifications);
  }, []);

  const handleMarkAll = async () => {
    await documentService.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    success('Notifications Marked as Read', 'All alerts updated.');
  };

  const handleMarkSingle = async (id: string) => {
    await documentService.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const types = ['All', 'Payroll', 'Leave', 'Attendance', 'Reimbursement', 'Document', 'System'];

  const filteredNotifications = notifications.filter(
    (n) => activeType === 'All' || n.type === activeType
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Center"
        subtitle="Real-time audit alerts, compliance deadlines, leave submissions, and disbursement receipts."
        breadcrumb={['Overview', 'System', 'Notifications']}
        actions={
          unreadCount > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleMarkAll}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Mark All as Read ({unreadCount})
            </Button>
          ) : undefined
        }
      />

      {/* Type Filter Buttons */}
      <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-[8px] border border-slate-200 dark:border-slate-700/60 w-fit flex-wrap">
        {types.map((t) => {
          const typeCount =
            t === 'All'
              ? notifications.length
              : notifications.filter((n) => n.type === t).length;
          return (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-[6px] transition-colors flex items-center gap-1.5 ${
                activeType === t
                  ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>{t}</span>
              <span className="text-[10px] text-slate-400 font-mono">({typeCount})</span>
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] shadow-[0_1px_3px_rgba(15,23,42,0.04)] divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                !notif.read ? 'bg-purple-50/20 dark:bg-purple-950/20' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5 border ${
                    !notif.read
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/60 text-[#6D28D9] dark:text-purple-300'
                      : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-500'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {notif.title}
                    </h4>
                    <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 uppercase">
                      {notif.type}
                    </span>
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono tabular-nums">
                    {notif.timestamp}
                  </p>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => handleMarkSingle(notif.id)}
                  className="text-[11px] font-medium text-[#6D28D9] dark:text-purple-400 hover:underline shrink-0 pt-0.5"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        ) : (
          <EmptyState
            title="No Notifications in This Filter"
            description="You are completely up to date. No new audit or system alerts found."
            actionLabel="View All"
            onAction={() => setActiveType('All')}
          />
        )}
      </div>
    </div>
  );
};
