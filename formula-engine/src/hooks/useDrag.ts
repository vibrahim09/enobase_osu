import { useState, useEffect, useCallback } from 'react'
import { Position } from '@/types'

interface UseDragProps {
  initialPosition: Position
  onDragEnd?: (position: Position) => void
  disabled?: boolean
}

export function useDrag({ initialPosition, onDragEnd, disabled = false }: UseDragProps) {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 })

  const startDrag = useCallback((e: React.MouseEvent) => {
    if (disabled) return
    e.stopPropagation()
    setIsDragging(true)
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }, [position, disabled])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        }
        setPosition(newPosition)
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        onDragEnd?.(position)
      }
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, offset, onDragEnd, position])

  return { position, isDragging, startDrag }
} 