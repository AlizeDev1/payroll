import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const contractorRouter = Router();

contractorRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const contractors = await prisma.contractor.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(contractors);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

contractorRouter.post('/', async (req: Request, res: Response) => {
  try {
    const count = await prisma.contractor.count();
    const nextNum = count + 1;
    const data = req.body;
    const contractor = await prisma.contractor.create({
      data: {
        ...data,
        contractorId: `CTR${String(nextNum).padStart(3, '0')}`,
        tdsRate: Number(data.tdsRate) || 10,
        totalBilled: 0,
        totalTdsDeducted: 0,
        status: 'Active',
      },
    });
    res.status(201).json(contractor);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

contractorRouter.get('/invoices', async (_req: Request, res: Response) => {
  try {
    const invoices = await prisma.contractorInvoice.findMany({
      orderBy: { invoiceDate: 'desc' },
    });
    res.json(invoices);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

contractorRouter.post('/invoices', async (req: Request, res: Response) => {
  try {
    const count = await prisma.contractorInvoice.count();
    const nextNum = count + 1;
    const data = req.body;
    const grossAmount = Number(data.grossAmount) || 0;
    const tdsRate = Number(data.tdsRate) || 10;
    const tdsAmount = Math.round(grossAmount * (tdsRate / 100));
    const netPayable = grossAmount - tdsAmount;

    const newInvoice = await prisma.$transaction(async (tx) => {
      const invoice = await tx.contractorInvoice.create({
        data: {
          ...data,
          invoiceNumber: `INV/2026-10/${String(nextNum).padStart(2, '0')}`,
          grossAmount,
          tdsRate,
          tdsAmount,
          netPayable,
          status: 'Approved',
        },
      });

      // Update contractor aggregates atomically
      const c = await tx.contractor.findFirst({
        where: { contractorId: data.contractorId },
      });
      if (c) {
        await tx.contractor.update({
          where: { id: c.id },
          data: {
            totalBilled: { increment: grossAmount },
            totalTdsDeducted: { increment: tdsAmount },
          },
        });
      }

      return invoice;
    });

    res.status(201).json(newInvoice);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

contractorRouter.patch('/invoices/:id/paid', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.contractorInvoice.update({
      where: { id },
      data: {
        status: 'Paid',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentReference: `CMS/NEFT/BANK/${Date.now().toString().slice(-6)}`,
      },
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
