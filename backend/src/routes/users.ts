import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { MOCK_ROLE_PERMISSIONS } from '../data/mockData';
import bcrypt from 'bcryptjs';

export const userRouter = Router();

userRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        avatar: true,
        status: true,
        lastLogin: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

userRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const defaultPasswordHash = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: defaultPasswordHash,
        lastLogin: 'Never',
      },
    });
    res.status(201).json(user);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

userRouter.patch('/:id/role', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updated = await prisma.user.update({
      where: { id },
      data: { role },
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

userRouter.get('/permissions', async (_req: Request, res: Response) => {
  try {
    let dbRoles = await prisma.rolePermission.findMany({
      orderBy: { role: 'asc' },
    });

    // Auto-seed default role permissions if table is empty
    if (dbRoles.length === 0) {
      for (const item of MOCK_ROLE_PERMISSIONS) {
        await prisma.rolePermission.create({
          data: {
            role: item.role,
            description: item.description,
            permissions: JSON.stringify(item.permissions),
          },
        });
      }
      dbRoles = await prisma.rolePermission.findMany({
        orderBy: { role: 'asc' },
      });
    }

    const formatted = dbRoles.map((r) => ({
      role: r.role,
      description: r.description,
      permissions: typeof r.permissions === 'string' ? JSON.parse(r.permissions) : r.permissions,
    }));

    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

userRouter.patch('/permissions', async (req: Request, res: Response) => {
  try {
    const { role, module, action, value } = req.body;
    if (!role || !module || !action) {
      res.status(400).json({ success: false, message: 'role, module, and action are required' });
      return;
    }

    let existing = await prisma.rolePermission.findUnique({
      where: { role },
    });

    let permissionsObj: any = {};
    if (existing) {
      permissionsObj = typeof existing.permissions === 'string' ? JSON.parse(existing.permissions) : existing.permissions;
    } else {
      const fallback = MOCK_ROLE_PERMISSIONS.find((p) => p.role === role);
      permissionsObj = fallback ? fallback.permissions : {};
    }

    if (!permissionsObj[module]) {
      permissionsObj[module] = {};
    }
    permissionsObj[module][action] = Boolean(value);

    const updated = await prisma.rolePermission.upsert({
      where: { role },
      update: {
        permissions: JSON.stringify(permissionsObj),
      },
      create: {
        role,
        description: `${role} organizational role permissions`,
        permissions: JSON.stringify(permissionsObj),
      },
    });

    res.json({
      success: true,
      role: updated.role,
      module,
      action,
      value: Boolean(value),
      permissions: JSON.parse(updated.permissions),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
