import type { NextApiRequest, NextApiResponse } from 'next';
import { DateTime } from 'luxon';

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

//sum(numbers: T[]): T
//returns the sum of the list elements
//limited to one list argument
//example: sum([1, 2, 3]) => 6
export interface SumRequestBody<T> {
  function: 'sum';
  numbers: number[];
}

//list(items: T[]): T[]
//returns the list of items
//limited to one list argument
//example: list([1, 2, 3]) => [1, 2, 3]
export interface ListRequestBody<T> {
  function: 'list';
  items: T[];
}

//at(items: T[], index: number): T
//returns the item at the index
//limited to two arguments
//example: at([1, 2, 3], 1) => 2
export interface AtRequestBody<T> {
  function: 'at';
  items: T[];
  index: number;
}

//first(items: T[]): T
//returns the first item in the list
//limited to one list argument
//example: first([1, 2, 3]) => 1
export interface FirstRequestBody<T> {
  function: 'first';
  items: T[];
}

//last(items: T[]): T
//returns the last item in the list
//limited to one list argument
//example: last([1, 2, 3]) => 3
export interface LastRequestBody<T> {
  function: 'last';
  items: T[];
}

//sort(items: T[]): T[]
//returns the list sorted in ascending order
//limited to one list argument
//example: sort([3, 1, 2]) => [1, 2, 3]
export interface SortRequestBody<T> {
  function: 'sort';
  items: T[];
}

//reverse(items: T[]): T[]
//returns the list reversed
//limited to one list argument
//example: reverse([1, 2, 3]) => [3, 2, 1]
export interface ReverseRequestBody<T> {
  function: 'reverse';
  items: T[];
}

export interface SomeRequestBody<T> {
  function: 'some';
  items: T[];
  predicate: (item: T) => boolean;
}

//concat(lists: T[][]): T[]
//returns the list of lists concatenated
//limited to one list of lists argument
//example: concat([[1, 2], [3, 4]]) => [1, 2, 3, 4]
export interface ConcatRequestBody<T> {
  function: 'concat';
  lists: T[][];
}



//String funcitons

//substring(str: string, start: number, end?: number): string
//returns the substring of a string
//limited to one string argument
//example: substring("hello", 1, 3) => "el"
export interface SubstringRequestBody {
  function: 'substring';
  str: string;
  start: number;
  end?: number;
}

//replace(str: string, text: string, replace: string): string
//returns the string with the text replaced with the replace string
//limited to three string arguments
//example: replace("hello", "e", "a") => "hallo"
export interface ReplaceRequestBody {
  function: 'replace';
  str: string;
  text: string;
  replace: string;
}

//replaceAll(str: string, text: string, replace: string): string
//returns the string with all instances of the text replaced with the replace string
//limited to three string arguments
//example: replaceAll("hello", "l", "a") => "heaao"
export interface ReplaceAllRequestBody {
  function: 'replaceAll';
  str: string;
  text: string;
  replace: string;
}

//lower(str: string): string
//returns the string in lowercase
//limited to one string argument
//example: lower("Hello") => "hello"
export interface LowerRequestBody {
  function: 'lower';
  str: string;
}

//upper(str: string): string
//returns the string in uppercase
//limited to one string argument
//example: upper("hello") => "HELLO"
export interface UpperRequestBody {
  function: 'upper';
  str: string;
}

//repeat(str: string, count: number): string
//returns the string repeated count times
//limited to two string arguments
//example: repeat("hello", 3) => "hellohellohello"
export interface RepeatRequestBody {
  function: 'repeat';
  str: string;
  count: number;
}

//padStart(str: string, length: number, text: string): string
//returns the string padded with the text to the left
//limited to three string arguments
//example: padStart("hello", 10, " ") => "     hello"
export interface PadStartRequestBody {
  function: 'padStart';
  str: string;
  length: number;
  text: string;
}

//padEnd(str: string, length: number, text: string): string
//returns the string padded with the text to the right
//limited to three string arguments
//example: padEnd("hello", 10, " ") => "hello     "
export interface PadEndRequestBody {
  function: 'padEnd';
  str: string;
  length: number;
  text: string;
}

//format(value: any): string
//returns the value formatted as a string
//limited to one value argument
//example: format(1234567890) => "1234567890"
export interface FormatRequestBody {
  function: 'format';
  value: any;
}

//join(list: any[], separator: string): string
//returns the list joined by the separator
//limited to two string arguments
//example: join(["hello", "world"], " ") => "hello world"
export interface JoinRequestBody {
  function: 'join';
  list: any[];
  separator: string;
}

//Date functions

//now(): Date
//returns the current date and time
//limited to no arguments
//example: now() => new Date()
export interface NowRequestBody {
  function: 'now';
  
}

//today(): Date
//returns the current date
//limited to no arguments
//example: today() => new Date()  
export interface TodayRequestBody {
  function: 'today';
  
}

//year(date: Date): number
//returns the year of the given date
//limited to one date argument
//example: year(new Date()) => 2025
export interface YearRequestBody{
  function: 'year';
  date: Date;
}

//month(date: Date): number
//returns the month of the given date
//limited to one date argument
//example: month(new Date()) => 3
export interface MonthRequestBody {
  function: 'month';
  date: Date;

}
//day(date: Date): number
//returns the day of the given date
//limited to one date argument
//example: day(new Date()) => 1
export interface DayRequestBody {
  function: 'day';
  date: Date;
}

//dateAdd(date: Date, days: number): Date 
//returns the date after adding the given number of days
//limited to two arguments
//example: dateAdd(new Date(), 1) => new Date(2025, 2, 2)
export interface DateAddRequestBody {
  function: 'dateAdd';
  date: Date;
  days: number;
}

//dateSubtract(date: Date, days: number): Date 
//returns the date after subtracting the given number of days
//limited to two arguments
//example: dateSubtract(new Date(), 1) => new Date(2025, 2, 1)
export interface DateSubtractRequestBody {
  function: 'dateSubtract';
  date: Date;
  days: number;
}

//dateBetween(startDate: Date, endDate: Date, unit: 'days' | 'months' | 'years'| 'hours' | 'minutes' | 'quateers' | 'seconds'): number
//returns the difference between the two dates in the given unit
//limited to three arguments
//example: dateBetween(new Date(), new Date(), 'days') => 1
export interface DateBetweenRequestBody {
  function: 'dateBetween';
  startDate: Date;
  endDate: Date;
  unit: 'days' | 'months' | 'years'| 'hours' | 'minutes' | 'quateers' | 'seconds';
}

//dateRange(startDate: Date, endDate: Date, unit: 'days' | 'months' | 'years'| 'hours' | 'minutes' | 'quateers' | 'seconds'): number[]
//returns the range of dates between the two dates in the given unit
//limited to three arguments
//example: dateRange(new Date(), new Date(), 'days') => [new Date(), new Date(2025, 2, 2)]
export interface DateRangeRequestBody {
  function: 'dateRange';
  startDate: Date;
  endDate: Date;
  unit: 'days' | 'months' | 'years'| 'hours' | 'minutes' | 'quateers' | 'seconds';
}

//timestamp(date: Date): number
//returns the timestamp of the given date
//limited to one date argument
//example: timestamp(new Date()) => 1714531200000
export interface TimestampRequestBody{
  function: 'timestamp';
  date: Date;
}

//formatDate(date: Date, format: string, timezone?: string): string
//returns the date formatted as a string
//limited to three string arguments
//example: formatDate(new Date(), "yyyy-MM-dd") => "2024-01-01"
export interface FormatDateRequestBody {
  function: 'formatDate';
  date: Date;
  format: string;
  timezone?: string;
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

function isSumRequestBody<T>(reqBody: FunctionRequestBody): reqBody is SumRequestBody<T> {
  return reqBody.function === 'sum' && Array.isArray(reqBody.numbers) && reqBody.numbers.every(num => typeof num === 'number');
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
  return reqBody.function === 'first' && Array.isArray(reqBody.items);
}
function isLastRequestBody<T>(reqBody: FunctionRequestBody): reqBody is LastRequestBody<T> {
  return reqBody.function === 'last' && Array.isArray(reqBody.items);
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
function isNowRequestBody(reqBody: FunctionRequestBody): reqBody is NowRequestBody {
  return reqBody.function === 'now' ;
}
function isTodayRequestBody(reqBody: FunctionRequestBody): reqBody is TodayRequestBody {
  return reqBody.function === 'today' ;
}
function isYearRequestBody(reqBody: FunctionRequestBody): reqBody is YearRequestBody {
  return reqBody.function === 'year' && reqBody.date instanceof Date;
}
function isMonthRequestBody(reqBody: FunctionRequestBody): reqBody is MonthRequestBody {
  return reqBody.function === 'month' && reqBody.date instanceof Date;

}
function isDateAddRequestBody(reqBody: FunctionRequestBody): reqBody is DateAddRequestBody {
  return reqBody.function === 'dateAdd' && reqBody.date instanceof Date && typeof reqBody.days === 'number';
}
function isDateSubtractRequestBody(reqBody: FunctionRequestBody): reqBody is DateSubtractRequestBody {
  return reqBody.function === 'dateSubtract' && reqBody.date instanceof Date && typeof reqBody.days === 'number';
}
function isDayRequestBoady(reqBody: FunctionRequestBody): reqBody is DayRequestBody {
  return reqBody.function === 'day' && reqBody.date instanceof Date;
}
function isDateBetweenRequestBody(reqBody: FunctionRequestBody): reqBody is DateBetweenRequestBody {
  return reqBody.function === 'dateBetween' && reqBody.startDate instanceof Date && reqBody.endDate instanceof Date;
}
function isDateRangeRequestBody(reqBody: FunctionRequestBody): reqBody is DateRangeRequestBody {
  return reqBody.function === 'dateRange' && reqBody.startDate instanceof Date && reqBody.endDate instanceof Date;
}
function isTimestampRequestBody(reqBody: FunctionRequestBody): reqBody is TimestampRequestBody {
  return reqBody.function === 'timestamp' && reqBody.date instanceof Date;
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

const multiply: FunctionHandler<MultiplyRequestBody> = (reqBody) => {
  return reqBody.num1 * reqBody.num2;
}

const divide: FunctionHandler<DivideRequestBody> = (reqBody) => {
  if (reqBody.num2 === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return reqBody.num1 / reqBody.num2;
}

const sum: FunctionHandler<SumRequestBody<any>> = (reqBody) => {
  return reqBody.numbers.reduce((acc, num) => acc + num, 0);
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
const now: FunctionHandler<NowRequestBody> = (reqBody) => {
  return new Date().toLocaleString();
}
const today : FunctionHandler<TodayRequestBody> = (reqBody) => {
  return new Date().toLocaleDateString();
}
const year: FunctionHandler<YearRequestBody> = (reqBody) => {
  return reqBody.date.getFullYear();
}
const month: FunctionHandler<MonthRequestBody> = (reqBody) => {
  return reqBody.date.getMonth() + 1;
}
const day: FunctionHandler<DayRequestBody> = (reqBody) => {
  return reqBody.date.getDate();
}
const dateAdd: FunctionHandler<DateAddRequestBody> = (reqBody) => {
  const date = new Date(reqBody.date);
  date.setDate(date.getDate() + reqBody.days);
  return date;
}
const dateSubtract: FunctionHandler<DateSubtractRequestBody> = (reqBody) => {
  const date = new Date(reqBody.date);
  date.setDate(date.getDate() - reqBody.days);
  return date;
}
const dateRange: FunctionHandler<DateRangeRequestBody> = (reqBody) => {
  const { startDate, endDate } = reqBody;
  return {startDate, endDate};
  
};
const timestamp: FunctionHandler<TimestampRequestBody> = (reqBody) => {
  return reqBody.date.getTime();
}

const dateBetween: FunctionHandler<DateBetweenRequestBody> = (reqBody) => {
  const { startDate, endDate, unit } = reqBody;
  const diff = endDate.getTime() - startDate.getTime();
  switch (unit) {
    case 'days':
      return diff / (1000 * 60 * 60 * 24);
    case 'months':
      return diff / (1000 * 60 * 60 * 24 * 30);
    case 'years':
      return diff / (1000 * 60 * 60 * 24 * 365);
    case 'hours':
      return diff / (1000 * 60 * 60);
    case 'minutes':
      return diff / (1000 * 60);
    case 'seconds':
      return diff / 1000;
    default:
      throw new Error('Invalid unit');
  }
};


//String functions
const substring: FunctionHandler<SubstringRequestBody> = (reqBody) => {
  return { result: reqBody.str.substring(reqBody.start, reqBody.end) };
}

const replace: FunctionHandler<ReplaceRequestBody> = (reqBody) => {
  return { result: reqBody.str.replace(reqBody.text, reqBody.replace) };
}

const replaceAll: FunctionHandler<ReplaceAllRequestBody> = (reqBody) => {
  return { result: reqBody.str.replaceAll(reqBody.text, reqBody.replace) };
}

const lower: FunctionHandler<LowerRequestBody> = (reqBody) => {
  return { result: reqBody.str.toLowerCase() };
}

const upper: FunctionHandler<UpperRequestBody> = (reqBody) => {
  return { result: reqBody.str.toUpperCase() };
}

const repeat: FunctionHandler<RepeatRequestBody> = (reqBody) => {
  return { result: reqBody.str.repeat(reqBody.count) };
}

const padStart: FunctionHandler<PadStartRequestBody> = (reqBody) => {
  return { result: reqBody.str.padStart(reqBody.length, reqBody.text) };
}

const padEnd: FunctionHandler<PadEndRequestBody> = (reqBody) => {
  return { result: reqBody.str.padEnd(reqBody.length, reqBody.text) };
}

const format: FunctionHandler<FormatRequestBody> = (reqBody) => {
  return { result: reqBody.value.toString() };
}

const formatDate: FunctionHandler<FormatDateRequestBody> = (reqBody) => {
  return { result: DateTime.fromJSDate(reqBody.date).setZone(reqBody.timezone).toFormat(reqBody.format) };
}

const join: FunctionHandler<JoinRequestBody> = (reqBody) => {
  return { result: reqBody.list.join(reqBody.separator) };
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
  now, 
  today,
  year,
  month,
  day,
  dateAdd,
  dateSubtract,
  dateRange,
  dateBetween,
  timestamp,
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
  sum,
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
    } else if (isSumRequestBody(reqBody)) {
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
    } else if (isNowRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isTodayRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isYearRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isMonthRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isDayRequestBoady(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isDateAddRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isDateSubtractRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    }else if (isDateRangeRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } //String functions
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
    else if (isDateBetweenRequestBody(reqBody)) {
      return { result: handler(reqBody) };
    } else if (isTimestampRequestBody(reqBody)) {
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
