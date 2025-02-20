'use client'

import { Suspense } from 'react'
import { useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Position, CanvasItem } from '@/types'
import { ClientOnly } from './ClientOnly'
import { FunctionSquare, LucideVariable, PlusIcon } from 'lucide-react'

const Variable = dynamic(() => import('@/components/Variable').then(mod => mod.Variable), {
  ssr: false
})

const FormulaEngine = dynamic(() => import('@/components/FormulaEngine').then(mod => mod.FormulaEngine), {
  ssr: false
})

export function Canvas() {
  const [items, setItems] = useLocalStorage<CanvasItem[]>('canvas-items', [])
  const [menuPosition, setMenuPosition] = useState<Position | null>(null)
  const [ignoreNextClick, setIgnoreNextClick] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Filter out linked variables for rendering
  const visibleItems = items.filter(item => !item.id.startsWith('linked-'))
  // Get all variables (including linked ones) for formula calculations
  const allVariables = items.filter(item => item.type === 'variable')

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (ignoreNextClick) {
      setIgnoreNextClick(false)
      return
    }

    if (e.target === canvasRef.current) {
      setMenuPosition({ x: e.clientX, y: e.clientY })
    }
  }, [ignoreNextClick])

  const handleMenuClose = useCallback(() => {
    setMenuPosition(null)
  }, [])

  const handleEditingEnd = useCallback(() => {
    setIgnoreNextClick(true)
  }, [])

  const updateItemPosition = useCallback((id: string, position: Position) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, position } : item
      )
    )
  }, [setItems])

  const updateItem = useCallback((id: string, updates: Partial<CanvasItem> & { linkedVariable?: CanvasItem }) => {
    setItems(prevItems => {
      const newItems = [...prevItems]
      const itemIndex = newItems.findIndex(item => item.id === id)
      
      if (itemIndex !== -1) {
        // Update the main item
        newItems[itemIndex] = { ...newItems[itemIndex], ...updates }
        
        // Handle linked variable
        if (updates.linkedVariable) {
          const linkedVarIndex = newItems.findIndex(item => item.id === updates.linkedVariable?.id)
          if (linkedVarIndex !== -1) {
            // Update existing linked variable
            newItems[linkedVarIndex] = { ...updates.linkedVariable }
          } else {
            // Add new linked variable
            newItems.push(updates.linkedVariable)
          }
        }
      }
      
      return newItems
    })
  }, [setItems])

  const createVariable = useCallback(() => {
    if (!menuPosition) return
    
    setItems(prevItems => [...prevItems, {
      id: `var-${Date.now()}`,
      type: 'variable',
      position: menuPosition,
      name: 'Variable',
      value: 0
    }])
    setMenuPosition(null)
  }, [menuPosition, setItems])

  const createFormula = useCallback(() => {
    if (!menuPosition) return
    
    setItems(prevItems => [...prevItems, {
      id: `formula-${Date.now()}`,
      type: 'formula',
      position: menuPosition,
      name: 'Formula'
    }])
    setMenuPosition(null)
  }, [menuPosition, setItems])

  const deleteItem = useCallback((id: string) => {
    setItems(prevItems => {
      const itemToDelete = prevItems.find(item => item.id === id)
      if (itemToDelete?.type === 'formula') {
        // Also delete the linked variable if it exists
        return prevItems.filter(item => 
          item.id !== id && item.id !== `linked-${id}`
        )
      }
      return prevItems.filter(item => item.id !== id)
    })
  }, [setItems])

  return (
    <div 
      ref={canvasRef}
      className="w-full h-screen bg-slate-50 dark:bg-slate-900 relative select-none"
      onClick={handleCanvasClick}
    >
      <ClientOnly>
        <Suspense fallback={null}>
          {visibleItems.map(item => (
            item.type === 'variable' ? (
              <Variable
                key={item.id}
                item={item}
                onPositionChange={(pos) => updateItemPosition(item.id, pos)}
                onUpdate={(updates) => updateItem(item.id, updates)}
                onDelete={() => deleteItem(item.id)}
                onEditingEnd={handleEditingEnd}
              />
            ) : (
              <FormulaEngine
                key={item.id}
                item={item}
                variables={allVariables}
                onPositionChange={(pos) => updateItemPosition(item.id, pos)}
                onUpdate={(updates) => updateItem(item.id, updates)}
                onDelete={() => deleteItem(item.id)}
                onEditingEnd={handleEditingEnd}
              />
            )
          ))}
        </Suspense>
      </ClientOnly>

      {menuPosition && (
        <DropdownMenu defaultOpen onOpenChange={handleMenuClose}>
          <DropdownMenuTrigger asChild>
            <div 
              className="absolute w-1 h-1"
              style={{ left: menuPosition.x, top: menuPosition.y }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={createVariable}>
              <LucideVariable/> New Variable <PlusIcon className='ml-1'/>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={createFormula}>
              <FunctionSquare/> New Formula <PlusIcon className='ml-1'/>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
} 