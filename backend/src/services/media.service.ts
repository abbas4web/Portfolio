import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary if credentials exist
if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
}

export interface UploadResult {
  url: string;
  publicId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export class CloudMediaService {
  /**
   * Upload buffer directly to Cloudinary or fallback to server static uploads
   */
  static async uploadImage(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder = 'portfolio'
  ): Promise<UploadResult> {
    const isCloudinaryConfigured = Boolean(
      config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret
    );

    if (isCloudinaryConfigured) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error || !result) {
              return reject(new Error(error?.message || 'Cloudinary upload failed'));
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              filename: originalName,
              mimeType,
              sizeBytes: result.bytes,
            });
          }
        );
        uploadStream.end(buffer);
      });
    }

    // Fallback: Store locally in backend/uploads directory if cloud keys are not configured yet
    const uploadsDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(originalName) || '.png';
    const cleanFilename = `${path.basename(originalName, ext)}-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadsDir, cleanFilename);

    fs.writeFileSync(filePath, buffer);

    const fallbackUrl = `http://localhost:${config.port}/uploads/${cleanFilename}`;
    return {
      url: fallbackUrl,
      publicId: cleanFilename,
      filename: originalName,
      mimeType,
      sizeBytes: buffer.length,
    };
  }

  /**
   * Delete image from Cloudinary or local disk
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    const isCloudinaryConfigured = Boolean(
      config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret
    );

    if (isCloudinaryConfigured) {
      const res = await cloudinary.uploader.destroy(publicId);
      return res.result === 'ok';
    }

    const localPath = path.resolve(__dirname, '../../uploads', publicId);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
      return true;
    }
    return false;
  }
}
