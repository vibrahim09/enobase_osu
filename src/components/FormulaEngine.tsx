'use client'

import { useRef, useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DivideIcon, MinusIcon, PlusIcon, X as XIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDrag } from '@/hooks/useDrag'
import { CanvasItem, Position } from '@/types'
import { cn } from '@/lib/utils'
import { FunctionSquare } from 'lucide-react'
import { FunctionRequestBody } from '@/lib/functions'

interface FormulaEngineProps {
  item: CanvasItem
  variables: CanvasItem[]
  onPositionChange: (position: Position) => void
  onUpdate: (updates: Partial<CanvasItem>) => void
  onDelete: () => void
  onEditingEnd: () => void
}

// Define function metadata for UI rendering with docs
const functionMetadata = {
  add: { 
    label: 'Add', 
    args: ['num1', 'num2'], 
    icon: PlusIcon,
    docs: 'Returns the sum of two numbers\n\nexample: add(1, 2) => 3'
  },
  subtract: { 
    label: 'Subtract', 
    args: ['num1', 'num2'], 
    icon: MinusIcon,
    docs: 'Returns the difference of two numbers\n\nexample: subtract(1, 2) => -1'
  },
  multiply: { 
    label: 'Multiply', 
    args: ['num1', 'num2'], 
    icon: XIcon,
    docs: 'Returns the product of two numbers\n\nexample: multiply(1, 2) => 2'
  },
  divide: { 
    label: 'Divide', 
    args: ['num1', 'num2'], 
    icon: DivideIcon,
    docs: 'Returns the quotient of two numbers\n\nexample: divide(1, 2) => 0.5'
  },
  round: { 
    label: 'Round', 
    args: ['number', 'precision?'],
    docs: 'Returns the number rounded to the precision\n\nexample: round(1.234, 2) => 1.23'
  },
  floor: { 
    label: 'Floor', 
    args: ['number'],
    docs: 'Returns the number rounded down to the nearest integer\n\nexample: floor(1.234) => 1'
  },
  ceil: { 
    label: 'Ceiling', 
    args: ['number'],
    docs: 'Returns the number rounded up to the nearest integer\n\nexample: ceil(1.234) => 2'
  },
  pow: { 
    label: 'Power', 
    args: ['base', 'exponent?'],
    docs: 'Returns the result of a base number raised to the exponent power\n\nexample: pow(2, 3) => 8'
  },
  median: { 
    label: 'Median', 
    args: ['numbers'],
    requiresList: true,
    docs: 'Returns the median of a list variable\n\nexample: median([1, 2, 3]) => 2'
  },
  mean: { 
    label: 'Mean', 
    args: ['numbers'],
    requiresList: true,
    docs: 'Returns the mean of a list variable\n\nexample: mean([1, 2, 3]) => 2'
  },
  min: { 
    label: 'Minimum', 
    args: ['numbers'],
    requiresList: true,
    docs: 'Returns the minimum value in a list\n\nexample: min([1, 2, 3]) => 1'
  },
  max: { 
    label: 'Maximum', 
    args: ['numbers'],
    requiresList: true,
    docs: 'Returns the maximum value in a list\n\nexample: max([1, 2, 3]) => 3'
  },
} as const

type FunctionType = keyof typeof functionMetadata

const FormulaEngine = ({ item, variables, onPositionChange, onUpdate, onDelete, onEditingEnd }: FormulaEngineProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [operand1, setOperand1] = useState<string>('')
  const [operand2, setOperand2] = useState<string>('')
  const [operator, setOperator] = useState<string>('')
  const [result, setResult] = useState<number | string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const calculationTimeoutRef = useRef<NodeJS.Timeout>()
  const [selectedFunction, setSelectedFunction] = useState<FunctionType | ''>('')
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [arrayInputs, setArrayInputs] = useState<string[]>([])

  const { position, startDrag } = useDrag({
    initialPosition: item.position,
    onDragEnd: onPositionChange,
    disabled: isEditing,
  })

  // Reset operands if variables are deleted
  useEffect(() => {
    const validVariables = variables.map(v => v.id)
    if (operand1 && !validVariables.includes(operand1)) {
      setOperand1('')
    }
    if (operand2 && !validVariables.includes(operand2)) {
      setOperand2('')
    }
  }, [variables, operand1, operand2])

  // Calculate result using backend API with debouncing
  useEffect(() => {
    const performCalculation = async () => {
      if (!selectedFunction) {
        setResult(null)
        return
      }

      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current)
      }

      const loadingTimeout = setTimeout(() => {
        setIsCalculating(true)
      }, 500)

      try {
        let requestBody: FunctionRequestBody = {
          function: selectedFunction,
        }

        // Build request body based on function type
        const metadata = functionMetadata[selectedFunction]
        
        metadata.args.forEach(arg => {
          const baseArg = arg.replace('?', '') // Remove optional indicator
          if (inputs[baseArg]) {
            const variable = variables.find(v => v.id === inputs[baseArg])
            if (variable) {
              if (variable.variableType === 'list') {
                // Parse list string into array
                const listValue = typeof variable.value === 'string' 
                  ? variable.value.split(',').map(v => Number(v.trim()))
                  : []
                requestBody[baseArg] = listValue
              } else {
                requestBody[baseArg] = variable.value
              }
            }
          }
        })

        const response = await fetch('/api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })

        const data = await response.json()
        
        if ('error' in data) {
          setResult(data.error)
          return
        }

        const resultValue = data.result
        const numericResult = Number(resultValue)
        
        setResult(
          Number.isFinite(numericResult) 
            ? Number(numericResult.toFixed(2)) 
            : null
        )
      } catch (error) {
        console.error('Calculation error:', error)
        setResult('An error occurred')
      } finally {
        clearTimeout(loadingTimeout)
        setIsCalculating(false)
      }
    }

    calculationTimeoutRef.current = setTimeout(performCalculation, 100)

    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current)
      }
    }
  }, [selectedFunction, inputs, variables])

  // Update linked variable when result changes
  useEffect(() => {
    if (result === null) return

    const linkedVarId = `linked-${item.id}`
    const existingVar = variables.find(v => v.id === linkedVarId)
    
    const linkedVariable: CanvasItem = {
      id: linkedVarId,
      type: 'variable',
      position: { x: position.x, y: position.y + 200 },
      name: `${item.name} (Result)`,
      value: result
    }

    if (!existingVar || existingVar.value !== result) {
      onUpdate({ linkedVariable })
    }
  }, [result, item.id, item.name, position.x, position.y, variables, onUpdate])

  // Filter out this formula's linked variable from the available variables
  const availableVariables = variables.filter(variable => variable.id !== `linked-${item.id}`)

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    
    // Update formula name
    onUpdate({ name: newName })

    // Update linked variable name if it exists
    const linkedVarId = `linked-${item.id}`
    const existingVar = variables.find(v => v.id === linkedVarId)
    
    if (existingVar) {
      onUpdate({ 
        linkedVariable: {
          ...existingVar,
          name: `${newName} (Result)`
        }
      })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditing) {
      startDrag(e)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    onEditingEnd()
  }

  const renderInputs = () => {
    if (!selectedFunction) return null

    const metadata = functionMetadata[selectedFunction]

    // Filter variables based on function requirements
    const eligibleVariables = availableVariables.filter(variable => {
      if (metadata.requiresList) {
        return variable.variableType === 'list'
      }
      return variable.variableType === 'number' || variable.variableType === 'list'
    })

    return (
      <div className="grid grid-cols-1 gap-2">
        {metadata.args.map(arg => {
          const isOptional = arg.endsWith('?')
          const baseArg = arg.replace('?', '')
          return (
            <Select 
              key={baseArg}
              value={inputs[baseArg] || ''} 
              onValueChange={(value) => setInputs(prev => ({ ...prev, [baseArg]: value }))}
              
            >
              <SelectTrigger>
                <SelectValue placeholder={`${baseArg}${isOptional ? ' (optional)' : ''}`}/>
              </SelectTrigger>
              <SelectContent>
                {eligibleVariables.map(variable => (
                  <SelectItem 
                    className="font-medium text-muted-foreground pl-2" 
                    key={variable.id} 
                    value={variable.id}
                    disabled={metadata.requiresList && variable.variableType !== 'list'}
                  >
                    {variable.name} ({variable.variableType})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        })}
      </div>
    )
  }

  return (
    <Card
      ref={cardRef}
      className={cn(
        "absolute w-80",
        !isEditing && "cursor-move",
        "select-none",
        "font-medium"
      )}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {!isEditing && (
        <XIcon 
          className="absolute right-2 top-2 h-6 w-6 rounded-full hover:cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-1"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        />
      )}
      <CardContent className="p-4 space-y-4">
        {isEditing ? (
          <Input
            value={item.name}
            onChange={handleNameChange}
            onBlur={handleBlur}
            onClick={(e) => e.stopPropagation()}
            placeholder="Formula name"
            className="cursor-text select-text"
            autoFocus/>
        ) : (
          <h3 className="font-medium flex items-center">
            <FunctionSquare className='mr-1 size-5'/>{item.name}
          </h3>
        )}

        <Select value={selectedFunction} onValueChange={(value: FunctionType) => {
          setSelectedFunction(value)
          setInputs({})
          setArrayInputs([])
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select Function"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_header_number" disabled className="font-medium text-muted-foreground pl-2">
              Number Functions
            </SelectItem>
            {Object.entries(functionMetadata)
              .filter(([_, meta]) => !meta.requiresList)
              .map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
            ))}
            
            <SelectItem value="_header_list" disabled className="mt-2 border-t border-border font-medium text-muted-foreground pl-2">
              List Functions
            </SelectItem>
            {Object.entries(functionMetadata)
              .filter(([_, meta]) => meta.requiresList)
              .map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedFunction && (
          <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md whitespace-pre-wrap">
            {functionMetadata[selectedFunction].docs}
          </div>
        )}

        {renderInputs()}

        <div className="text-sm text-muted-foreground">
          Result: {isCalculating 
            ? 'Calculating...' 
            : typeof result === 'string'
              ? result
              : result !== null 
                ? result.toFixed(2) 
                : 'Select values to calculate'}
        </div>
      </CardContent>
    </Card>
  )
}

export { FormulaEngine }
export default FormulaEngine
