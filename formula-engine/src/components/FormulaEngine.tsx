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

interface FormulaEngineProps {
  item: CanvasItem
  variables: CanvasItem[]
  onPositionChange: (position: Position) => void
  onUpdate: (updates: Partial<CanvasItem>) => void
  onDelete: () => void
  onEditingEnd: () => void
}

const FormulaEngine = ({ item, variables, onPositionChange, onUpdate, onDelete, onEditingEnd }: FormulaEngineProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [operand1, setOperand1] = useState<string>('')
  const [operand2, setOperand2] = useState<string>('')
  const [operator, setOperator] = useState<string>('')
  const [result, setResult] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const calculationTimeoutRef = useRef<NodeJS.Timeout>()

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
      if (!operand1 || !operand2 || !operator) {
        setResult(null)
        return
      }

      const var1 = variables.find(v => v.id === operand1)?.value ?? 0
      const var2 = variables.find(v => v.id === operand2)?.value ?? 0

      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current)
      }

      const loadingTimeout = setTimeout(() => {
        setIsCalculating(true)
      }, 500)

      try {
        // Only allow add and subtract operations for now
        if (operator !== 'add' && operator !== 'subtract') {
          setResult(null)
          return
        }

        const requestBody = {
          function: operator,
          num1: var1,
          num2: var2
        }

        const response = await fetch('/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          throw new Error('Calculation failed')
        }

        const data = await response.json()
        setResult(data.result)
      } catch (error) {
        console.error('Calculation error:', error)
        setResult(null)
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
  }, [operand1, operand2, operator, variables])

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

  return (
    <Card
      ref={cardRef}
      className={cn(
        "absolute w-80",
        !isEditing && "cursor-move",
        "select-none",
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
          <h3 className="font-medium flex items-center"><FunctionSquare className='mr-1 size-5'/>{item.name}</h3>
        )}

        <div className="grid grid-cols-3 gap-2">
          <Select value={operand1} onValueChange={setOperand1}>
            <SelectTrigger>
              <SelectValue placeholder="Variable"/>
            </SelectTrigger>
            <SelectContent>
              {availableVariables.map(variable => (
                <SelectItem key={variable.id} value={variable.id}>
                  {variable.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={operator} onValueChange={setOperator}>
            <SelectTrigger>
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add"><PlusIcon className='size-4'/></SelectItem>
              <SelectItem value="subtract"><MinusIcon className='size-4'/></SelectItem>
              {/* temporarily disabled until API implementation
              <SelectItem value="multiply"><XIcon className='size-4'/></SelectItem>
              <SelectItem value="divide"><DivideIcon className='size-4'/></SelectItem>
              */}
            </SelectContent>
          </Select>

          <Select value={operand2} onValueChange={setOperand2}>
            <SelectTrigger>
              <SelectValue placeholder="Variable" />
            </SelectTrigger>
            <SelectContent>
              {availableVariables.map(variable => (
                <SelectItem key={variable.id} value={variable.id}>
                  {variable.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Result: {isCalculating 
            ? 'Calculating...' 
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
