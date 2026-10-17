import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  CheckCircle,
  UserX,
  Clock,
  CalendarDays,
  Laptop,
  Download,
  Upload,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Zap,
  CheckCircle2,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { GeofenceAttendanceView } from '../components/attendance/GeofenceAttendanceView';
import { attendanceService } from '../services/attendanceService';
import { EmployeeMonthlyAttendance, AttendanceStatus, EmployeeOvertimeRecord } from '../types';
import { MOCK_OVERTIME_RECORDS } from '../data/mockData';
import { useToast } from '../context/ToastContext';

export const AttendancePage: React.FC = () => {
  const { success } = useToast();
  const [attendanceList, setAttendanceList] = useState<EmployeeMonthlyAttendance[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'calendar' | 'overtime' | 'geofence'>('table');
  const [overtimeRecords, setOvertimeRecords] = useState<EmployeeOvertimeRecord[]>([...MOCK_OVERTIME_RECORDS]);
  const [selectedDay, setSelectedDay] = useState(12); // Current day in Oct
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [markEmployeeId, setMarkEmployeeId] = useState('');
  const [markStatus, setMarkStatus] = useState<AttendanceStatus>('P');

  useEffect(() => {
    attendanceService.getMonthlyAttendance().then(setAttendanceList);
  }, []);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'P':
        return 'bg-emerald-50 text-[#15803D] dark:bg-emerald-950/60 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/60';
      case 'A':
        return 'bg-red-50 text-[#B91C1C] dark:bg-red-950/60 dark:text-red-300 font-bold border border-red-200 dark:border-red-800/60';
      case 'L':
        return 'bg-amber-50 text-[#B45309] dark:bg-amber-950/60 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800/60';
      case 'H':
        return 'bg-purple-50 text-[#6D28D9] dark:bg-purple-950/60 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800/60';
      case 'WFH':
        return 'bg-sky-50 text-[#0369A1] dark:bg-sky-950/60 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800/60';
      case 'WO':
        return 'bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500 font-medium border border-slate-200 dark:border-slate-800';
      case 'HD':
        return 'bg-orange-50 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 font-bold border border-orange-200 dark:border-orange-800/60';
      default:
        return 'bg-slate-50 text-slate-400 border border-slate-200';
    }
  };

  const handleMarkSubmit = async () => {
    if (!markEmployeeId) return;
    await attendanceService.markAttendance(markEmployeeId, selectedDay, markStatus as any);
    setAttendanceList((prev) =>
      prev.map((emp) =>
        emp.employeeId === markEmployeeId
          ? { ...emp, days: { ...emp.days, [selectedDay]: markStatus } }
          : emp
      )
    );
    success('Attendance Updated', `Marked ${markStatus} for day ${selectedDay}.`);
    setIsMarkModalOpen(false);
  };

  const totalStaff = attendanceList.length;
  const presentCount = attendanceList.filter((a) => (a.days[selectedDay] || 'P') === 'P').length;
  const absentCount = attendanceList.filter((a) => a.days[selectedDay] === 'A').length;
  const leaveCount = attendanceList.filter((a) => a.days[selectedDay] === 'L').length;
  const wfhCount = attendanceList.filter((a) => a.days[selectedDay] === 'WFH').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Muster Roll"
        subtitle="Daily biometric logs, shift scheduling, and statutory Form 25 muster register."
        breadcrumb={['Alize Software Services', 'Workforce', 'Attendance']}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => success('Biometric Sync', `Synchronized ${presentCount} biometric logs from Bellandur gateway.`)}
              leftIcon={<Upload className="w-3.5 h-3.5" />}
            >
              Sync Biometrics
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => success('Exported', 'Downloaded Form 25 Attendance Muster Roll (.xlsx)')}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Muster Report
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setViewMode('geofence')}
              leftIcon={<MapPin className="w-3.5 h-3.5" />}
            >
              ⚡ Geofence Mobile Punch
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMarkEmployeeId(attendanceList[0]?.employeeId || '');
                setIsMarkModalOpen(true);
              }}
              leftIcon={<UserCheck className="w-3.5 h-3.5" />}
            >
              Mark Attendance
            </Button>
          </>
        }
      />

      {/* Attendance KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Present Today"
          value={totalStaff > 0 ? presentCount.toString() : '0'}
          subValue={totalStaff > 0 ? `${((presentCount / totalStaff) * 100).toFixed(1)}%` : '0%'}
          isPositive={true}
          icon={CheckCircle}
          description="In office"
        />
        <StatCard
          title="Absent"
          value={totalStaff > 0 ? absentCount.toString() : '0'}
          subValue={totalStaff > 0 ? `${((absentCount / totalStaff) * 100).toFixed(1)}%` : '0%'}
          isPositive={false}
          icon={UserX}
          description="Unexcused"
        />
        <StatCard
          title="Late Arrival"
          value={totalStaff > 0 ? Math.min(3, totalStaff).toString() : '0'}
          subValue="Staff"
          icon={Clock}
          description=">15m grace"
        />
        <StatCard
          title="Half Day"
          value={totalStaff > 0 ? '1' : '0'}
          subValue="Staff"
          icon={Clock}
          description="First half"
        />
        <StatCard
          title="On Leave"
          value={totalStaff > 0 ? leaveCount.toString() : '0'}
          subValue={totalStaff > 0 ? `${((leaveCount / totalStaff) * 100).toFixed(1)}%` : '0%'}
          icon={CalendarDays}
          description="Approved leave"
        />
        <StatCard
          title="Work From Home"
          value={totalStaff > 0 ? wfhCount.toString() : '0'}
          subValue={totalStaff > 0 ? `${((wfhCount / totalStaff) * 100).toFixed(1)}%` : '0%'}
          isPositive={true}
          icon={Laptop}
          description="Remote approved"
        />
      </div>

      {/* Control Toolbar */}
      <div className="p-3.5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
            October 2026 Muster Register
          </span>
          <span className="text-xs text-slate-400">· 31 Days (21 Working, 9 Weekend Offs, 1 Holiday)</span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-0.5 bg-[#F8FAFC] dark:bg-slate-800 rounded-lg border border-[#E5E7EB] dark:border-[#1F2937]">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.05)]'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            31-Day Muster Table
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.05)]'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Monthly Calendar
          </button>
          <button
            onClick={() => setViewMode('overtime')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'overtime'
                ? 'bg-white dark:bg-[#111827] text-[#6D28D9] dark:text-purple-400 font-bold shadow-[0_1px_2px_rgba(15,23,42,0.05)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#6D28D9]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Overtime ({overtimeRecords.length})
          </button>
          <button
            onClick={() => setViewMode('geofence')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'geofence'
                ? 'bg-white text-emerald-700 font-bold shadow-[0_1px_2px_rgba(15,23,42,0.05)]'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            Geofence & Selfie Clock-In
          </button>
        </div>
      </div>

      {/* View 1: 31-Day Muster Table */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] overflow-hidden">
          {/* Status Legend */}
          <div className="px-3.5 py-2.5 bg-[#F8FAFC] dark:bg-slate-800/40 border-b border-[#E5E7EB] dark:border-[#1F2937] flex items-center gap-3.5 flex-wrap text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            <span className="font-bold text-slate-900 dark:text-slate-100">Legend:</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded text-center leading-4 bg-emerald-50 text-[#15803D] border border-emerald-200 font-bold text-[10px]">P</span> Present</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded text-center leading-4 bg-red-50 text-[#B91C1C] border border-red-200 font-bold text-[10px]">A</span> Absent</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded text-center leading-4 bg-amber-50 text-[#B45309] border border-amber-200 font-bold text-[10px]">L</span> Leave</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded text-center leading-4 bg-sky-50 text-[#0369A1] border border-sky-200 font-bold text-[10px]">WFH</span> WFH</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded text-center leading-4 bg-purple-50 text-[#6D28D9] border border-purple-200 font-bold text-[10px]">H</span> Holiday</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded text-center leading-4 bg-slate-50 text-slate-500 border border-slate-200 font-bold text-[10px]">WO</span> Week Off</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 border-b border-[#E5E7EB] dark:border-[#1F2937] text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                  <th className="py-2.5 px-3 text-left sticky left-0 bg-[#F8FAFC] dark:bg-slate-800 z-10 min-w-[170px]">
                    Employee Name
                  </th>
                  {daysInMonth.map((d) => (
                    <th key={d} className="py-2 px-1 min-w-[26px] font-mono tabular-nums text-[11px]">
                      {d}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-right sticky right-0 bg-[#F8FAFC] dark:bg-slate-800 z-10 min-w-[65px]">
                    Total P
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {attendanceList.map((row) => (
                  <tr key={row.employeeId} className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-left sticky left-0 bg-white dark:bg-[#111827] z-10 border-r border-[#E5E7EB] dark:border-[#1F2937]">
                      <div className="flex items-center gap-2">
                        <img
                          src={row.avatar}
                          alt={row.employeeName}
                          className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div className="truncate min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate text-[11px]">
                            {row.employeeName}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">{row.employeeId}</span>
                        </div>
                      </div>
                    </td>

                    {daysInMonth.map((day) => {
                      const st = row.days[day] || 'WO';
                      return (
                        <td key={day} className="py-1 px-0.5">
                          <span
                            className={`inline-block w-5 h-5 rounded text-center leading-5 text-[10px] ${getStatusColor(
                              st
                            )}`}
                          >
                            {st}
                          </span>
                        </td>
                      );
                    })}

                    <td className="py-2 px-3 text-right sticky right-0 bg-white dark:bg-[#111827] z-10 border-l border-[#E5E7EB] dark:border-[#1F2937] font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {row.presentDays}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : viewMode === 'calendar' ? (
        /* View 2: Monthly Calendar */
        <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-[#1F2937]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
              October 2026 Facility Calendar
            </h3>
            <span className="text-xs text-slate-500">Bellandur Technology Center Hub</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="font-bold text-slate-400 uppercase text-[11px] py-1">
                {d}
              </div>
            ))}

            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`empty-${i}`} className="p-3 bg-[#F8FAFC]/40 dark:bg-slate-900/20 rounded-lg border border-transparent" />
            ))}

            {daysInMonth.map((d) => {
              const isWeekend = (d + 3) % 7 === 0 || (d + 3) % 7 === 6;
              const isHoliday = d === 2; // Gandhi Jayanti
              const isSelected = selectedDay === d;

              return (
                <div
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-150 min-h-[72px] flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#6D28D9] bg-[#F5F3FF]/60 dark:bg-purple-950/40 ring-1 ring-[#6D28D9]'
                      : 'border-[#E5E7EB] dark:border-[#1F2937] hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#111827]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">{d}</span>
                    {isHoliday && (
                      <span className="text-[9px] font-bold text-[#6D28D9] bg-purple-50 px-1 rounded">Holiday</span>
                    )}
                    {isWeekend && !isHoliday && (
                      <span className="text-[9px] font-medium text-slate-400">Off</span>
                    )}
                  </div>

                  {!isWeekend && !isHoliday && (
                    <div className="text-[10px] space-y-0.5 text-slate-500 font-mono">
                      <div className="text-[#15803D] font-semibold">75 P</div>
                      <div className="text-slate-400">4 WFH · 5 L</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : viewMode === 'overtime' ? (
        /* View 3: Automated Overtime Engine */
        <div className="space-y-4">
          {/* Overtime KPI Header */}
          <div className="p-5 bg-gradient-to-r from-amber-50/70 via-purple-50/40 to-white border border-amber-200/80 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Automated Overtime & Shift Allowance Engine
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 font-mono">
                  Biometric Punch Synced
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Hours worked &gt; 9 hrs/day calculated at <strong>1.5x regular base wage</strong>; weekend/holiday shifts computed at <strong>2.0x base wage</strong>.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                success('Overtime Synced to Payroll', '₹80,357 approved overtime appended to October 2026 payroll run.')
              }
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="bg-[#6D28D9] hover:bg-[#5B21B6] whitespace-nowrap text-xs font-semibold"
            >
              Sync OT to October Payroll
            </Button>
          </div>

          {/* Overtime Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse financial-table text-xs">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Regular Hours</th>
                    <th>Biometric OT Hours</th>
                    <th>Hourly Base Rate</th>
                    <th>OT Multiplier</th>
                    <th className="text-right">Total OT Payout</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {overtimeRecords.map((rec) => (
                    <tr key={rec.employeeId} className="hover:bg-slate-50 transition-colors">
                      <td>
                        <span className="font-semibold text-slate-900 block">{rec.employeeName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{rec.employeeId}</span>
                      </td>
                      <td className="text-slate-600">{rec.department}</td>
                      <td className="font-mono text-slate-700">{rec.regularHours} hrs</td>
                      <td>
                        <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          +{rec.overtimeHours} hrs OT
                        </span>
                      </td>
                      <td className="font-mono font-semibold text-slate-800">₹{rec.hourlyRate}/hr</td>
                      <td>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {rec.multiplier}x Base Rate
                        </span>
                      </td>
                      <td className="text-right font-mono font-bold text-emerald-700 text-sm">
                        ₹{rec.totalOtPay.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {rec.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => success('OT Record Verified', `Confirmed ${rec.overtimeHours} OT hours for ${rec.employeeName}.`)}
                          className="text-[11px] font-semibold text-[#6D28D9] hover:underline"
                        >
                          Verify Hours
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* View 4: Geofence & Selfie-Verified Attendance */
        <GeofenceAttendanceView />
      )}

      {/* Manual Mark Attendance Modal */}
      <Modal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        title="Override Attendance Record"
        description="Manually record biometric reconciliation log for Indian muster roll."
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsMarkModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleMarkSubmit}>
              Save Attendance
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Employee
            </label>
            <select
              value={markEmployeeId}
              onChange={(e) => setMarkEmployeeId(e.target.value)}
              className="w-full px-3 h-[42px] rounded-lg border border-[#D1D5DB] dark:border-[#374151] bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              {attendanceList.map((e) => (
                <option key={e.employeeId} value={e.employeeId}>
                  {e.employeeName} ({e.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Date (October 2026)
            </label>
            <input
              type="number"
              min={1}
              max={31}
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="w-full px-3 h-[42px] rounded-lg border border-[#D1D5DB] dark:border-[#374151] bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Attendance Status
            </label>
            <select
              value={markStatus}
              onChange={(e) => setMarkStatus(e.target.value as AttendanceStatus)}
              className="w-full px-3 h-[42px] rounded-lg border border-[#D1D5DB] dark:border-[#374151] bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="P">P - Present (Full Day)</option>
              <option value="A">A - Absent (Loss of Pay)</option>
              <option value="WFH">WFH - Work From Home</option>
              <option value="HD">HD - Half Day (0.5 LOP)</option>
              <option value="L">L - Approved Paid Leave</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};
