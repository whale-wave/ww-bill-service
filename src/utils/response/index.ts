import { HttpException } from '@nestjs/common';
import {
  createdObject,
  deletedObject,
  failObject,
  successObject,
  updatedObject,
} from './baseObject';
import { RESPONSE_STATUS_CODE } from './response';

export type SuccessResponse = {
  statusCode: RESPONSE_STATUS_CODE;
  message: string;
};

export type SuccessDataResponse<T> = {
  data?: T;
} & SuccessResponse;

export const success = async <T>(
  dataOrMessage: T | string,
  message?: string,
): Promise<SuccessDataResponse<T>> => {
  if (typeof dataOrMessage === 'string') {
    return successObject(dataOrMessage);
  }
  if (typeof message === 'string') {
    return { ...successObject(message), data: dataOrMessage };
  }
  return { ...successObject(), data: dataOrMessage };
};

export const created = async (message?: string) => createdObject(message);

export const updated = async (message?: string) => updatedObject(message);

export const deleted = async (message?: string) => deletedObject(message);

export const fail = async (message?: string) => failObject(message);

export const throwFail = (
  message?: string,
  httpStatus = RESPONSE_STATUS_CODE.ERROR,
) => {
  throw new HttpException(failObject(message), httpStatus);
};

export * from './response';
