import * as crypto from 'node:crypto';

export function getFileHash(file: any) {
  const hashSum = crypto.createHash('sha256');
  hashSum.update(file.buffer);
  return hashSum.digest('hex');
}

export function removeUndefinedField(obj: any) {
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
  return obj;
}

export * from './math';
export * from './response';
export * from './upload';
export * from './validation';
export * from './queryBuilderHelper';
export * from './auth';
export * from './captcha';
export * from './createDefaultCategory';
