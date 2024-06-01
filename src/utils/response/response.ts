export enum RESPONSE_STATUS_CODE {
  SUCCESS = 200,
  ERROR = 400,
  NOT_FOUND_EMAIL = 4000,
  FREQUENT_SENDING = 4001,
  EMAIL_SEND_FAIL = 4002,
  PLEASE_GET_CAPTCHA = 4003,
  CAPTCHA_ERROR = 4004,
  CAPTCHA_EXPIRED = 4005,
  PASSWORD_EMPTY = 4006,
  PASSWORD_NOT_SAME = 4007,
  PASSWORD_INVALID = 4008,
}

const responseStatusCodeMessageMap = {
  [RESPONSE_STATUS_CODE.SUCCESS]: '成功',
  [RESPONSE_STATUS_CODE.ERROR]: '失败',
  [RESPONSE_STATUS_CODE.NOT_FOUND_EMAIL]: '邮箱不存在',
  [RESPONSE_STATUS_CODE.FREQUENT_SENDING]: '过于频繁, 请稍后再试',
  [RESPONSE_STATUS_CODE.EMAIL_SEND_FAIL]: '邮件发送失败',
  [RESPONSE_STATUS_CODE.PLEASE_GET_CAPTCHA]: '重新获取验证码',
  [RESPONSE_STATUS_CODE.CAPTCHA_ERROR]: '验证码错误',
  [RESPONSE_STATUS_CODE.CAPTCHA_EXPIRED]: '验证码过期',
  [RESPONSE_STATUS_CODE.PASSWORD_EMPTY]: '密码不能为空',
  [RESPONSE_STATUS_CODE.PASSWORD_NOT_SAME]: '两次密码不一致',
  [RESPONSE_STATUS_CODE.PASSWORD_INVALID]: '密码不符合规范',
} as const;

export function getResponseStatusCodeMessage(statusCode: RESPONSE_STATUS_CODE) {
  return responseStatusCodeMessageMap[statusCode];
}

type ApiResponseOptionsStatus = 'success' | 'error';
type ApiResponseOptionsMessage =
  | string
  | typeof responseStatusCodeMessageMap[RESPONSE_STATUS_CODE];

interface ApiResponseOptions {
  status: ApiResponseOptionsStatus;
  statusCode: RESPONSE_STATUS_CODE;
  message: ApiResponseOptionsMessage;
}

export class ApiResponse {
  status: ApiResponseOptionsStatus;
  statusCode: RESPONSE_STATUS_CODE;
  message: ApiResponseOptionsMessage;

  constructor({ statusCode, message, status }: ApiResponseOptions) {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
  }
}

export function sendSuccess({
  status = 'success',
  statusCode = RESPONSE_STATUS_CODE.SUCCESS,
  message = getResponseStatusCodeMessage(statusCode),
}: Partial<ApiResponseOptions> = {}) {
  return new ApiResponse({ status, statusCode, message });
}

export function sendError({
  status = 'error',
  statusCode = RESPONSE_STATUS_CODE.ERROR,
  message = getResponseStatusCodeMessage(statusCode),
}: Partial<ApiResponseOptions> = {}) {
  return new ApiResponse({ status, statusCode, message });
}
