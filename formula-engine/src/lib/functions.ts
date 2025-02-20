import type { NextApiRequest, NextApiResponse } from 'next';
import { DateTime } from 'luxon';

// Request body interfaces
export interface AddRequestBody {
  function: 'add';
  num1: number;
  num2: number;
}

export interface SubtractRequestBody {
  function: 'subtract';
  num1: number;
  num2: number;
}

//String funcitons
export interface SubstringRequestBody {
  function: 'substring';
  str: string;
  start: number;
  end?: number;
}

export interface ReplaceRequestBody {
  function: 'replace';
  str: string;
  text: string;
  replace: string;
}

export interface ReplaceAllRequestBody {
  function: 'replaceAll';
  str: string;
  text: string;
  replace: string;
}

export interface LowerRequestBody {
  function: 'lower';
  str: string;
}

export interface UpperRequestBody {
  function: 'upper';
  str: string;
}

export interface RepeatRequestBody {
  function: 'repeat';
  str: string;
  count: number;
}

export interface PadStartRequestBody {
  function: 'padStart';
  str: string;
  length: number;
  text: string;
}

export interface PadEndRequestBody {
  function: 'padEnd';
  str: string;
  length: number;
  text: string;
}

export interface FormatRequestBody {
  function: 'format';
  value: any;
}

export interface FormatDateRequestBody {
  function: 'formatDate';
  date: Date;
  format: string;
  timezone?: string;
}

export interface JoinRequestBody {
  function: 'join';
  list: any[];
  separator: string;
}

export interface FunctionRequestBody {
  function: string;
  [key: string]: any;
}

// Type of the handler functions
type FunctionHandler<T> = (reqBody: T) => any;

// Type Guards for functions
function isAddRequestBody(reqBody: FunctionRequestBody): reqBody is AddRequestBody {
  return reqBody.function === 'add' && typeof reqBody.num1 === 'number' && typeof reqBody.num2 === 'number';
}

function isSubtractRequestBody(reqBody: FunctionRequestBody): reqBody is SubtractRequestBody {
  return reqBody.function === 'subtract' && typeof reqBody.num1 === 'number' && typeof reqBody.num2 === 'number';
}

//String functions
function isSubstringRequestBody(reqBody: FunctionRequestBody): reqBody is SubstringRequestBody {
  return reqBody.function === 'substring' && typeof reqBody.str === 'string' && typeof reqBody.start === 'number' && (reqBody.end === undefined || typeof reqBody.end === 'number');
}

function isReplaceRequestBody(reqBody: FunctionRequestBody): reqBody is ReplaceRequestBody {
  return reqBody.function === 'replace' && typeof reqBody.str === 'string' && typeof reqBody.text === 'string' && typeof reqBody.replace === 'string';
}

function isReplaceAllRequestBody(reqBody: FunctionRequestBody): reqBody is ReplaceAllRequestBody {
  return reqBody.function === 'replaceAll' && typeof reqBody.str === 'string' && typeof reqBody.text === 'string' && typeof reqBody.replace === 'string';
}

function isLowerRequestBody(reqBody: FunctionRequestBody): reqBody is LowerRequestBody {
  return reqBody.function === 'lower' && typeof reqBody.str === 'string';
}

function isUpperRequestBody(reqBody: FunctionRequestBody): reqBody is UpperRequestBody {
  return reqBody.function === 'upper' && typeof reqBody.str === 'string';
}

function isRepeatRequestBody(reqBody: FunctionRequestBody): reqBody is RepeatRequestBody {
  return reqBody.function === 'repeat' && typeof reqBody.str === 'string' && typeof reqBody.count === 'number';
}

function isPadStartRequestBody(reqBody: FunctionRequestBody): reqBody is PadStartRequestBody {
  return reqBody.function === 'padStart' && typeof reqBody.str === 'string' && typeof reqBody.length === 'number' && typeof reqBody.text === 'string';
}

function isPadEndRequestBody(reqBody: FunctionRequestBody): reqBody is PadEndRequestBody {
  return reqBody.function === 'padEnd' && typeof reqBody.str === 'string' && typeof reqBody.length === 'number' && typeof reqBody.text === 'string';
}

function isFormatRequestBody(reqBody: FunctionRequestBody): reqBody is FormatRequestBody {
  return reqBody.function === 'format';
}

function isFormatDateRequestBody(reqBody: FunctionRequestBody): reqBody is FormatDateRequestBody {
  return reqBody.function === 'formatDate' && reqBody.date instanceof Date && typeof reqBody.format === 'string' && (reqBody.timezone === undefined || typeof reqBody.timezone === 'string');
}

function isJoinRequestBody(reqBody: FunctionRequestBody): reqBody is JoinRequestBody {
  return reqBody.function === 'join' && Array.isArray(reqBody.list) && typeof reqBody.separator === 'string';
}

// Function implementations
const add: FunctionHandler<AddRequestBody> = (reqBody) => {
  return reqBody.num1 + reqBody.num2;
}

const subtract: FunctionHandler<SubtractRequestBody> = (reqBody) => {
  return reqBody.num1 - reqBody.num2;
}

//String functions
const substring: FunctionHandler<SubstringRequestBody> = (reqBody) => {
  return reqBody.str.substring(reqBody.start, reqBody.end);
}

const replace: FunctionHandler<ReplaceRequestBody> = (reqBody) => {
  return reqBody.str.replace(reqBody.text, reqBody.replace);
}

const replaceAll: FunctionHandler<ReplaceAllRequestBody> = (reqBody) => {
  return reqBody.str.replaceAll(reqBody.text, reqBody.replace);
}

const lower: FunctionHandler<LowerRequestBody> = (reqBody) => {
  return reqBody.str.toLowerCase();
}

const upper: FunctionHandler<UpperRequestBody> = (reqBody) => {
  return reqBody.str.toUpperCase();
}

const repeat: FunctionHandler<RepeatRequestBody> = (reqBody) => {
  return reqBody.str.repeat(reqBody.count);
}

const padStart: FunctionHandler<PadStartRequestBody> = (reqBody) => {
  return reqBody.str.padStart(reqBody.length, reqBody.text);
}

const padEnd: FunctionHandler<PadEndRequestBody> = (reqBody) => {
  return reqBody.str.padEnd(reqBody.length, reqBody.text);
}

const format: FunctionHandler<FormatRequestBody> = (reqBody) => {
  return reqBody.value.toString();
}

const formatDate: FunctionHandler<FormatDateRequestBody> = (reqBody) => {
  return DateTime.fromJSDate(reqBody.date).setZone(reqBody.timezone).toFormat(reqBody.format);
}

const join: FunctionHandler<JoinRequestBody> = (reqBody) => {
  return reqBody.list.join(reqBody.separator);
}

// Function map
const functionMap: Record<string, FunctionHandler<any>> = {
  add,
  subtract,

  //String functions
  substring,
  replace,
  replaceAll,
  lower,
  upper,
  repeat,
  padStart,
  padEnd,
  format,
  formatDate,
  join,
};

// Export the dispatch function
export const dispatch = (reqBody: FunctionRequestBody) => {
  const handler = functionMap[reqBody.function];
  if (!handler) {
    return undefined;
  }

  // Validate input structure with type guards
  if (isAddRequestBody(reqBody)) {
    return handler(reqBody);
  } else if (isSubtractRequestBody(reqBody)) {
    return handler(reqBody);
  } 

  //String functions
  else if (isSubstringRequestBody(reqBody)) {
    return handler(reqBody);
  } else if (isReplaceRequestBody(reqBody)) {
    return handler(reqBody);
  } else if (isReplaceAllRequestBody(reqBody)) {
    return handler(reqBody);
  } else if (isLowerRequestBody(reqBody)) {
    return handler(reqBody);
  } else if (isUpperRequestBody(reqBody)) {
    return handler(reqBody);
  } else if (isRepeatRequestBody(reqBody)) {
    return handler(reqBody);
  } else if (isPadStartRequestBody(reqBody)) {
    return handler(reqBody);
  } else if (isPadEndRequestBody(reqBody)) {
    return handler(reqBody);
  } else if (isFormatRequestBody(reqBody)) {
    return handler(reqBody);
  } else if (isFormatDateRequestBody(reqBody)) {
    return handler(reqBody);
  } else if (isJoinRequestBody(reqBody)) {
    return handler(reqBody);
  }
  
  return undefined;
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const reqBody: FunctionRequestBody = req.body;
  const result = dispatch(reqBody);
  res.status(200).json({ result });
};
