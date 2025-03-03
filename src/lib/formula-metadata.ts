import {
  PlusIcon,
  MinusIcon,
  XIcon,
  DivideIcon,
  RotateCcw,
  ArrowDownSquare,
  ArrowUpSquare,
  Superscript,
  TextQuote,
  Replace,
  CaseLower,
  CaseUpper,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  Repeat,
  TypeIcon,
  LineChart as LineChartIcon,
  FileLineChart as FileLineChartIcon,
  ArrowDownToLine,
  ArrowUpToLine,
  Merge,
  List as ListIcon,
  ArrowDownToDot,
  ChevronFirst,
  ChevronLast,
  ArrowUpZa,
  Undo2,
  Sigma,
  Calendar as CalendarIcon,
  ReplaceAll,
  Clock,
  CalendarDays,
  CalendarClock,
  CalendarRange,
  Timer,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  Calendar1Icon,
  CalendarFold,
  CalendarArrowDown
} from 'lucide-react'


export const functionMetadata = {
  // Number functions
  add: { 
    label: 'Add', 
    args: ['num1', 'num2'], 
    icon: PlusIcon,
    docs: 'Returns the sum of two numbers\n\nexample: @add #1 #2 => 3',
    type: 'number'
  },
  subtract: { 
    label: 'Subtract', 
    args: ['num1', 'num2'], 
    icon: MinusIcon,
    docs: 'Returns the difference of two numbers\n\nexample: @subtract #1 #2 => -1',
    type: 'number'
  },
  multiply: { 
    label: 'Multiply', 
    args: ['num1', 'num2'], 
    icon: XIcon,
    docs: 'Returns the product of two numbers\n\nexample: @multiply #1 #2 => 2',
    type: 'number'
  },
  divide: { 
    label: 'Divide', 
    args: ['num1', 'num2'], 
    icon: DivideIcon,
    docs: 'Returns the quotient of two numbers\n\nexample: @divide #1 #2 => 0.5',
    type: 'number'
  },
  round: { 
    label: 'Round', 
    args: ['number', 'precision?'],
    icon: RotateCcw,
    docs: 'Returns the number rounded to the precision\n\nexample: @round #1.234 #2 => 1.23',
    type: 'number'
  },
  floor: { 
    label: 'Floor', 
    args: ['number'],
    icon: ArrowDownSquare,
    docs: 'Returns the number rounded down to the nearest integer\n\nexample: @floor #1.234 => 1',
    type: 'number'
  },
  ceil: { 
    label: 'Ceiling', 
    args: ['number'],
    icon: ArrowUpSquare,
    docs: 'Returns the number rounded up to the nearest integer\n\nexample: @ceil #1.234 => 2',
    type: 'number'
  },
  pow: { 
    label: 'Power', 
    args: ['base', 'exponent?'],
    icon: Superscript,
    docs: 'Returns the result of a base number raised to the exponent power\n\nexample: @pow #2 #3 => 8',
    type: 'number'
  },
  
  // String functions
  substring: {
    label: 'Substring',
    args: ['str', 'start', 'end?'],
    icon: TextQuote,
    docs: 'Returns a portion of a string\n\nexample: @substring #"hello" #1 #3 => "el"',
    type: 'string'
  },
  replace: {
    label: 'Replace',
    args: ['str', 'text', 'replace'],
    icon: Replace,
    docs: 'Replaces text in a string\n\nexample: @replace #"hello" #"e" #"a" => "hallo"',
    type: 'string'
  },
  replaceAll: {
    label: 'Replace All',
    args: ['str', 'text', 'replace'],
    icon: ReplaceAll,
    docs: 'Replaces all occurrences of text in a string\n\nexample: @replaceAll #"hello" #"l" #"a" => "heaao"',
    type: 'string'
  },
  lower: {
    label: 'Lowercase',
    args: ['str'],
    icon: CaseLower,
    docs: 'Converts string to lowercase\n\nexample: @lower #"Hello" => "hello"',
    type: 'string'
  },
  upper: {
    label: 'Uppercase',
    args: ['str'],
    icon: CaseUpper,
    docs: 'Converts string to uppercase\n\nexample: @upper #"hello" => "HELLO"',
    type: 'string'
  },
  padStart: {
    label: 'Pad Start',
    args: ['str', 'length', 'text'],
    icon: AlignHorizontalJustifyEnd,
    docs: 'Pads the start of a string\n\nexample: @padStart #"hello" #10 #" " => "     hello"',
    type: 'string'
  },
  padEnd: {
    label: 'Pad End',
    args: ['str', 'length', 'text'],
    icon: AlignHorizontalJustifyStart,
    docs: 'Pads the end of a string\n\nexample: @padEnd #"hello" #10 #" " => "hello     "',
    type: 'string'
  },
  repeat: {
    label: 'Repeat',
    args: ['str', 'count'],
    icon: Repeat,
    docs: 'Returns the string repeated count times\n\nexample: @repeat #"hello" #3 => "hellohellohello"',
    type: 'string'
  },
  format: {
    label: 'Format',
    args: ['value'],
    icon: TypeIcon,
    docs: 'Returns the value formatted as a string\n\nexample: @format #1234567890 => "1234567890"',
    type: 'string'
  },

  // List functions
  median: { 
    label: 'Median', 
    args: ['numbers'],
    requiresList: true,
    paramName: 'numbers',
    icon: LineChartIcon,
    docs: 'Returns the median of a list variable\n\nexample: @median #[1, 2, 3] => 2',
    type: 'list'
  },
  mean: { 
    label: 'Mean', 
    args: ['numbers'],
    requiresList: true,
    paramName: 'numbers',
    icon: FileLineChartIcon,
    docs: 'Returns the mean of a list variable\n\nexample: @mean #[1, 2, 3] => 2',
    type: 'list'
  },
  min: { 
    label: 'Minimum', 
    args: ['numbers'],
    requiresList: true,
    paramName: 'numbers',
    icon: ArrowDownToLine,
    docs: 'Returns the minimum value in a list\n\nexample: @min #[1, 2, 3] => 1',
    type: 'list'
  },
  max: { 
    label: 'Maximum', 
    args: ['numbers'],
    requiresList: true,
    paramName: 'numbers',
    icon: ArrowUpToLine,
    docs: 'Returns the maximum value in a list\n\nexample: @max #[1, 2, 3] => 3',
    type: 'list'
  },
  join: {
    label: 'Join',
    args: ['list', 'separator'],
    requiresList: true,
    paramName: 'list',
    icon: Merge,
    docs: 'Returns the list joined by the separator\n\nexample: @join #["hello", "world"] #" " => "hello world"',
    type: 'list'
  },
  list: {
    label: 'List',
    args: ['items'],
    requiresList: true,
    paramName: 'items',
    icon: ListIcon,
    docs: 'Returns the list of items\n\nexample: @list #[1, 2, 3] => [1, 2, 3]',
    type: 'list'
  },
  at: {
    label: 'At',
    args: ['items', 'index'],
    requiresList: true,
    paramName: 'items',
    icon: ArrowDownToDot,
    docs: 'Returns the item at the index\n\nexample: @at #[1, 2, 3], 1 => 2',
    type: 'list'
  },
  first: {
    label: 'First',
    args: ['items'],
    requiresList: true,
    paramName: 'items',
    icon: ChevronFirst,
    docs: 'Returns the first item in the list\n\nexample: @first #[1, 2, 3] => 1',
    type: 'list'
  },
  last: {
    label: 'Last',
    args: ['items'],
    requiresList: true,
    paramName: 'items',
    icon: ChevronLast,
    docs: 'Returns the last item in the list\n\nexample: @last #[1, 2, 3] => 3',
    type: 'list'
  },
  sort: {
    label: 'Sort',
    args: ['items'],
    requiresList: true,
    paramName: 'items',
    icon: ArrowUpZa,
    docs: 'Returns the list sorted in ascending order\n\nexample: @sort #[3, 1, 2] => [1, 2, 3]',
    type: 'list'
  },
  reverse: {
    label: 'Reverse',
    args: ['items'],
    requiresList: true,
    paramName: 'items',
    icon: Undo2,
    docs: 'Returns the list reversed\n\nexample: @reverse #[1, 2, 3] => [3, 2, 1]',
    type: 'list'
  },
  sum: { 
    label: 'Sum', 
    args: ['numbers'],
    requiresList: true,
    paramName: 'numbers',
    icon: Sigma,
    docs: 'Returns the sum of a list of numbers\n\nexample: @sum #[1, 2, 3] => 6',
    type: 'list'
  },
  
  // Date functions
  formatDate: {
    label: 'Format Date',
    args: ['date', 'format', 'timezone?'],
    icon: CalendarIcon,
    docs: 'Returns the date formatted as a string\n\nexample: @formatDate #date #"yyyy-MM-dd" => "2024-01-01"',
    type: 'date'
  },
  now: {
    label: 'Now',
    args: [],
    icon: Clock,
    docs: 'Returns the current date and time\n\nexample: @now => "5/15/2024, 10:30:45 AM"',
    type: 'date'
  },
  today: {
    label: 'Today',
    args: [],
    icon: CalendarDays,
    docs: 'Returns the current date\n\nexample: @today => "5/15/2024"',
    type: 'date'
  },
  year: {
    label: 'Year',
    args: ['date'],
    icon: CalendarClock,
    docs: 'Returns the year of the given date\n\nexample: @year #date => 2024',
    type: 'date'
  },
  month: {
    label: 'Month',
    args: ['date'],
    icon: CalendarFold,
    docs: 'Returns the month of the given date\n\nexample: @month #date => 5',
    type: 'date'
  },
  day: {
    label: 'Day',
    args: ['date'],
    icon: Calendar1Icon,
    docs: 'Returns the day of the given date\n\nexample: @day #date => 15',
    type: 'date'
  },
  dateAdd: {
    label: 'Date Add',
    args: ['date', 'days'],
    icon: CalendarPlus,
    docs: 'Returns the date after adding the given number of days\n\nexample: @dateAdd #date #1 => "5/16/2024"',
    type: 'date'
  },
  dateSubtract: {
    label: 'Date Subtract',
    args: ['date', 'days'],
    icon: CalendarMinus,
    docs: 'Returns the date after subtracting the given number of days\n\nexample: @dateSubtract #date #1 => "5/14/2024"',
    type: 'date'
  },
  dateBetween: {
    label: 'Date Between',
    args: ['startDate', 'endDate', 'unit'],
    icon: CalendarRange,
    docs: 'Returns the difference between two dates in the given unit\n\nexample: @dateBetween #startDate #endDate #"days" => 5',
    type: 'date'
  },
  dateRange: {
    label: 'Date Range',
    args: ['startDate', 'endDate', 'unit'],
    icon: CalendarArrowDown,
    docs: 'Returns the range of dates between the two dates in the given unit\n\nexample: @dateRange #startDate #endDate #"days" => [date1, date2, ...]',
    type: 'date'
  },
  timestamp: {
    label: 'Timestamp',
    args: ['date'],
    icon: Timer,
    docs: 'Returns the timestamp of the given date\n\nexample: @timestamp #date => 1714531200000',
    type: 'date'
  }
} as const 