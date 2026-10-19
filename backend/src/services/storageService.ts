import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import path from 'path';

/**
 * Enterprise Cloud Storage Service
 * Compatible with Backblaze B2, Cloudflare R2, and AWS S3
 */
class CloudStorageService {
  private client: S3Client | null = null;
  private bucketName: string;
  private publicCustomDomain?: string;
  private isConfigured: boolean = false;
  private providerName: string = 'Local/Demo';

  constructor() {
    // 1. Check for Backblaze B2 configuration
    const b2KeyId = process.env.B2_KEY_ID || process.env.STORAGE_ACCESS_KEY_ID;
    const b2AppKey = process.env.B2_APPLICATION_KEY || process.env.STORAGE_SECRET_ACCESS_KEY;
    const b2Endpoint = process.env.B2_ENDPOINT || process.env.STORAGE_ENDPOINT;
    const b2Region = process.env.B2_REGION || process.env.STORAGE_REGION || 'eu-central-003';
    this.bucketName = process.env.B2_BUCKET_NAME || process.env.STORAGE_BUCKET_NAME || 'alize-payroll-documents';
    this.publicCustomDomain = process.env.STORAGE_PUBLIC_DOMAIN;

    // 2. Check for Cloudflare R2 fallback
    const r2AccountId = process.env.R2_ACCOUNT_ID;
    const r2Key = process.env.R2_ACCESS_KEY_ID;
    const r2Secret = process.env.R2_SECRET_ACCESS_KEY;

    if (b2KeyId && b2AppKey && b2Endpoint) {
      // Clean endpoint (ensure https:// prefix)
      const formattedEndpoint = b2Endpoint.startsWith('http') ? b2Endpoint : `https://${b2Endpoint}`;
      
      this.client = new S3Client({
        endpoint: formattedEndpoint,
        region: b2Region,
        credentials: {
          accessKeyId: b2KeyId,
          secretAccessKey: b2AppKey,
        },
      });
      this.isConfigured = true;
      this.providerName = 'Backblaze B2 (10 GB Free)';
      console.log(`☁️ [Storage] ${this.providerName} initialized at ${formattedEndpoint} (Bucket: ${this.bucketName})`);
    } else if (r2AccountId && r2Key && r2Secret) {
      this.client = new S3Client({
        region: 'auto',
        endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: r2Key,
          secretAccessKey: r2Secret,
        },
      });
      this.isConfigured = true;
      this.providerName = 'Cloudflare R2';
      console.log(`☁️ [Storage] ${this.providerName} initialized (Bucket: ${this.bucketName})`);
    } else {
      console.log('ℹ️ [Storage] Cloud storage not configured. Running in local/demo mock storage mode.');
    }
  }

  /**
   * Check if Cloud Storage is active
   */
  public hasCloudStorage(): boolean {
    return this.isConfigured && this.client !== null;
  }

  public getProviderName(): string {
    return this.providerName;
  }

  /**
   * Generates a unique sanitized S3 object key
   */
  private generateKey(folder: string, originalName: string): string {
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    const randomHex = crypto.randomBytes(6).toString('hex');
    const datePrefix = new Date().toISOString().slice(0, 10);
    return `${folder}/${datePrefix}/${baseName}_${randomHex}${ext}`;
  }

  /**
   * Directly upload file buffer to Cloud Storage (Backblaze B2 / R2)
   */
  public async uploadBuffer(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder: string = 'documents'
  ): Promise<{ key: string; url: string; size: number }> {
    const key = this.generateKey(folder, originalName);

    if (!this.hasCloudStorage()) {
      return {
        key,
        url: `/uploads/${key}`,
        size: buffer.length,
      };
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      });

      await this.client!.send(command);

      // Generate a secure 7-day pre-signed URL or custom domain URL
      const url = this.publicCustomDomain
        ? `${this.publicCustomDomain.replace(/\/$/, '')}/${key}`
        : await this.getDownloadUrl(key, 86400 * 7);

      return {
        key,
        url,
        size: buffer.length,
      };
    } catch (err: any) {
      console.error(`❌ [Storage] ${this.providerName} Upload failed:`, err);
      throw new Error(`${this.providerName} upload error: ${err.message}`);
    }
  }

  /**
   * Generate a secure, time-limited Pre-Signed Download URL
   */
  public async getDownloadUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
    if (this.publicCustomDomain) {
      return `${this.publicCustomDomain.replace(/\/$/, '')}/${key}`;
    }

    if (!this.hasCloudStorage()) {
      return `/uploads/${key}`;
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.client!, command, { expiresIn: expiresInSeconds });
    } catch (err: any) {
      console.error('❌ [Storage] Presigned download error:', err);
      return `/uploads/${key}`;
    }
  }

  /**
   * Generate Pre-Signed Upload URL for direct client-to-storage upload
   */
  public async getPresignedUploadUrl(
    originalName: string,
    mimeType: string,
    folder: string = 'documents',
    expiresInSeconds: number = 900 // 15 mins
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    const key = this.generateKey(folder, originalName);

    if (!this.hasCloudStorage()) {
      return {
        uploadUrl: `/api/v1/documents/upload`,
        key,
        publicUrl: `/uploads/${key}`,
      };
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(this.client!, command, { expiresIn: expiresInSeconds });
    const publicUrl = this.publicCustomDomain
      ? `${this.publicCustomDomain.replace(/\/$/, '')}/${key}`
      : key;

    return {
      uploadUrl,
      key,
      publicUrl,
    };
  }

  /**
   * Delete an object from Cloud Storage
   */
  public async deleteFile(key: string): Promise<boolean> {
    if (!this.hasCloudStorage()) return true;

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.client!.send(command);
      return true;
    } catch (err: any) {
      console.error(`❌ [Storage] ${this.providerName} Delete failed:`, err);
      return false;
    }
  }
}

export const storageService = new CloudStorageService();
