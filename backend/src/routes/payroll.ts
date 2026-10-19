import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const payrollRouter = Router();

// GET payroll summary
payrollRouter.get('/summary', async (req: Request, res: Response) => {
  try {
    const month = (req.query.month as string) || 'October 2026';
    let summary = await prisma.payrollRun.findFirst({
      where: { month },
      orderBy: { createdAt: 'desc' },
    });

    if (!summary) {
      // Return latest or create default
      summary = await prisma.payrollRun.findFirst({
        orderBy: { createdAt: 'desc' },
      });
    }

    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET payroll items with optional filters
payrollRouter.get('/items', async (req: Request, res: Response) => {
  try {
    const { payrollRunId, status, department } = req.query as {
      payrollRunId?: string;
      status?: string;
      department?: string;
    };

    const where: any = {};
    if (payrollRunId) where.payrollRunId = payrollRunId;
    if (status && status !== 'All') where.status = status;
    if (department && department !== 'All') where.department = department;

    const items = await prisma.payrollItem.findMany({
      where,
      orderBy: { employeeName: 'asc' },
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE payroll item
payrollRouter.patch('/items/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await prisma.payrollItem.update({
      where: { id },
      data: updates,
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Indian Currency in Words Utility
function convertNumberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(Math.abs(num));
  if (n === 0) return 'Zero Rupees Only';

  function chunkToWords(val: number): string {
    let str = '';
    if (val >= 100) {
      str += ones[Math.floor(val / 100)] + ' Hundred ';
      val %= 100;
    }
    if (val >= 20) {
      str += tens[Math.floor(val / 10)] + ' ';
      val %= 10;
    }
    if (val > 0) {
      str += ones[val] + ' ';
    }
    return str;
  }

  let words = '';
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const remainder = n % 1000;

  if (crore > 0) words += chunkToWords(crore) + 'Crore ';
  if (lakh > 0) words += chunkToWords(lakh) + 'Lakh ';
  if (thousand > 0) words += chunkToWords(thousand) + 'Thousand ';
  if (remainder > 0) words += chunkToWords(remainder);

  return (words.trim() + ' Rupees Only').replace(/\s+/g, ' ');
}

// PROCESS payroll run
payrollRouter.post('/process', async (req: Request, res: Response) => {
  try {
    const { month, year } = req.body;
    const currentYear = Number(year) || new Date().getFullYear();
    const currentMonth = month || 'October';
    const monthStr = `${currentMonth} ${currentYear}`;
    const today = new Date().toISOString().split('T')[0];

    // Execute within an atomic database transaction
    const resultRun = await prisma.$transaction(async (tx) => {
      // 1. Find existing run or create new
      let run = await tx.payrollRun.findFirst({
        where: { month: monthStr },
      });

      if (!run) {
        run = await tx.payrollRun.create({
          data: {
            month: monthStr,
            year: currentYear,
            monthIndex: new Date().getMonth(),
            status: 'Draft',
            totalEmployees: 0,
            grossAmount: 0,
            totalEarnings: 0,
            totalDeductions: 0,
            netPayable: 0,
          },
        });
      }

      // 2. Query all existing items or generate for active employees
      let items = await tx.payrollItem.findMany({
        where: {
          OR: [
            { payrollRunId: run.id },
            { payrollRunId: null },
          ],
        },
      });

      // If no items exist in DB, build them automatically from Active Employees
      if (items.length === 0) {
        const employees = await tx.employee.findMany({
          where: { status: 'Active' },
        });

        for (const emp of employees) {
          const gross = emp.salary || 65000;
          const basic = Math.round(gross * 0.5);
          const hra = Math.round(basic * 0.4);
          const conveyance = 1600;
          const specialAllowance = Math.max(0, gross - (basic + hra + conveyance));
          const totalEarnings = basic + hra + conveyance + specialAllowance;

          // Statutory deductions
          const pfDeduction = Math.round(Math.min(basic, 15000) * 0.12);
          const esiDeduction = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
          const professionalTax = 200;
          const tdsDeduction = Math.round(gross * 0.05); // Standard estimate
          const totalDeductions = pfDeduction + esiDeduction + professionalTax + tdsDeduction;
          const netSalary = totalEarnings - totalDeductions;

          await tx.payrollItem.create({
            data: {
              payrollRunId: run.id,
              employeeId: emp.employeeId,
              employeeName: `${emp.firstName} ${emp.lastName}`.trim(),
              department: emp.departmentName,
              designation: emp.designationTitle,
              bankAccount: emp.accountNumber,
              grossSalary: gross,
              basic,
              hra,
              conveyance,
              specialAllowance,
              totalEarnings,
              pfDeduction,
              esiDeduction,
              professionalTax,
              tdsDeduction,
              totalDeductions,
              netSalary,
              status: 'Paid',
              paymentDate: today,
            },
          });
        }

        items = await tx.payrollItem.findMany({
          where: { payrollRunId: run.id },
        });
      } else {
        // Link any unbound items to this run and update their status to Paid
        const itemIds = items.map((i) => i.id);
        await tx.payrollItem.updateMany({
          where: { id: { in: itemIds } },
          data: {
            payrollRunId: run.id,
            status: 'Paid',
            paymentDate: today,
          },
        });
      }

      // 3. Compute exact totals from actual items
      const grossAmount = items.reduce((acc, i) => acc + (i.grossSalary || 0), 0);
      const totalEarnings = items.reduce((acc, i) => acc + (i.totalEarnings || 0), 0);
      const totalDeductions = items.reduce((acc, i) => acc + (i.totalDeductions || 0), 0);
      const netPayable = totalEarnings - totalDeductions;
      const empCount = items.length;

      // 4. Update the PayrollRun status and metrics
      const updatedRun = await tx.payrollRun.update({
        where: { id: run.id },
        data: {
          status: 'Paid',
          grossAmount,
          totalEarnings,
          totalDeductions,
          netPayable,
          totalEmployees: empCount,
          processedDate: today,
          approvedBy: 'Admin Approval (Automated Run)',
        },
      });

      // 5. Automatically Generate/Synchronize Payslips for all items in this run
      for (const item of items) {
        const emp = await tx.employee.findUnique({
          where: { employeeId: item.employeeId },
        });

        const workedDays = 30 - (item.lopDays || 0);
        const netSal = item.netSalary || (item.totalEarnings - item.totalDeductions);
        const words = convertNumberToWords(netSal);

        const existingSlip = await tx.payslip.findFirst({
          where: {
            employeeId: item.employeeId,
            month: currentMonth,
            year: currentYear,
          },
        });

        if (existingSlip) {
          await tx.payslip.update({
            where: { id: existingSlip.id },
            data: {
              status: 'Generated',
              basic: item.basic,
              hra: item.hra,
              conveyance: item.conveyance,
              specialAllowance: item.specialAllowance,
              bonus: item.bonus,
              incentives: item.incentives,
              overtime: item.overtime,
              totalEarnings: item.totalEarnings,
              pf: item.pfDeduction,
              esi: item.esiDeduction,
              pt: item.professionalTax,
              tds: item.tdsDeduction,
              lop: item.lopDeduction,
              loanDeduction: item.loanRecovery,
              totalDeductions: item.totalDeductions,
              netSalary: netSal,
              netSalaryInWords: words,
              generatedDate: today,
            },
          });
        } else {
          await tx.payslip.create({
            data: {
              payrollId: updatedRun.id,
              employeeId: item.employeeId,
              employeeName: item.employeeName,
              department: item.department,
              designation: item.designation,
              joiningDate: emp?.joiningDate || '2023-01-15',
              bankName: emp?.bankName || 'HDFC Bank',
              accountNumber: item.bankAccount,
              ifscCode: emp?.ifscCode || 'HDFC0001755',
              panNumber: emp?.panNumber || 'ABCDE1234F',
              uanNumber: emp?.uanNumber || '100123456789',
              esiNumber: emp?.esiNumber || 'N/A',
              month: currentMonth,
              year: currentYear,
              workedDays,
              lopDays: item.lopDays || 0,
              totalDays: 30,
              basic: item.basic,
              hra: item.hra,
              conveyance: item.conveyance,
              specialAllowance: item.specialAllowance,
              bonus: item.bonus,
              incentives: item.incentives,
              overtime: item.overtime,
              totalEarnings: item.totalEarnings,
              pf: item.pfDeduction,
              esi: item.esiDeduction,
              pt: item.professionalTax,
              tds: item.tdsDeduction,
              lop: item.lopDeduction,
              loanDeduction: item.loanRecovery,
              totalDeductions: item.totalDeductions,
              netSalary: netSal,
              netSalaryInWords: words,
              generatedDate: today,
              status: 'Generated',
            },
          });
        }
      }

      return updatedRun;
    });

    res.json(resultRun);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET payslips with optional filtering
payrollRouter.get('/payslips', async (req: Request, res: Response) => {
  try {
    const { department, employeeId } = req.query as {
      department?: string;
      employeeId?: string;
    };

    const where: any = {};
    if (department && department !== 'All') {
      where.department = department;
    }
    if (employeeId) {
      where.employeeId = employeeId;
    }

    const payslips = await prisma.payslip.findMany({
      where,
      orderBy: { employeeName: 'asc' },
    });

    res.json(payslips);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single payslip
payrollRouter.get('/payslips/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const payslip = await prisma.payslip.findFirst({
      where: {
        OR: [{ id }, { employeeId: id }],
      },
    });
    if (!payslip) {
      res.status(404).json({ success: false, message: 'Payslip not found' });
      return;
    }
    res.json(payslip);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET salary structures
payrollRouter.get('/salary-structures', async (_req: Request, res: Response) => {
  try {
    const structures = await prisma.salaryStructure.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(structures);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST salary structure
payrollRouter.post('/salary-structures', async (req: Request, res: Response) => {
  try {
    const created = await prisma.salaryStructure.create({
      data: req.body,
    });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
