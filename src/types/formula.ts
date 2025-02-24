export type OperatorType = 
  | 'add' 
  | 'subtract' 
  | 'multiply' 
  | 'divide'
  | 'list'
  | 'at'
  | 'first'
  | 'last'
  | 'sort'
  | 'reverse'
  | 'some'
  | 'concat';

export interface FormulaOperator {
  type: OperatorType;
  label: string;
  description: string;
  args: {
    name: string;
    type: 'number' | 'array' | 'variable' | 'function';
  }[];
}

export const FORMULA_OPERATORS: FormulaOperator[] = [
  {
    type: 'add',
    label: 'Add',
    description: 'Add two numbers together',
    args: [
      { name: 'num1', type: 'number' },
      { name: 'num2', type: 'number' }
    ]
  },
  {
    type: 'subtract',
    label: 'Subtract',
    description: 'Subtract second number from first',
    args: [
      { name: 'num1', type: 'number' },
      { name: 'num2', type: 'number' }
    ]
  },
  {
    type: 'multiply',
    label: 'Multiply',
    description: 'Multiply two numbers',
    args: [
      { name: 'num1', type: 'number' },
      { name: 'num2', type: 'number' }
    ]
  },
  {
    type: 'divide',
    label: 'Divide',
    description: 'Divide first number by second',
    args: [
      { name: 'num1', type: 'number' },
      { name: 'num2', type: 'number' }
    ]
  },
  {
    type: 'list',
    label: 'List',
    description: 'Create a list from items',
    args: [
      { name: 'items', type: 'array' }
    ]
  },
  {
    type: 'at',
    label: 'At',
    description: 'Get item at index from list',
    args: [
      { name: 'items', type: 'array' },
      { name: 'index', type: 'number' }
    ]
  },
  // ... add other operators
]; 