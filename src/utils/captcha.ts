import {
  CAPTCHA_EXPIRED_TIME,
  CAPTCHA_SEND_TIME_SUFFIX,
  CAPTCHA_SUFFIX,
  FORGET_PASSWORD_EMAIL_CODE_TIMEOUT_TIME,
} from '../constant';

export enum CaptchaSessionType {
  FORGET_PASSWORD_EMAIL = 'FORGET_PASSWORD_EMAIL',
}

const captchaSessionKeyMap = {
  [CaptchaSessionType.FORGET_PASSWORD_EMAIL]: 'forgetPasswordEmail',
} as const;

export function getCaptchaSessionKey(type: CaptchaSessionType) {
  return captchaSessionKeyMap[type];
}

export function setCaptchaSessionInfo(
  session: any,
  type: CaptchaSessionType,
  data: {
    captcha: string;
    email: string;
    captchaSendTime: number;
  },
) {
  switch (type) {
    case CaptchaSessionType.FORGET_PASSWORD_EMAIL:
      const key = getCaptchaSessionKey(type);

      session[`${key}`] = data.email;
      session[`${key}${CAPTCHA_SUFFIX}`] = data.captcha;
      session[`${key}${CAPTCHA_SEND_TIME_SUFFIX}`] = data.captchaSendTime;

      return true;
    default:
      return false;
  }
}

export function clearAllCaptchaSessionInfo(
  session: any,
  type: CaptchaSessionType,
) {
  switch (type) {
    case CaptchaSessionType.FORGET_PASSWORD_EMAIL:
      const key = getCaptchaSessionKey(type);

      delete session[`${key}`];
      delete session[`${key}${CAPTCHA_SUFFIX}`];
      delete session[`${key}${CAPTCHA_SEND_TIME_SUFFIX}`];

      return true;
    default:
      return false;
  }
}

export function isEmailAndCaptchaCorrect(
  session: any,
  type: CaptchaSessionType,
  data: {
    email: string;
    captcha: string;
  },
): boolean {
  const key = getCaptchaSessionKey(type);

  return (
    session[`${key}`] &&
    session[`${key}${CAPTCHA_SUFFIX}`] &&
    session[`${key}`] === data.email &&
    session[`${key}${CAPTCHA_SUFFIX}`] === data.captcha
  );
}

export function isCaptchaExpired(
  session: any,
  type: CaptchaSessionType,
): boolean {
  const key = getCaptchaSessionKey(type);

  if (session[`${key}${CAPTCHA_SEND_TIME_SUFFIX}`]) {
    return (
      Date.now() - session[`${key}${CAPTCHA_SEND_TIME_SUFFIX}`] >
      CAPTCHA_EXPIRED_TIME
    );
  }

  return true;
}

export function isAllowSendByCaptchaSendTime(
  session: any,
  type: CaptchaSessionType,
) {
  const key = getCaptchaSessionKey(type);

  if (session[`${key}${CAPTCHA_SEND_TIME_SUFFIX}`]) {
    return (
      Date.now() - session[`${key}${CAPTCHA_SEND_TIME_SUFFIX}`] >
      FORGET_PASSWORD_EMAIL_CODE_TIMEOUT_TIME
    );
  }

  return true;
}

export function hasCaptchaSessionInfo(session: any, type: CaptchaSessionType) {
  const key = getCaptchaSessionKey(type);
  return (
    session[`${key}`] &&
    session[`${key}${CAPTCHA_SUFFIX}`] &&
    session[`${key}${CAPTCHA_SEND_TIME_SUFFIX}`]
  );
}
