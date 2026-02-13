// 使用 createRequire 兼容 CommonJS 模块的导入
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 用 require 方式导入 minio（适配其 CommonJS 导出方式）
const Minio = require('minio');
import { ENV } from './env.js';

// 初始化 MinIO 客户端（保留本地测试默认值）
const minioClient = new Minio.Client({
  endPoint: ENV.MINIO_ENDPOINT || 'localhost',
  port: parseInt(ENV.MINIO_PORT || '9000', 10),
  useSSL: ENV.MINIO_SECURE === 'true' || false,
  accessKey: ENV.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: ENV.MINIO_SECRET_KEY || 'minioadmin'
});

// 检查并创建桶
const ensureBucketExists = async () => {
  const bucketName = ENV.MINIO_BUCKET_NAME || 'chatify-profiles';
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`MinIO 桶 ${bucketName} 创建成功`);
    } else {
      console.log(`MinIO 桶 ${bucketName} 已存在`);
    }
  } catch (error) {
    console.error("创建/检查 MinIO 桶失败：", error);
  }
};

ensureBucketExists();

// ESModule 导出
export default minioClient;