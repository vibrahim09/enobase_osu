import type { NextApiRequest, NextApiResponse } from 'next';

// Request body interfaces
export interface FunctionRequestBody {
  function: string;
  [key: string]: any;
}

// Integer functions

// add(num1: number, num2: number): number
// returns the sum of two numbers
// limited to 2 number arguments
// example: add(1, 2) => 3
export interface AddRequestBody {
  function: 'add';
  num1: number;
  num2: number;
}

// subtract(num1: number, num2: number): number
// returns the difference of two numbers
// limited to 2 number arguments
// example: subtract(1, 2) => -1
export interface SubtractRequestBody {
  function: 'subtract';
  num1: number;
  num2: number;
}

// divide(num1: number, num2: number): number
// returns the quotient of two numbers
// limited to 2 number arguments
// example: divide(1, 2) => 0.5
export interface DivideRequestBody {
  function: 'divide';
  num1: number;
  num2: number;
}

// multiply(num1: number, num2: number): number
// returns the product of two numbers
// limited to 2 number arguments
// example: multiply(1, 2) => 2
export interface MultiplyRequestBody {
  function: 'multiply';
  num1: number;
  num2: number;
}

// median(numbers: number[]): number
// returns the median of an array of numbers
// limited to an array of numbers
// example: median([1, 2, 3]) => 2
export interface MedianRequestBody {
  function: 'median';
  numbers: number[];
}

// mean(numbers: number[]): number
// returns the mean of an array of numbers
// limited to an array of numbers
// example: mean([1, 2, 3]) => 2
export interface MeanRequestBody {
  function: 'mean';
  numbers: number[];
}

// min(numbers: number[]): number
// returns the minimum of an array of numbers
// limited to an array of numbers
// example: min([1, 2, 3]) => 1
export interface MinRequestBody {
  function: 'min',
  numbers: number[]
}

// max(numbers: number[]): number
// returns the maximum of an array of numbers
// limited to an array of numbers
// example: max([1, 2, 3]) => 3
export interface MaxRequestBody {
  function: 'max',
  numbers: number[]
}

// round(number: number, precision?: number): number
// returns the number rounded to the precision
// limited to one number argument
// example: round(1.234, 2) => 1.23
export interface RoundRequestBody {
  function: 'round',
  number: number,
  precision?: number,
}

// floor(number: number): number
// returns the number rounded down to the nearest integer
// limited to one number argument
// example: floor(1.234) => 1
export interface FloorRequestBody {
  function: 'floor';
  number: number;
}

// ceil(number: number): number
// returns the number rounded up to the nearest integer
// limited to one number argument
// example: ceil(1.234) => 2
export interface CeilRequestBody {
  function: 'ceil';
  number: number;
}

// pow(base: number, exponent: number): number
// returns the result of a base number raised to the exponent power
// limited to two number arguments
// example: pow(2, 3) => 8
export interface PowRequestBody {
  function: 'pow';
  base: number;
  exponent?: number;
}



// Lists
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

const list: FunctionHandler<ListRequestBody<any>> = (reqBody) => {
  //return the array body items
  return reqBody.items;
}
const at: FunctionHandler<AtRequestBody<any>> = (reqBody) => {
  //return the array body items
  return reqBody.items[reqBody.index];
}

const first: FunctionHandler<FirstRequestBody<any>> = (reqBody) => {
  //return the array body items
  return reqBody.items[0];
}
const last: FunctionHandler<LastRequestBody<any>> = (reqBody) => {
  //return the array body items
  return reqBody.items[reqBody.items.length - 1];
}
const sort: FunctionHandler<SortRequestBody<any>> = (reqBody) => {
  return reqBody.items.sort((a,b) =>{
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
}

const reverse: FunctionHandler<ReverseRequestBody<any>> = (reqBody) => {
  //return the array body items
  return reqBody.items.reverse();
}
const some: FunctionHandler<SomeRequestBody<any>> = (reqBody) => {
  //return the array body items
  return reqBody.items.some(reqBody.predicate);
}
const concat: FunctionHandler<ConcatRequestBody<any>> = (reqBody) => {
  //return the array into one big item
  return reqBody.lists.flat();
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
  pow,
  list,
  at,
  first,
  last,
  sort,
  reverse,
  some,
  concat,
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
    } else if (isMedianRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isMeanRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isMinRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isMaxRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isRoundRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isFloorRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isCeilRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isPowRequestBody(reqBody)) {
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
