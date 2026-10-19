import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const employeeRouter = Router();

// GET all employees
employeeRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(employees);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET employee by ID
employeeRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findFirst({
      where: {
        OR: [{ id }, { employeeId: id }],
      },
    });
    if (!employee) {
      res.status(404).json({ success: false, message: 'Employee not found' });
      return;
    }
    res.json(employee);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CREATE employee
employeeRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const newEmp = await prisma.employee.create({
      data: {
        ...data,
        employeeId: data.employeeId || `EMP${Math.floor(100 + Math.random() * 900)}`,
        salary: Number(data.salary) || 0,
        ctcAnnual: Number(data.ctcAnnual) || (Number(data.salary) || 0) * 12,
      },
    });
    res.status(201).json(newEmp);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE employee
employeeRouter.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await prisma.employee.update({
      where: { id },
      data: updates,
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE employee
employeeRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.employee.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DEPARTMENTS
export const departmentRouter = Router();

departmentRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(departments);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

departmentRouter.post('/', async (req: Request, res: Response) => {
  try {
    const dept = await prisma.department.create({
      data: req.body,
    });
    res.status(201).json(dept);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DESIGNATIONS
export const designationRouter = Router();

designationRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const designations = await prisma.designation.findMany({
      orderBy: { title: 'asc' },
    });
    res.json(designations);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

designationRouter.post('/', async (req: Request, res: Response) => {
  try {
    const des = await prisma.designation.create({
      data: req.body,
    });
    res.status(201).json(des);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
