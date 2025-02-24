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

export interface ListRequestBody<T> {
  function: 'list';
  items: T[];
}
export interface AtRequestBody<T> {
  function: 'at';
  items: T[];
  index: number;
}
export interface FirstRequestBody<T> {
  function: 'first';
  items: T[];
  index: number;
}
export interface LastRequestBody<T> {
  function: 'last';
  items: T[];
}
export interface SortRequestBody<T> {
  function: 'sort';
  items: T[];
}
export interface ReverseRequestBody<T> {
  function: 'reverse';
  items: T[];
}
export interface SomeRequestBody<T> {
  function: 'some';
  items: T[];
  predicate: (item: T) => boolean;
}
export interface ConcatRequestBody<T> {
  function: 'concat';
  lists: T[][];
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


function isListRequestBody<T>(reqBody: FunctionRequestBody): reqBody is ListRequestBody<T> {
  return reqBody.function === 'list' && Array.isArray(reqBody.items);
}
function isAtRequestBody<T>(reqBody: FunctionRequestBody): reqBody is AtRequestBody<T> {
  return reqBody.function === 'at' && Array.isArray(reqBody.items) && typeof reqBody.index === 'number';
}


function isFirstRequestBody<T>(reqBody: FunctionRequestBody): reqBody is FirstRequestBody<T> {
  return reqBody.function === 'first' && Array.isArray(reqBody.items) && typeof reqBody.index === 'number';
}
function isLastRequestBody<T>(reqBody: FunctionRequestBody): reqBody is LastRequestBody<T> {
  return reqBody.function === 'last' && Array.isArray(reqBody.items)
}
function isSortRequestBody<T>(reqBody: FunctionRequestBody): reqBody is SortRequestBody<T> {
  return reqBody.function === 'sort' && Array.isArray(reqBody.items);
}
function isReverseRequestBody<T>(reqBody: FunctionRequestBody): reqBody is ReverseRequestBody<T> {
  return reqBody.function === 'reverse' && Array.isArray(reqBody.items);
}
function isSomeRequestBody<T>(reqBody: FunctionRequestBody): reqBody is SomeRequestBody<T> {
  return reqBody.function === 'some' && Array.isArray(reqBody.items) && typeof reqBody.predicate === 'function';
}
function isConcatRequestBody<T>(reqBody: FunctionRequestBody): reqBody is ConcatRequestBody<T> {
  // Just
  return reqBody.function === 'concat' && Array.isArray(reqBody.lists);
}


// Function implementations
const add: FunctionHandler<AddRequestBody> = (reqBody) => {
  return reqBody.num1 + reqBody.num2;
}

const subtract: FunctionHandler<SubtractRequestBody> = (reqBody) => {
  return reqBody.num1 - reqBody.num2;
}

const multiply: FunctionHandler<MultiplyRequestBody> = (reqBody) => {
  return reqBody.num1 * reqBody.num2;
}

const divide: FunctionHandler<DivideRequestBody> = (reqBody) => {
  if (reqBody.num2 === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return reqBody.num1 / reqBody.num2;
}

const list: FunctionHandler<ListRequestBody<any>> = (reqBody) => {
  //return the array body items
  return reqBody.items;
}
const at: FunctionHandler<AtRequestBody<any>> = (reqBody) => {
  //return the array body items
  return reqBody.items[reqBody.index];
}



// Function map
const functionMap: Record<string, FunctionHandler<any>> = {
  add,
  subtract,
  divide,
  multiply,

};





// Export the dispatch function
export const dispatch = (reqBody: FunctionRequestBody) => {
  const handler = functionMap[reqBody.function];
  if (!handler) {
    return { error: 'Function not found' };
  }

  try {
    // Validate input structure with type guards
    if (isAddRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isSubtractRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isDivideRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isMultiplyRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isListRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isAtRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isFirstRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isLastRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isSortRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isReverseRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isSomeRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isConcatRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    }

    return { error: 'Invalid request body' };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }

};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const reqBody: FunctionRequestBody = req.body;
  const result = dispatch(reqBody);
  res.status(200).json(result);
};
