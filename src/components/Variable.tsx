'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LucideVariable, X as XIcon, CalendarIcon, Text as TextIcon, LetterText, BracketsIcon, FileDigit, TypeIcon } from 'lucide-react'
import { useDrag } from '@/hooks/useDrag'
import { CanvasItem, Position } from '@/types'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface VariableProps {
  item: CanvasItem
  onPositionChange: (position: Position) => void
  onUpdate: (updates: Partial<CanvasItem>) => void
  onDelete: () => void
  onEditingEnd: () => void
  isNew?: boolean
}

const Variable = ({ item, onPositionChange, onUpdate, onDelete, onEditingEnd, isNew = false }: VariableProps) => {
  const [isEditing, setIsEditing] = useState(isNew)
  const [hasSetType, setHasSetType] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const valueInputRef = useRef<HTMLInputElement>(null)
  const [editingValue, setEditingValue] = useState<string>('')

  const types = ['number', 'list', 'string', 'date'] as const

  const { position, startDrag } = useDrag({
    initialPosition: item.position,
    onDragEnd: onPositionChange,
    disabled: isEditing,
  })

  // Initialize editingValue when entering edit mode
  useEffect(() => {
    if (isEditing && item.variableType === 'list' && Array.isArray(item.value)) {
      setEditingValue(`[${item.value.join(', ')}]`)
    }
  }, [isEditing, item.value, item.variableType])

  // Set hasSetType when variableType changes
  useEffect(() => {
    if (item.variableType) {
      setHasSetType(true)
    }
  }, [item.variableType])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditing) {
      startDrag(e)
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ name: e.target.value })
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (item.variableType === 'list') {
      setEditingValue(e.target.value)
    } else {
      let value: string | number = e.target.value
      if (item.variableType === 'number') {
        const numValue = parseFloat(value)
        if (!isNaN(numValue)) {
          value = numValue
        }
      }
      onUpdate({ value })
    }
  }

  const handleValueBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (item.variableType === 'list') {
      // Convert string to array only on blur
      const value = editingValue
        .replace(/^\[|\]$/g, '')  // Remove brackets
        .split(',')               // Split by comma
        .map(item => item.trim()) // Trim whitespace
        .filter(Boolean)          // Remove empty entries
        .map(item => {
          // Try to convert to number if possible, otherwise keep as string
          const num = Number(item)
          return !isNaN(num) ? num : item.replace(/^["']|["']$/g, '') // Remove quotes if present
        })
      
      onUpdate({ value })
    }
    handleBlur(e)
  }

  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement
    if (
      relatedTarget !== nameInputRef.current && 
      relatedTarget !== valueInputRef.current &&
      !relatedTarget?.closest('[role="listbox"]') &&
      !relatedTarget?.closest('[role="combobox"]')
    ) {
      setIsEditing(false)
      onEditingEnd()
      if (item.isNew) {
        onUpdate({ isNew: undefined })
      }
    }
  }

  const handleTypeChange = (value: string) => {
    onUpdate({ variableType: value as typeof types[number] })
    // Focus the value input after type selection
    if (valueInputRef.current) {
      valueInputRef.current.focus()
    }
  }

  return (
    <Card
      ref={cardRef}
      className={cn(
        "absolute w-64",
        !isEditing && "cursor-move",
        "select-none"
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
      <CardContent className="p-4 space-y-2">
        {isEditing ? (
          <>
            <Input
              ref={nameInputRef}
              value={item.name}
              onChange={handleNameChange}
              onBlur={handleBlur}
              onClick={(e) => e.stopPropagation()}
              placeholder="Variable"
              className="mb-2 cursor-text select-text"
              autoFocus
            />
            <Select
              value={item.variableType || ''}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              ref={valueInputRef}
              type={item.variableType === 'number' ? 'number' : 
                    item.variableType === 'date' ? 'date' : 'text'}
              value={item.variableType === 'list' ? 
                    editingValue :
                    item.value}
              onChange={handleValueChange}
              onBlur={handleValueBlur}
              onClick={(e) => e.stopPropagation()}
              placeholder={
                !item.variableType ? "Select a type first" :
                item.variableType === 'number' ? "Value: (e.g., 42.5)" :
                item.variableType === 'list' ? "Value: (e.g., [1, abc, 3, def])" :
                item.variableType === 'date' ? "Value: (e.g., 2024-01-01)" :
                "Value: (e.g., 'Hello, world!')"
              }
              className={cn(
                "cursor-text select-text",
                !item.variableType && "opacity-50 cursor-not-allowed"
              )}
              disabled={!item.variableType}
            />
          </>
        ) : (
          <div className="space-y-1">
            <h3 className="font-medium flex items-center">
              <LucideVariable className='mr-1 size-5'/>
              {item.name}
              <span className="ml-2 text-sm  text-muted-foreground">
                {item.variableType === 'date' ? (
                  <CalendarIcon className="h-4 w-4" />
                ) : item.variableType === 'string' ? (
                  <TypeIcon className="h-4 w-4" />
                ) : item.variableType === 'number' ? (
                  <FileDigit className="h-5 w-5" />
                ) : item.variableType === 'list' ? (
                  <BracketsIcon className="h-4 w-4" />
                ) : (
                  `(${item.variableType})`
                )}
              </span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Value: {item.variableType === 'list' && Array.isArray(item.value) ? 
                     `[${item.value.join(', ')}]` : 
                     item.value}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { Variable }
export default Variable 