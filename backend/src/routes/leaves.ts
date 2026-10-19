import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const leaveRouter = Router();

// GET all leaves
leaveRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      orderBy: { appliedDate: 'desc' },
    });
    res.json(leaves);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// APPLY leave
leaveRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const leave = await prisma.leaveRequest.create({
      data: {
        ...data,
        daysCount: Number(data.daysCount) || 1,
        appliedDate: data.appliedDate || new Date().toISOString().split('T')[0],
        status: 'Pending',
      },
    });
    res.status(201).json(leave);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE leave status (Approve / Reject)
leaveRouter.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reviewedBy, comments } = req.body;
    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status,
        reviewedBy: reviewedBy || 'Admin Reviewer',
        reviewedDate: new Date().toISOString().split('T')[0],
        comments,
      },
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
