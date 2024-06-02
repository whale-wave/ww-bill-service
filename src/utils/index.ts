import * as crypto from 'crypto';

export const getFileHash = (file: any) => {
  const hashSum = crypto.createHash('sha256');
  hashSum.update(file.buffer);
  return hashSum.digest('hex');
};

export { default as math } from './math';
export * from './response';
export * from './upload';
export * from './validation';
export * from './queryBuilderHelper';
export * from './auth';
export * from './captcha';
export * from './createDefaultCategory';
