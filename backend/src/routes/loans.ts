import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const loanRouter = Router();

loanRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const loans = await prisma.loan.findMany({
      orderBy: { disbursedDate: 'desc' },
    });
    res.json(loans);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

loanRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const loan = await prisma.loan.create({
      data: {
        ...data,
        principalAmount: Number(data.principalAmount) || 0,
        interestRate: Number(data.interestRate) || 0,
        tenureMonths: Number(data.tenureMonths) || 12,
        monthlyEmi: Number(data.monthlyEmi) || 0,
        remainingAmount: Number(data.principalAmount) || 0,
        status: 'Active',
      },
    });
    res.status(201).json(loan);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
