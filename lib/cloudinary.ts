import { v2 as cloudinary } from 'cloudinary';

// Validar que las credenciales estén configuradas
const validateCloudinaryConfig = () => {
  const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar] || process.env[envVar]?.includes('your_')
  );
  
  if (missing.length > 0) {
    console.error(
      `⚠️  CLOUDINARY NO CONFIGURADO: Falta configurar ${missing.join(', ')} en tu archivo .env\n` +
      `Obtén tus credenciales en: https://cloudinary.com/console`
    );
  }
};

validateCloudinaryConfig();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

export async function uploadImage(
  file: File,
  folder: string = 'copper'
): Promise<UploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result as UploadResult);
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
