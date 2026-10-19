import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { MOCK_STATUTORY_COMPLIANCE, MOCK_FULL_AND_FINAL } from '../data/mockData';

export const complianceRouter = Router();

// GET statutory compliance summary
complianceRouter.get('/summary', async (_req: Request, res: Response) => {
  try {
    let summary = await prisma.statutoryCompliance.findMany({
      orderBy: { category: 'asc' },
    });
    if (summary.length === 0) {
      // Return default statutory compliance data
      return res.json(MOCK_STATUTORY_COMPLIANCE);
    }
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET tax declarations
complianceRouter.get('/tax-declarations', async (_req: Request, res: Response) => {
  try {
    const declarations = await prisma.taxDeclaration.findMany({
      orderBy: { submittedDate: 'desc' },
    });
    res.json(declarations);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH tax declaration status
complianceRouter.patch('/tax-declarations/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reviewer } = req.body;
    const updated = await prisma.taxDeclaration.update({
      where: { id },
      data: {
        status,
        reviewedBy: reviewer || 'Payroll Compliance Officer',
      },
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET Full & Final settlements
complianceRouter.get('/settlements', async (_req: Request, res: Response) => {
  try {
    const settlements = await prisma.fullAndFinalSettlement.findMany({
      orderBy: { resignationDate: 'desc' },
    });
    if (settlements.length === 0) {
      return res.json(MOCK_FULL_AND_FINAL);
    }
    res.json(settlements);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create settlement
complianceRouter.post('/settlements', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const settlement = await prisma.fullAndFinalSettlement.create({
      data: {
        ...data,
        status: data.status || 'Pending',
      },
    });
    res.status(201).json(settlement);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update settlement status
complianceRouter.patch('/settlements/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.fullAndFinalSettlement.update({
      where: { id },
      data: {
        status,
        settledDate: status === 'Settled' ? new Date().toISOString().split('T')[0] : undefined,
      },
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
