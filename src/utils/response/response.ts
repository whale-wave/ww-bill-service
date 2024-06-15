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
  CAPTCHA_SEND_FAIL = 4009,
  EMAIL_EMPTY = 4010,
  EMAIL_SAME = 4011,
  PLEASE_GET_NEW_EMAIL_CAPTCHA = 4012,
  NEW_CAPTCHA_EXPIRED = 4013,
  NO_VALID_PARAMETER = 4014,
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
  [RESPONSE_STATUS_CODE.CAPTCHA_SEND_FAIL]: '验证码发送失败',
  [RESPONSE_STATUS_CODE.EMAIL_EMPTY]: '邮箱不能为空',
  [RESPONSE_STATUS_CODE.EMAIL_SAME]: '新邮箱不能与原邮箱相同',
  [RESPONSE_STATUS_CODE.PLEASE_GET_NEW_EMAIL_CAPTCHA]: '请先获取新邮箱验证码',
  [RESPONSE_STATUS_CODE.NEW_CAPTCHA_EXPIRED]: '新验证码过期',
  [RESPONSE_STATUS_CODE.NO_VALID_PARAMETER]: '无效参数',
} as const;

export function getResponseStatusCodeMessage(statusCode: RESPONSE_STATUS_CODE) {
  return responseStatusCodeMessageMap[statusCode];
}

type ApiResponseOptionsStatus = 'success' | 'error';
type ApiResponseOptionsMessage =
  | string
  | typeof responseStatusCodeMessageMap[RESPONSE_STATUS_CODE];

interface ApiResponseOptions<T> {
  status: ApiResponseOptionsStatus;
  statusCode: RESPONSE_STATUS_CODE;
  message: ApiResponseOptionsMessage;
  data?: T;
}

export class ApiResponse<T> {
  status: ApiResponseOptionsStatus;
  statusCode: RESPONSE_STATUS_CODE;
  message: ApiResponseOptionsMessage;
  data?: T;

  constructor({ statusCode, message, status, data }: ApiResponseOptions<T>) {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export function sendSuccess<T>({
  status = 'success',
  statusCode = RESPONSE_STATUS_CODE.SUCCESS,
  message = getResponseStatusCodeMessage(statusCode),
  data,
}: Partial<ApiResponseOptions<T>> = {}) {
  return new ApiResponse<T>({ status, statusCode, message, data });
}

export function sendError<T>({
  status = 'error',
  statusCode = RESPONSE_STATUS_CODE.ERROR,
  message = getResponseStatusCodeMessage(statusCode),
  data,
}: Partial<ApiResponseOptions<T>> = {}) {
  return new ApiResponse<T>({ status, statusCode, message, data });
}
