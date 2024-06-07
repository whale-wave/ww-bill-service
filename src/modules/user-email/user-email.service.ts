import { Injectable } from '@nestjs/common';

export interface ChangeEmailInfoSession {
  userId: number;
  email: string;
  captcha: string;
  captchaSendTime: number;
  newEmail?: string;
  newCaptcha?: string;
}

const key = 'changeEmail';

@Injectable()
export class UserEmailService {
  setChangeEmailInfoBySession(session: any, data: ChangeEmailInfoSession) {
    session[key] = data;
  }

  setChangeEmailInfoFieldBySession(session: any, key: keyof ChangeEmailInfoSession, value: ChangeEmailInfoSession) {
    session[key] = value;
  }

  getChangeEmailInfoBySession(
    session: any,
  ): ChangeEmailInfoSession | undefined {
    return session[key];
  }

  verifyChangeEmailCaptchaBySendTime(sendTime: number): boolean {
    return Date.now() - sendTime < 60 * 1000;
  }
}
