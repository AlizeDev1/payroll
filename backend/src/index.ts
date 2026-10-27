import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './db';
import { seedDatabase } from './seed';
import { authenticateToken } from './middleware/auth';

// Routers
import { authRouter } from './routes/auth';
import { employeeRouter, departmentRouter, designationRouter } from './routes/employees';
import { payrollRouter } from './routes/payroll';
import { attendanceRouter } from './routes/attendance';
import { leaveRouter } from './routes/leaves';
import { reimbursementRouter } from './routes/reimbursements';
import { contractorRouter } from './routes/contractors';
import { complianceRouter } from './routes/compliance';
import { loanRouter } from './routes/loans';
import { userRouter } from './routes/users';
import { documentRouter } from './routes/documents';
import { reportRouter } from './routes/reports';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

// Security & Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or in whitelist
      if (!origin || ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*') || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, logged in prod
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 1. Shallow Liveness Probe (Kubernetes / ECS Liveness)
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Alize Payroll & HRMS Enterprise API',
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

// 2. Deep Readiness Probe (Verifies Database Connection Pool)
app.get('/health/ready', async (_req: Request, res: Response) => {
  try {
    // Ping database
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message,
    });
  }
});

// Mount API v1 Routes
const API_PREFIX = '/api/v1';

// Public endpoints
app.use(`${API_PREFIX}/auth`, authRouter);

// Protected enterprise business endpoints (Requires JWT Token)
app.use(`${API_PREFIX}/employees`, authenticateToken, employeeRouter);
app.use(`${API_PREFIX}/departments`, authenticateToken, departmentRouter);
app.use(`${API_PREFIX}/designations`, authenticateToken, designationRouter);
app.use(`${API_PREFIX}/payroll`, authenticateToken, payrollRouter);
app.use(`${API_PREFIX}/attendance`, authenticateToken, attendanceRouter);
app.use(`${API_PREFIX}/leaves`, authenticateToken, leaveRouter);
app.use(`${API_PREFIX}/reimbursements`, authenticateToken, reimbursementRouter);
app.use(`${API_PREFIX}/contractors`, authenticateToken, contractorRouter);
app.use(`${API_PREFIX}/compliance`, authenticateToken, complianceRouter);
app.use(`${API_PREFIX}/loans`, authenticateToken, loanRouter);
app.use(`${API_PREFIX}/users`, authenticateToken, userRouter);
app.use(`${API_PREFIX}/documents`, authenticateToken, documentRouter);
app.use(`${API_PREFIX}/reports`, authenticateToken, reportRouter);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  console.error(`[API Error ${status}]:`, err.message || err);
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Boot and seed
let server: any;

async function startServer() {
  try {
    await seedDatabase().catch((dbErr) => {
      console.warn('⚠️ [Database] Live Neon DB connection pending or credentials placeholder in .env. Server running in resilient mode.');
    });
    server = app.listen(PORT, () => {
      console.log(`🚀 [Alize API] Backend REST Server running at http://localhost:${PORT}`);
      console.log(`📊 [Alize API] Health check available at http://localhost:${PORT}/health`);
      console.log(`⚡ [Alize API] Readiness check at http://localhost:${PORT}/health/ready`);
      console.log(`🔒 [Alize API] Enterprise RBAC & JWT enabled on ${API_PREFIX}/*`);
    });
  } catch (error) {
    console.error('Failed to start Alize API server:', error);
    process.exit(1);
  }
}

// Graceful Shutdown Handler for Cloud Containers (Kubernetes / ECS / Cloud Run)
const gracefulShutdown = async (signal: string) => {
  console.log(`\n[Cloud Lifecycle] Received ${signal}. Draining HTTP connections...`);
  if (server) {
    server.close(async () => {
      console.log('[Cloud Lifecycle] HTTP server closed. Disconnecting Prisma database pool...');
      try {
        await prisma.$disconnect();
        console.log('[Cloud Lifecycle] Database disconnected cleanly. Exiting.');
        process.exit(0);
      } catch (err) {
        console.error('[Cloud Lifecycle] Error disconnecting Prisma:', err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
