import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FormulaEngine = () => {
  const [var1Name, setVar1Name] = useState('');
  const [var2Name, setVar2Name] = useState('');
  const [var1Value, setVar1Value] = useState('');
  const [var2Value, setVar2Value] = useState('');
  const [operator, setOperator] = useState('+');
  const [formula, setFormula] = useState('');
  const [error, setError] = useState('');

  // Map UI operator to backend operator keywords
  const mapOperator = (op) => {
    switch (op) {
      case '+':
        return 'add';
      case '-':
        return 'subtract';
      case '*':
        return 'multiply';
      case '/':
        return 'divide';
      default:
        return '';
    }
  };

  const calculateResult = async () => {
    // Reset error and formula
    setError('');
    setFormula('');

    // Build request body
    const requestBody = {
      operand1: parseFloat(var1Value),
      operand2: parseFloat(var2Value),
      operator: mapOperator(operator)
    };

    // Basic input validation for numbers
    if (isNaN(requestBody.operand1) || isNaN(requestBody.operand2)) {
      setError('Both operands must be valid numbers.');
      return;
    }

    try {
      // Adjust the URL if your backend runs on a different port or domain.
      const response = await fetch('http://localhost:3001/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Calculation failed.');
      } else {
        setFormula(`${var1Name} ${operator} ${var2Name} = ${data.result}`);
      }
    } catch (err) {
      setError('An error occurred while calculating.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Formula Engine</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Variable</label>
          <div className="flex gap-2">
            <Input
              placeholder="Name"
              value={var1Name}
              onChange={(e) => setVar1Name(e.target.value)}
              className="w-1/2"
            />
            <Input
              type="number"
              placeholder="Value"
              value={var1Value}
              onChange={(e) => setVar1Value(e.target.value)}
              className="w-1/2"
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <Select value={operator} onValueChange={setOperator}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="+">+</SelectItem>
              <SelectItem value="-">-</SelectItem>
              <SelectItem value="*">×</SelectItem>
              <SelectItem value="/">/</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Second Variable</label>
          <div className="flex gap-2">
            <Input
              placeholder="Name"
              value={var2Name}
              onChange={(e) => setVar2Name(e.target.value)}
              className="w-1/2"
            />
            <Input
              type="number"
              placeholder="Value"
              value={var2Value}
              onChange={(e) => setVar2Value(e.target.value)}
              className="w-1/2"
            />
          </div>
        </div>

        <Button 
          onClick={calculateResult}
          className="w-full text-white bg-black"
          disabled={!var1Name || !var2Name || !var1Value || !var2Value}
        >
          Calculate
        </Button>

        {error && <p className="text-red-500">{error}</p>}

        {formula && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-lg font-medium">Formula:</p>
            <p className="text-xl">{formula}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormulaEngine;
