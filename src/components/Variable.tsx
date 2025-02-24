'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LucideVariable, X as XIcon } from 'lucide-react'
import { useDrag } from '@/hooks/useDrag'
import { CanvasItem, Position } from '@/types'
import { cn } from '@/lib/utils'

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
  const cardRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const valueInputRef = useRef<HTMLInputElement>(null)
  const typeSelectRef = useRef<HTMLSelectElement>(null)

  const types = ['number', 'list', 'string', 'date'] as const

  const { position, startDrag } = useDrag({
    initialPosition: item.position,
    onDragEnd: onPositionChange,
    disabled: isEditing,
  })

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
    let value: string | number = e.target.value
    if (item.variableType === 'number') {
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        value = numValue
      }
    }
    onUpdate({ value })
  }

  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement
    if (
      relatedTarget !== nameInputRef.current && 
      relatedTarget !== valueInputRef.current &&
      relatedTarget !== typeSelectRef.current &&
      item.variableType
    ) {
      setIsEditing(false)
      onEditingEnd()
      if (item.isNew) {
        onUpdate({ isNew: undefined })
      }
    }
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ variableType: e.target.value as typeof types[number] })
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
            <select
              ref={typeSelectRef}
              value={item.variableType || ''}
              onChange={handleTypeChange}
              onBlur={handleBlur}
              onClick={(e) => e.stopPropagation()}
              className="w-full p-2 mb-2 border rounded-md"
            >
              <option value="">Select type...</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <Input
              ref={valueInputRef}
              type={item.variableType === 'number' ? 'number' : 
                    item.variableType === 'date' ? 'date' : 'text'}
              value={item.value}
              onChange={handleValueChange}
              onBlur={handleBlur}
              onClick={(e) => e.stopPropagation()}
              placeholder="Value"
              className="cursor-text select-text"
              step="any"
            />
          </>
        ) : (
          <div className="space-y-1">
            <h3 className="font-medium flex items-center">
              <LucideVariable className='mr-1 size-5'/>
              {item.name}
              <span className="ml-2 text-sm text-muted-foreground">({item.variableType})</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Value: {item.variableType === 'list' ? `[${item.value}]` : item.value}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { Variable }
export default Variable 