import { prisma } from './db';
import bcrypt from 'bcryptjs';
import {
  MOCK_DEPARTMENTS,
  MOCK_DESIGNATIONS,
  MOCK_EMPLOYEES,
  MOCK_USERS,
  MOCK_SALARY_STRUCTURES,
  MOCK_PAYROLL_SUMMARY,
  MOCK_PAYROLL_ITEMS,
  MOCK_PAYSLIPS,
  MOCK_LEAVES,
  MOCK_REIMBURSEMENTS,
  MOCK_LOANS,
  MOCK_CONTRACTORS,
  MOCK_CONTRACTOR_INVOICES,
  MOCK_TAX_DECLARATIONS,
  MOCK_DOCUMENTS,
} from './data/mockData';

export async function seedDatabase() {
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log('[Seed] Database already seeded. Skipping initial seed.');
    return;
  }

  console.log('[Seed] Seeding database with initial enterprise payroll data...');

  // 1. Seed Users
  const defaultPasswordHash = await bcrypt.hash('admin123', 10);
  for (const u of MOCK_USERS) {
    await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        password: defaultPasswordHash,
        name: u.name,
        role: u.role,
        department: u.department,
        avatar: u.avatar,
        status: u.status,
        lastLogin: u.lastLogin,
      },
    });
  }

  // 2. Seed Departments
  for (const d of MOCK_DEPARTMENTS) {
    await prisma.department.create({
      data: {
        id: d.id,
        name: d.name,
        code: d.code,
        headName: d.headName,
        headId: d.headId,
        budgetMonthly: d.budgetMonthly,
        status: d.status,
      },
    });
  }

  // 3. Seed Designations
  for (const des of MOCK_DESIGNATIONS) {
    await prisma.designation.create({
      data: {
        id: des.id,
        title: des.title,
        departmentId: des.departmentId,
        departmentName: des.departmentName,
        level: des.level,
        minSalary: des.minSalary,
        maxSalary: des.maxSalary,
        status: des.status,
      },
    });
  }

  // 4. Seed Employees
  for (const emp of MOCK_EMPLOYEES) {
    await prisma.employee.create({
      data: {
        id: emp.id,
        employeeId: emp.employeeId,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        phone: emp.phone,
        avatar: emp.avatar,
        departmentId: emp.departmentId,
        departmentName: emp.departmentName,
        designationId: emp.designationId,
        designationTitle: emp.designationTitle,
        reportingManagerId: emp.reportingManagerId,
        reportingManagerName: emp.reportingManagerName,
        joiningDate: emp.joiningDate,
        employmentType: emp.employmentType,
        status: emp.status,
        workLocation: emp.workLocation,
        salary: emp.salary,
        ctcAnnual: emp.ctcAnnual,
        dateOfBirth: emp.dateOfBirth,
        gender: emp.gender,
        address: emp.address,
        city: emp.city,
        state: emp.state,
        pincode: emp.pincode,
        emergencyContact: emp.emergencyContact,
        bankName: emp.bankName,
        accountNumber: emp.accountNumber,
        ifscCode: emp.ifscCode,
        panNumber: emp.panNumber,
        aadhaarNumber: emp.aadhaarNumber,
        uanNumber: emp.uanNumber,
        esiNumber: emp.esiNumber,
        taxRegime: emp.taxRegime,
      },
    });
  }

  // 5. Seed Salary Structures
  for (const s of MOCK_SALARY_STRUCTURES) {
    await prisma.salaryStructure.create({
      data: {
        id: s.id,
        name: s.name,
        description: s.description,
        basicPct: s.basicPct,
        hraPct: s.hraPct,
        conveyance: s.conveyance,
        specialAllowance: s.specialAllowance,
        pfApplicable: s.pfApplicable,
        esiApplicable: s.esiApplicable,
        ptApplicable: s.ptApplicable,
        lwfApplicable: s.lwfApplicable || false,
        lwfState: s.lwfState,
        lwfEmployeeAmount: s.lwfEmployeeAmount,
        status: s.status,
      },
    });
  }

  // 6. Seed Payroll Run & Items
  const run = await prisma.payrollRun.create({
    data: {
      id: 'pr-2026-10',
      month: MOCK_PAYROLL_SUMMARY.month,
      year: MOCK_PAYROLL_SUMMARY.year,
      monthIndex: MOCK_PAYROLL_SUMMARY.monthIndex,
      status: MOCK_PAYROLL_SUMMARY.status,
      totalEmployees: MOCK_PAYROLL_SUMMARY.totalEmployees,
      grossAmount: MOCK_PAYROLL_SUMMARY.grossAmount,
      totalEarnings: MOCK_PAYROLL_SUMMARY.totalEarnings,
      totalDeductions: MOCK_PAYROLL_SUMMARY.totalDeductions,
      netPayable: MOCK_PAYROLL_SUMMARY.netPayable,
      processedDate: MOCK_PAYROLL_SUMMARY.processedDate,
      approvedBy: MOCK_PAYROLL_SUMMARY.approvedBy,
      paymentReference: MOCK_PAYROLL_SUMMARY.paymentReference,
    },
  });

  for (const pi of MOCK_PAYROLL_ITEMS) {
    await prisma.payrollItem.create({
      data: {
        id: pi.id,
        payrollRunId: run.id,
        employeeId: pi.employeeId,
        employeeName: pi.employeeName,
        department: pi.department,
        designation: pi.designation,
        bankAccount: pi.bankAccount,
        grossSalary: pi.grossSalary,
        basic: pi.basic,
        hra: pi.hra,
        specialAllowance: pi.specialAllowance,
        conveyance: pi.conveyance,
        bonus: pi.bonus,
        incentives: pi.incentives,
        overtime: pi.overtime,
        overtimeHours: pi.overtimeHours,
        totalEarnings: pi.totalEarnings,
        pfDeduction: pi.pfDeduction,
        esiDeduction: pi.esiDeduction,
        professionalTax: pi.professionalTax,
        lwfDeduction: pi.lwfDeduction,
        tdsDeduction: pi.tdsDeduction,
        lopDays: pi.lopDays,
        lopDeduction: pi.lopDeduction,
        loanRecovery: pi.loanRecovery,
        totalDeductions: pi.totalDeductions,
        netSalary: pi.netSalary,
        status: pi.status,
        paymentDate: pi.paymentDate,
        paymentMode: pi.paymentMode,
      },
    });
  }

  // 7. Seed Payslips
  for (const p of MOCK_PAYSLIPS) {
    await prisma.payslip.create({
      data: {
        id: p.id,
        payrollId: p.payrollId,
        employeeId: p.employeeId,
        employeeName: p.employeeName,
        department: p.department,
        designation: p.designation,
        joiningDate: p.joiningDate,
        bankName: p.bankName,
        accountNumber: p.accountNumber,
        ifscCode: p.ifscCode,
        panNumber: p.panNumber,
        uanNumber: p.uanNumber,
        esiNumber: p.esiNumber,
        month: p.month,
        year: p.year,
        workedDays: p.workedDays,
        lopDays: p.lopDays,
        totalDays: p.totalDays,
        basic: p.basic,
        hra: p.hra,
        conveyance: p.conveyance,
        specialAllowance: p.specialAllowance,
        bonus: p.bonus,
        incentives: p.incentives,
        overtime: p.overtime,
        totalEarnings: p.totalEarnings,
        pf: p.pf,
        esi: p.esi,
        pt: p.pt,
        lwf: p.lwf,
        tds: p.tds,
        lop: p.lop,
        loanDeduction: p.loanDeduction,
        totalDeductions: p.totalDeductions,
        netSalary: p.netSalary,
        netSalaryInWords: p.netSalaryInWords,
        generatedDate: p.generatedDate,
        status: p.status,
      },
    });
  }

  // 8. Seed Leave Requests
  for (const l of MOCK_LEAVES) {
    await prisma.leaveRequest.create({
      data: {
        id: l.id,
        employeeId: l.employeeId,
        employeeName: l.employeeName,
        department: l.department,
        avatar: l.avatar,
        leaveType: l.leaveType,
        fromDate: l.fromDate,
        toDate: l.toDate,
        daysCount: l.daysCount,
        reason: l.reason,
        status: l.status,
        appliedDate: l.appliedDate,
        reviewedBy: l.reviewedBy,
        reviewedDate: l.reviewedDate,
        comments: l.comments,
      },
    });
  }

  // 9. Seed Reimbursements
  for (const r of MOCK_REIMBURSEMENTS) {
    await prisma.reimbursement.create({
      data: {
        id: r.id,
        claimId: r.claimId,
        employeeId: r.employeeId,
        employeeName: r.employeeName,
        department: r.department,
        category: r.category,
        amount: r.amount,
        billDate: r.billDate,
        submittedDate: r.submittedDate,
        description: r.description,
        receiptAttachment: r.receiptAttachment,
        status: r.status,
        approvedBy: r.approvedBy,
        approvalRemarks: (r as any).approvalRemarks,
        paymentDate: (r as any).paymentDate,
      },
    });
  }

  // 10. Seed Loans
  for (const ln of MOCK_LOANS) {
    const loanAny = ln as any;
    await prisma.loan.create({
      data: {
        id: ln.id,
        employeeId: ln.employeeId,
        employeeName: ln.employeeName,
        department: ln.department,
        loanType: ln.loanType,
        principalAmount: loanAny.principalAmount ?? ln.originalAmount ?? 50000,
        interestRate: loanAny.interestRate ?? 8.5,
        tenureMonths: ln.tenureMonths,
        monthlyEmi: loanAny.monthlyEmi ?? ln.monthlyDeduction ?? 4500,
        disbursedDate: loanAny.disbursedDate ?? ln.startDate ?? '2026-01-15',
        remainingAmount: ln.remainingAmount,
        status: ln.status,
      },
    });
  }

  // 11. Seed Contractors & Invoices
  for (const c of MOCK_CONTRACTORS) {
    const cAny = c as any;
    await prisma.contractor.create({
      data: {
        id: c.id,
        contractorId: c.contractorId,
        name: c.name,
        panNumber: c.panNumber,
        gstNumber: cAny.gstNumber ?? '29AABCS1429B1ZB',
        serviceType: cAny.serviceType ?? 'Software Consultancy',
        tdsSection: c.tdsSection,
        tdsRate: c.tdsRate,
        status: c.status,
        totalBilled: c.totalBilled,
        totalTdsDeducted: c.totalTdsDeducted,
        bankName: c.bankName,
        accountNumber: c.accountNumber,
        ifscCode: c.ifscCode,
      },
    });
  }

  for (const inv of MOCK_CONTRACTOR_INVOICES) {
    const invAny = inv as any;
    await prisma.contractorInvoice.create({
      data: {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        contractorId: inv.contractorId,
        contractorName: inv.contractorName,
        panNumber: invAny.panNumber ?? 'AAACR1234F',
        serviceType: invAny.serviceType ?? 'Engineering Support',
        invoiceDate: inv.invoiceDate,
        dueDate: invAny.dueDate ?? inv.invoiceDate,
        grossAmount: inv.grossAmount,
        tdsSection: inv.tdsSection,
        tdsRate: inv.tdsRate,
        tdsAmount: inv.tdsAmount,
        netPayable: inv.netPayable,
        status: inv.status,
        paymentDate: inv.paymentDate,
        paymentReference: inv.paymentReference,
      },
    });
  }

  // 12. Seed Tax Declarations
  for (const td of MOCK_TAX_DECLARATIONS) {
    const tdAny = td as any;
    await prisma.taxDeclaration.create({
      data: {
        id: td.id,
        employeeId: td.employeeId,
        employeeName: td.employeeName,
        department: td.department,
        panNumber: tdAny.panNumber ?? 'ABCDE1234F',
        financialYear: td.financialYear,
        regime: tdAny.regime ?? tdAny.taxRegime ?? 'New Regime (115BAC)',
        section80C: td.section80C,
        section80D: td.section80D,
        hraExemption: td.hraExemption,
        homeLoanInterest: td.homeLoanInterest,
        nps80CCD: tdAny.nps80CCD ?? 0,
        otherDeductions: td.otherDeductions,
        totalDeclared: tdAny.totalDeclared ?? tdAny.totalDeclaredDeductions ?? 150000,
        approvedAmount: tdAny.approvedAmount ?? 150000,
        proofStatus: tdAny.proofStatus ?? 'Verified',
        status: td.status,
        submittedDate: td.submittedDate,
        reviewedBy: td.reviewedBy,
      },
    });
  }

  // 13. Seed Documents
  for (const doc of MOCK_DOCUMENTS) {
    const docAny = doc as any;
    await prisma.document.create({
      data: {
        id: doc.id,
        employeeId: docAny.employeeId,
        title: doc.title,
        category: doc.category,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        uploadDate: docAny.uploadDate ?? docAny.uploadedDate ?? '2026-10-01',
        status: doc.status,
        url: docAny.url,
      },
    });
  }

  console.log('[Seed] Database successfully populated with initial payroll data!');
}

seedDatabase()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
