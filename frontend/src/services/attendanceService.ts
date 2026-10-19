import { EmployeeMonthlyAttendance } from '../types';
import { generateMonthlyAttendance } from '../data/mockData';
import { apiClient } from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
let attendanceData: EmployeeMonthlyAttendance[] = generateMonthlyAttendance();

export const attendanceService = {
  async getMonthlyAttendance(month = '2026-10'): Promise<EmployeeMonthlyAttendance[]> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<EmployeeMonthlyAttendance[]>('/attendance', { month });
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 80));
    return [...attendanceData];
  },

  async markAttendance(
    employeeId: string,
    day: number,
    status: 'P' | 'A' | 'L' | 'H' | 'WFH' | 'HD'
  ): Promise<boolean> {
    if (!USE_MOCK) {
      try {
        await apiClient.post('/attendance/mark', {
          employeeId,
          date: `2026-10-${String(day).padStart(2, '0')}`,
          dayNumber: day,
          status,
        });
        return true;
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 80));
    const empRecord = attendanceData.find((a) => a.employeeId === employeeId);
    if (empRecord) {
      empRecord.days[day] = status;
      return true;
    }
    return false;
  },

  async getAttendanceStats(): Promise<{
    present: number;
    absent: number;
    late: number;
    halfDay: number;
    onLeave: number;
    wfh: number;
    total: number;
    presentPercentage: number;
  }> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<{
          present: number;
          absent: number;
          late: number;
          halfDay: number;
          onLeave: number;
          wfh: number;
          total: number;
          presentPercentage: number;
        }>('/attendance/stats');
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 40));
    return {
      present: 79,
      absent: 2,
      late: 3,
      halfDay: 1,
      onLeave: 5,
      wfh: 4,
      total: 86,
      presentPercentage: 91.8,
    };
  },
};
