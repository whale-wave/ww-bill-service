import * as dotenv from 'dotenv';

dotenv.config();

const {
  SECRET,
  EMAIL_PASSWORD,
  OSS_QI_NIU_BUCKET,
  OSS_QI_NIU_ACCESS_KEY,
  OSS_QI_NIU_SECRET_KEY,
  OSS_QI_NIU_DOMAIN,
  OSS_ALI_REGION,
  OSS_ALI_BUCKET,
  OSS_ALI_ACCESS_KEY_ID,
  OSS_ALI_ACCESS_KEY_SECRET,
} = process.env;

export default {
  secret: SECRET || '',
  emailPassword: EMAIL_PASSWORD || '',
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
};
