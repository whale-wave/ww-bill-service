import * as dotenv from 'dotenv';

dotenv.config();

const {
  SECRET,
  EMAIL_PASSWORD,
  TOKEN_EXPIRES_IN,
  // OSS
  // qi niu
  OSS_QI_NIU_BUCKET,
  OSS_QI_NIU_ACCESS_KEY,
  OSS_QI_NIU_SECRET_KEY,
  OSS_QI_NIU_DOMAIN,
  // ali
  OSS_ALI_REGION,
  OSS_ALI_BUCKET,
  OSS_ALI_ACCESS_KEY_ID,
  OSS_ALI_ACCESS_KEY_SECRET,
  // 默认管理员账号
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_ADMIN_PASSWORD,
  COMPANY_EMAIL,
} = process.env;

export default {
  secret: SECRET || '',
  emailPassword: EMAIL_PASSWORD || '',
  token: {
    expiresIn: TOKEN_EXPIRES_IN || '7d',
  },
  oss: {
    qiniu: {
      bucket: OSS_QI_NIU_BUCKET || '',
      AccessKey: OSS_QI_NIU_ACCESS_KEY || '',
      SecretKey: OSS_QI_NIU_SECRET_KEY || '',
      domain: OSS_QI_NIU_DOMAIN || '',
    },
    ali: {
      region: OSS_ALI_REGION || '',
      bucket: OSS_ALI_BUCKET || '',
      accessKeyId: OSS_ALI_ACCESS_KEY_ID || '',
      accessKeySecret: OSS_ALI_ACCESS_KEY_SECRET || '',
    },
  },
  defaultAdmin: {
    username: DEFAULT_ADMIN_USERNAME || 'admin',
    password: DEFAULT_ADMIN_PASSWORD || 'admin',
  },
  companyEmail: COMPANY_EMAIL || 'avan@whalewave.freeqiye.com',
};
