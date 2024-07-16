/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from "express-serve-static-core";

// if separated into multiple services, separate to multiple files and on a more generic location

export type Request<ReqBody> = core.Request<
  core.ParamsDictionary,
  any,
  ReqBody
>;

export type EmptyRequest = core.Request<core.ParamsDictionary, object, object>;

export interface BaseResponse {
  message?: string;
  error?: string;
}

export type Response<ResBody> = core.Response<ResBody>;

export enum ResponseStatus {
  Success = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
}

export type StackResponse = {
  message: string;
  stackLength?: number;
  stack?: string[];
  item?: string;
};

export type Store = {
  [key: string]: {
    value: string;
    ttl?: number;
    count?: number;
    created_at: Date;
    timeoutId?: NodeJS.Timeout; // nz brat
  };
};

export type StoreResponse = {
  message: string;
  storeWithTTL?: {
    [key: string]: {
      value: string;
      count?: number;
      created_at: Date;
      ttl?: number;
    };
  };
  storeWithoutTTL?: {
    [key: string]: {
      value: string;
      count?: number;
      created_at: Date;
      ttl?: number;
    };
  };
  key?: string;
  value?: string;
  ttl?: number;
  count?: number;
  created_at?: Date;
};
