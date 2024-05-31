import * as crypto from 'crypto';
import { CAPTCHA_EXPIRED_TIME } from '../constant';

export { default as math } from './math';
export * from './response';
export * from './upload';
export * from './validation';
export * from './queryBuilderHelper';
export * from './auth';

export const getFileHash = (file) => {
  const hashSum = crypto.createHash('sha256');
  hashSum.update(file.buffer);
  return hashSum.digest('hex');
};

export function isForgetEmailCaptchaExpired(session: any): boolean {
  if (
    !session.forgetPasswordEmailCodeSendTime ||
    !session.forgetPasswordEmail ||
    !session.forgetPasswordEmailCode
  )
    return true;

  return (
    Date.now() - session.forgetPasswordEmailCodeTime > CAPTCHA_EXPIRED_TIME
  );
}

export function clearAllForgetEmailSessionInfo(session: any) {
  delete session.forgetPasswordEmailCode;
  delete session.forgetPasswordEmail;
  delete session.forgetPasswordEmailCodeSendTime;
}
