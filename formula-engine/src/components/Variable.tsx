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
}

const Variable = ({ item, onPositionChange, onUpdate, onDelete, onEditingEnd }: VariableProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const valueInputRef = useRef<HTMLInputElement>(null)

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
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      onUpdate({ value })
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement
    if (
      relatedTarget !== nameInputRef.current && 
      relatedTarget !== valueInputRef.current
    ) {
      setIsEditing(false)
      onEditingEnd()
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
            <Input
              ref={valueInputRef}
              type="number"
              value={item.value}
              onChange={handleValueChange}
              onBlur={handleBlur}
              onClick={(e) => e.stopPropagation()}
              placeholder="Value"
              className="cursor-text select-text"
            />
          </>
        ) : (
          <div className="space-y-1">
            <h3 className="font-medium flex items-center"><LucideVariable className='mr-1 size-5'/>{item.name}</h3>
            <p className="text-sm text-muted-foreground">
              Value: {item.value}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { Variable }
export default Variable 