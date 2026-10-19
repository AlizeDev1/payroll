import { Router, Request, Response } from 'express';
import multer from 'multer';
import { prisma } from '../db';
import { storageService } from '../services/storageService';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

export const documentRouter = Router();

// Configure Multer for in-memory buffer processing (max 15MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB
  },
});

// GET all documents
documentRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query as { category?: string };
    const where: any = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    const documents = await prisma.document.findMany({
      where,
      orderBy: { uploadDate: 'desc' },
    });
    res.json(documents);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/v1/documents/upload
 * Multipart File Upload directly to Cloudflare R2 Storage
 */
documentRouter.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const { title, category, employeeId } = req.body;

    if (!file) {
      res.status(400).json({ success: false, message: 'No file provided in form-data ("file")' });
      return;
    }

    // 1. Upload file buffer to Cloudflare R2
    const uploadResult = await storageService.uploadBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
      category ? `documents/${category.toLowerCase()}` : 'documents/general'
    );

    // Format human-readable file size
    const sizeInKb = (file.size / 1024).toFixed(1);
    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${sizeInKb} KB`;

    // 2. Persist metadata into Database
    const document = await prisma.document.create({
      data: {
        title: title || file.originalname,
        category: category || 'Company Policy',
        fileName: file.originalname,
        fileSize: formattedSize,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Verified',
        url: uploadResult.url,
        employeeId: employeeId || null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully to Cloudflare R2',
      document,
      storage: {
        key: uploadResult.key,
        url: uploadResult.url,
      },
    });
  } catch (err: any) {
    console.error('Upload Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/v1/documents/presign-upload
 * Generate Pre-Signed Upload URL for Direct Browser-to-R2 upload
 */
documentRouter.post('/presign-upload', async (req: Request, res: Response) => {
  try {
    const { fileName, mimeType, category } = req.body;
    if (!fileName || !mimeType) {
      return res.status(400).json({ success: false, message: 'fileName and mimeType are required' });
    }

    const folder = category ? `documents/${category.toLowerCase()}` : 'documents/general';
    const presigned = await storageService.getPresignedUploadUrl(fileName, mimeType, folder);

    res.json({
      success: true,
      ...presigned,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/v1/documents/:id/download
 * Generate a Secure, Time-Limited Pre-Signed Download URL from Cloudflare R2
 */
documentRouter.get('/:id/download', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    // If url contains an R2 key or direct URL
    let downloadUrl = document.url;
    if (document.url && document.url.startsWith('documents/')) {
      downloadUrl = await storageService.getDownloadUrl(document.url, 3600); // 1 hr expiry
    }

    res.json({
      success: true,
      downloadUrl: downloadUrl || document.url,
      fileName: document.fileName,
      expiresIn: '3600 seconds',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST metadata-only document (backward compatibility)
documentRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const document = await prisma.document.create({
      data: {
        ...data,
        uploadDate: new Date().toISOString().split('T')[0],
        status: data.status || 'Verified',
      },
    });
    res.status(201).json(document);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE document (from Cloudflare R2 & Database)
documentRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doc = await prisma.document.findUnique({ where: { id } });

    if (doc?.url && doc.url.startsWith('documents/')) {
      await storageService.deleteFile(doc.url);
    }

    await prisma.document.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET notifications
documentRouter.get('/notifications', async (_req: Request, res: Response) => {
  try {
    let notifications = await prisma.systemNotification.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (notifications.length === 0) {
      return res.json(MOCK_NOTIFICATIONS);
    }
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH single notification read
documentRouter.patch('/notifications/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.systemNotification.update({
      where: { id },
      data: { read: true },
    }).catch(() => ({ id, read: true }));
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH all notifications read
documentRouter.patch('/notifications/read-all', async (_req: Request, res: Response) => {
  try {
    await prisma.systemNotification.updateMany({
      data: { read: true },
    });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
