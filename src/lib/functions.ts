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
<<<<<<< HEAD
const divide: FunctionHandler<DivideRequestBody> = (reqBody) => {
  if (reqBody.num2 === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return reqBody.num1 / reqBody.num2;
}
const multiply: FunctionHandler<MultiplyRequestBody> = (reqBody) => {
  return reqBody.num1 * reqBody.num2;
}
=======
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
  //return the array body items
  return reqBody.items.sort((a,b) =>{
    if (a > b) return -1;
    if (a < b) return 1;
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


>>>>>>> 13-listarrays-formula-feature
// Function map
const functionMap: Record<string, FunctionHandler<any>> = {
  add,
  subtract,
<<<<<<< HEAD
  divide,
  multiply,
=======
  list,
  at,
  first,
  last,
  sort,
  reverse,
  some,
  concat,
>>>>>>> 13-listarrays-formula-feature

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
    }

    return { error: 'Invalid request body' };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
<<<<<<< HEAD
=======
  else if (isListRequestBody(reqBody)) {
    return handler(reqBody);
  }else if (isAtRequestBody(reqBody)) {
    return handler(reqBody);
  } else if (isFirstRequestBody(reqBody)) {
    return handler(reqBody);
  }
  else if (isLastRequestBody(reqBody)) {
    return handler(reqBody);
  }
  else if (isSortRequestBody(reqBody)) {
    return handler(reqBody);
  }
  else if (isReverseRequestBody(reqBody)) {
    return handler(reqBody);
  }
  else if (isSomeRequestBody(reqBody)) {
    return handler(reqBody);
  }
  else if (isConcatRequestBody(reqBody)) {
    return handler(reqBody);
  }

  return undefined;
>>>>>>> 13-listarrays-formula-feature
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const reqBody: FunctionRequestBody = req.body;
  const result = dispatch(reqBody);
  res.status(200).json(result);
};
