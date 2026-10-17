import { EmployeeMonthlyAttendance } from '../types';
import { generateMonthlyAttendance } from '../data/mockData';

let attendanceData: EmployeeMonthlyAttendance[] = generateMonthlyAttendance();

export const attendanceService = {
  async getMonthlyAttendance(month = '2026-10'): Promise<EmployeeMonthlyAttendance[]> {
    await new Promise((res) => setTimeout(res, 80));
    return [...attendanceData];
  },

  async markAttendance(employeeId: string, day: number, status: 'P' | 'A' | 'L' | 'H' | 'WFH' | 'HD'): Promise<boolean> {
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
