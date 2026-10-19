import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const reimbursementRouter = Router();

reimbursementRouter.get('/', async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const where: any = {};
    if (status && status !== 'All') {
      where.status = status;
    }
    const claims = await prisma.reimbursement.findMany({
      where,
      orderBy: { submittedDate: 'desc' },
    });
    res.json(claims);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

reimbursementRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const claim = await prisma.reimbursement.create({
      data: {
        ...data,
        claimId: `EXP-2026-${Math.floor(800 + Math.random() * 200)}`,
        amount: Number(data.amount) || 0,
        status: 'Pending',
        submittedDate: new Date().toISOString().split('T')[0],
      },
    });
    res.status(201).json(claim);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

reimbursementRouter.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, approvedBy, remarks } = req.body;
    const updated = await prisma.reimbursement.update({
      where: { id },
      data: {
        status,
        approvedBy: approvedBy || 'Finance Team',
        approvalRemarks: remarks,
      },
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
