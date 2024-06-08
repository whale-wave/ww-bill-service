import { Injectable } from '@nestjs/common';

export interface ChangeEmailInfoSession {
  userId: number;
  email: string;
  captcha: string;
  captchaSendTime: number;
  newEmailMatchCaptcha?: string;
  newEmail?: string;
  newCaptcha?: string;
  newCaptchaSendTime?: number;
}

const changeEmailSessionKey = 'changeEmail';

@Injectable()
export class UserEmailService {
  setChangeEmailInfoBySession(
    session: any,
    data: Partial<ChangeEmailInfoSession>,
    replace = false,
  ) {
    if (replace) {
      session[changeEmailSessionKey] = data;
    } else {
      session[changeEmailSessionKey] = {
        ...session[changeEmailSessionKey],
        ...data,
      };
    }
  }

  setChangeEmailInfoFieldBySession(
    session: any,
    key: keyof ChangeEmailInfoSession,
    value: ChangeEmailInfoSession,
  ) {
    session[changeEmailSessionKey][key] = value;
  }

  getChangeEmailInfoBySession(
    session: any,
  ): ChangeEmailInfoSession | undefined {
    return session[changeEmailSessionKey];
  }

  verifyChangeEmailCaptchaBySendTime(sendTime: number): boolean {
    return Date.now() - sendTime < 5 * 60 * 1000;
  }

  isAllowSendChangeEmailCaptchaBySendTime(sendTime: number): boolean {
    return Date.now() - sendTime > 60 * 1000;
  }

  clearChangeEmailInfoBySession(session: any) {
    delete session[changeEmailSessionKey];
  }
}
