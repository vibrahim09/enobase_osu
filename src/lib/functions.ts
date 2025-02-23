import type { NextApiRequest, NextApiResponse } from 'next';

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

export interface DivideRequestBody {
  function: 'divide';
  num1: number;
  num2: number;
}


export interface MultiplyRequestBody {
  function: 'multiply';
  num1: number;
  num2: number;
}


export interface FunctionRequestBody {
  function: string;
  [key: string]: any;
}

export interface MedianRequestBody {
  function: 'median';
  numbers: number[];
}

export interface MeanRequestBody {
  function: 'mean';
  numbers: number[];
}

export interface MinRequestBody {
  function: 'min',
  numbers: number[]
}

export interface MaxRequestBody {
  function: 'max',
  numbers: number[]
}

export interface RoundRequestBody {
  function: 'round',
  number: number,
  precision?: number,
}

export interface FloorRequestBody {
  function: 'floor';
  number: number;
}

export interface CeilRequestBody {
  function: 'ceil';
  number: number;
}

export interface PowRequestBody {
  function: 'pow';
  base: number;
  exponent?: number;
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
function isDivideRequestBody(reqBody: FunctionRequestBody): reqBody is DivideRequestBody {
  return reqBody.function === 'divide' && typeof reqBody.num1 === 'number' && typeof reqBody.num2 === 'number';
}


function isMultiplyRequestBody(reqBody: FunctionRequestBody): reqBody is MultiplyRequestBody {
  return reqBody.function === 'multiply' && typeof reqBody.num1 === 'number' && typeof reqBody.num2 === 'number';
}

function isMedianRequestBody(reqBody: FunctionRequestBody): reqBody is MedianRequestBody {
  return reqBody.function === 'median' && Array.isArray(reqBody.numbers) && reqBody.numbers.every(num => typeof num === 'number');
}

function isMeanRequestBody(reqBody: FunctionRequestBody): reqBody is MeanRequestBody {
  return reqBody.function === 'mean' && Array.isArray(reqBody.numbers) && reqBody.numbers.every(num => typeof num === 'number');
}

function isMinRequestBody(reqBody: FunctionRequestBody): reqBody is MinRequestBody {
  return reqBody.function === 'min' && Array.isArray(reqBody.numbers) && reqBody.numbers.every(num => typeof num === 'number')
}

function isMaxRequestBody(reqBody: FunctionRequestBody): reqBody is MaxRequestBody {
  return reqBody.function === 'max' && Array.isArray(reqBody.numbers) && reqBody.numbers.every(num => typeof num === 'number');
}

function isRoundRequestBody(reqBody: FunctionRequestBody): reqBody is RoundRequestBody {
  return reqBody.function === 'round' && typeof reqBody.number === 'number' && (reqBody.precision === undefined || typeof reqBody.precision === 'number')
}

function isFloorRequestBody(reqBody: FunctionRequestBody): reqBody is FloorRequestBody {
  return reqBody.function === 'floor' && typeof reqBody.number === 'number';
}

function isCeilRequestBody(reqBody: FunctionRequestBody): reqBody is CeilRequestBody {
  return reqBody.function === 'ceil' && typeof reqBody.number === 'number';
}

function isPowRequestBody(reqBody: FunctionRequestBody): reqBody is PowRequestBody {
  return reqBody.function === 'pow' && typeof reqBody.base === 'number' && (reqBody.exponent === undefined || typeof reqBody.exponent === 'number');
}


// Function implementations
const add: FunctionHandler<AddRequestBody> = (reqBody) => {
  return reqBody.num1 + reqBody.num2;
}

const subtract: FunctionHandler<SubtractRequestBody> = (reqBody) => {
  return reqBody.num1 - reqBody.num2;
}
const divide: FunctionHandler<DivideRequestBody> = (reqBody) => {
  return reqBody.num1 / reqBody.num2;
}
const multiply: FunctionHandler<MultiplyRequestBody> = (reqBody) => {
  return reqBody.num1 * reqBody.num2;
}

const median: FunctionHandler<MedianRequestBody> = (reqBody) => {
  const sortedNumbers = reqBody.numbers.slice().sort((a, b) => a - b);
  const mid = Math.floor(sortedNumbers.length / 2);
  return sortedNumbers.length % 2 !== 0 ? sortedNumbers[mid] : (sortedNumbers[mid - 1] + sortedNumbers[mid]) / 2;
}

const mean: FunctionHandler<MeanRequestBody> = (reqBody) => {
  const sum = reqBody.numbers.reduce((acc, num) => acc + num, 0);
  return sum / reqBody.numbers.length;
}

const min: FunctionHandler<MinRequestBody> = (reqBody) => {
  return reqBody.numbers.length === 0 ? undefined : Math.min(...reqBody.numbers)
}

const max: FunctionHandler<MaxRequestBody> = (reqBody) => {
  return reqBody.numbers.length === 0 ? undefined : Math.max(...reqBody.numbers)
}

const round: FunctionHandler<RoundRequestBody> = (reqBody) => {
  const precision = reqBody.precision ?? 0
  const factor = Math.pow(10, precision)
  return Math.round(reqBody.number * factor) / factor
}

const floor: FunctionHandler<FloorRequestBody> = (reqBody) => {
  return Math.floor(reqBody.number);
}

const ceil: FunctionHandler<CeilRequestBody> = (reqBody) => {
  return Math.ceil(reqBody.number);
}

const pow: FunctionHandler<PowRequestBody> = (reqBody) => {
  const exponent = reqBody.exponent ?? 2;
  return Math.pow(reqBody.base, exponent);
}


// Function map
const functionMap: Record<string, FunctionHandler<any>> = {
  add,
  subtract,
  divide,
  multiply,
  median,
  mean,
  min,
  max,
  round,
  floor,
  ceil,
  pow
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
  else if (isDivideRequestBody(reqBody)) {
    return handler(reqBody);
  }
  else if (isMultiplyRequestBody(reqBody)) {
    return handler(reqBody);
  }
  else if (isMedianRequestBody(reqBody)) {
    return handler(reqBody)
  }
  else if (isMeanRequestBody(reqBody)) {
    return handler(reqBody)
  }
  else if (isMinRequestBody(reqBody)) {
    return handler(reqBody)
  }
  else if (isMaxRequestBody(reqBody)) {
    return handler(reqBody)
  }
  else if (isRoundRequestBody(reqBody)) {
    return handler(reqBody)
  }
  else if (isFloorRequestBody(reqBody)) {
    return handler(reqBody)
  }
  else if (isCeilRequestBody(reqBody)) {
    return handler(reqBody)
  }
  else if (isPowRequestBody(reqBody)) {
    return handler(reqBody)
  }




  return undefined;
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const reqBody: FunctionRequestBody = req.body;
  const result = dispatch(reqBody);
  res.status(200).json({ result });
};
