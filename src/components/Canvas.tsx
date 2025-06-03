"use client";

import { Suspense } from 'react'
import { useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Position, CanvasItem, VariableItem, FormulaItem, GridItem, ChartItem } from '@/types/index'
import { ClientOnly } from './ClientOnly'
import { FunctionSquare, LucideVariable, PlusIcon, TableIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AIChatSidebar } from '@/components/AIChatSidebar'
import DatabaseSidebar from '@/components/DatabaseSidebar'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Graphs from '@/components/Graphs'

// Import function metadata for the formula engine
import { functionMetadata as FormulaMetadata } from '@/lib/formula-metadata'

const Variable = dynamic(() => import('@/components/Variable').then(mod => mod.Variable), {
  ssr: false
})

const FormulaEngine = dynamic(() => import('@/components/FormulaEngine').then(mod => mod.FormulaEngine), {
  ssr: false
})

const DataGrid = dynamic(() => import('@/components/DataGrid').then(mod => mod.DataGrid), {
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
  const allVariables = items.filter((item): item is VariableItem => item.type === 'variable')

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (ignoreNextClick) {
      setIgnoreNextClick(false)
      return
    }

    if (e.target === canvasRef.current) {
      setMenuPosition({ x: e.clientX + 50, y: e.clientY })
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
        const currentItem = newItems[itemIndex]
        // Update the main item while preserving its type
        newItems[itemIndex] = { ...currentItem, ...updates } as CanvasItem
       
        // Handle linked variable
        if (updates.linkedVariable) {
          const linkedVarIndex = newItems.findIndex(item => item.id === updates.linkedVariable?.id)
          if (linkedVarIndex !== -1) {
            // Update existing linked variable
            newItems[linkedVarIndex] = updates.linkedVariable
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
   
    const newVariable: VariableItem = {
      id: `var-${Date.now()}`,
      type: 'variable',
      position: menuPosition,
      name: 'Variable',
      value: '',
      isNew: true
    }
    setItems(prevItems => [...prevItems, newVariable])
    setMenuPosition(null)
  }, [menuPosition, setItems])

  const createFormula = useCallback(() => {
    if (!menuPosition) return
   
    const newFormula: FormulaItem = {
      id: `formula-${Date.now()}`,
      type: 'formula',
      position: menuPosition,
      name: 'Formula',
      formula: ''
    }
    setItems(prevItems => [...prevItems, newFormula])
    setMenuPosition(null)
  }, [menuPosition, setItems])

  const handleCreateVariable = useCallback((gridId: string, variable: Partial<VariableItem>) => {
    if (!variable.name) return
    
    const newVariable: VariableItem = {
      id: `var-${Date.now()}`,
      type: 'variable',
      name: variable.name,
      position: variable.position || { x: 100, y: 100 },
      value: variable.value || '',
      variableType: variable.variableType
    }
   
    setItems(prev => [...prev, newVariable])
  }, [setItems])

  // Helper function to trigger calculation on a formula
  const calculateResult = useCallback((formulaId: string) => {
    const formulaElement = document.querySelector(`[data-id="${formulaId}"]`)
    if (formulaElement) {
      const calculateButton = formulaElement.querySelector('button')
      if (calculateButton && calculateButton instanceof HTMLButtonElement) {
        calculateButton.click()
      }
    }
  }, [])

  const handleCreateFormulaFromLLM = useCallback((formulaString: string, variableNames: string[]) => {
    const newFormula: FormulaItem = {
      id: `formula-${Date.now()}`,
      type: 'formula',
      name: 'Generated Formula',
      position: { x: 700, y: 700 },
      formula: ''
    }
   
    setItems(prev => [...prev, newFormula])
   
    setTimeout(() => {
      let currentIndex = 0
      const typingSpeed = 50
     
      const typeNextChar = () => {
        if (currentIndex <= formulaString.length) {
          const partialFormula = formulaString.substring(0, currentIndex)
          updateItem(newFormula.id, { formula: partialFormula })
          currentIndex++
         
          if (currentIndex <= formulaString.length) {
            setTimeout(typeNextChar, typingSpeed)
          } else {
            updateItem(newFormula.id, { formula: formulaString })
            setTimeout(() => {
              setTimeout(() => calculateResult(newFormula.id), 1000)
            }, 500)
          }
        }
      }
     
      setTimeout(typeNextChar, 500)
    }, 500)
  }, [setItems, updateItem, calculateResult])

  const createGrid = useCallback(() => {
    if (!menuPosition) return

    const newGrid: GridItem = {
      id: `grid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'grid',
      name: 'New Grid',
      position: menuPosition,
      isNew: true,
      columns: [
        { field: 'column1', header: 'Column 1', type: 'string' },
        { field: 'column2', header: 'Column 2', type: 'number' }
      ],
      rows: [
        { column1: 'Row 1', column2: 1 },
        { column1: 'Row 2', column2: 2 }
      ]
    }
   
    setItems(prev => [...prev, newGrid])
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

  const exportCanvasToJson = useCallback(() => {
    // Create a simplified version of the items without position data and formulas
    const simplifiedItems = items
      .filter(item => item.type !== 'formula') // Exclude formula components
      .map(item => {
        const { position, ...itemWithoutPosition } = item
        return itemWithoutPosition
      })

    // Create and download the JSON file
    const dataStr = JSON.stringify(simplifiedItems, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
   
    const link = document.createElement('a')
    link.href = url
    link.download = `canvas-export.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [items])

  const returnCanvasAsJson = useCallback(() => {
    // Create a simplified version of the items without position data and formulas
    const simplifiedItems = items
      .filter(item => item.type !== 'formula') // Exclude formula components
      .map(item => {
        const { position, ...itemWithoutPosition } = item
        return itemWithoutPosition
      })

    return simplifiedItems
  }, [items])

  const createGridFromJson = useCallback((jsonData: {
    name?: string
    columns?: Array<{ field: string; header: string; type: string }>
    rows?: Array<Record<string, any>>
  }) => {
    const newGrid: GridItem = {
      id: `grid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'grid',
      name: jsonData.name || 'Imported Grid',
      position: { x: 100, y: 100 },
      columns: jsonData.columns || [
        { field: 'column1', header: 'Column 1', type: 'string' },
        { field: 'column2', header: 'Column 2', type: 'number' }
      ],
      rows: jsonData.rows || [
        { column1: 'Row 1', column2: 1 },
        { column1: 'Row 2', column2: 2 }
      ]
    }
   
    setItems(prev => [...prev, newGrid])
  }, [setItems])

  const handleTableSelect = async (table: string) => {
    console.log("Table selected:", table);
    try {
      const response = await fetch(`/api/database-api?table=${table}`);
      if (!response.ok) {
        throw new Error('Failed to fetch table data');
      }
      const result = await response.json();
      console.log("API Response Columns:", result.columns);
      console.log("API Response First Row:", result.result[0]);

      const columns = result.columns.map((columnName: string) => ({
        field: columnName,
        header: columnName,
        type:  typeof result.result[0]?.[columnName] === 'number' ? 'number' : 'string'
      }));
      const rows = result.result.map((row: any) => {
        const newRow: Record<string, any> = {};
        result.columns.forEach((colName:string) => {
          // const column = columns[index];
          newRow[colName] = row[colName] !== null ? row[colName] : "";
        });
        return newRow;
      });
      setItems((prevItems) => [
        ...prevItems,
        {
          id: `grid-${Date.now()}`,
          type: 'grid',
          name: table,
          position: { x: 100, y: 100 }, //
          columns,
          rows
        }
      ]);
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  const handleCreateChart = useCallback((chartData: {
    type: 'line' | 'bar' | 'pie'
    name: string
    data: { 
      names: string[]
      datasets: Array<{
        label: string
        values: number[]
        backgroundColor?: string
        borderColor?: string
      }>
    }
  }) => {
    const newChart: ChartItem = {
      id: `chart-${Date.now()}`,
      type: 'chart',
      position: { x: 100, y: 100 },
      name: chartData.name,
      chartType: chartData.type,
      data: chartData.data
    }
    
    setItems(prev => [...prev, newChart])
  }, [setItems])

  return (
    <ClientOnly>
      <div className="flex">
        <div className="fixed top-5 left-5 z-10">
          <AIChatSidebar
            onJsonReceived={createGridFromJson}
            getCanvasData={returnCanvasAsJson}
            functionMetadata={FormulaMetadata}
            onCreateFormula={handleCreateFormulaFromLLM}
            onCreateChart={handleCreateChart}
          />
        </div>
        <div
          ref={canvasRef}
          className="flex-1 h-screen relative select-none bg-white dark:bg-neutral-950"
          onClick={handleCanvasClick}
        >

          {visibleItems.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground space-y-2 pointer-events-none">
              <div className="text-lg font-medium">Welcome to Formula Engine</div>
              <div className="text-sm">Click anywhere on the canvas to create variables and formulas</div>
              <div className="flex items-center gap-2 mt-4 text-xs">
                <div className="flex items-center">
                  <LucideVariable className="mr-1 h-4 w-4" />
                  Variables
                </div>
                <div>•</div>
                <div className="flex items-center">
                  <FunctionSquare className="mr-1 h-4 w-4" />
                  Formulas
                </div>
              </div>
            </div>
          )}

          <Suspense fallback={null}>
            {visibleItems.map(item => {
              switch (item.type) {
                case 'variable':
                  return (
                    <Variable
                      key={item.id}
                      item={item}
                      onPositionChange={(pos) => updateItemPosition(item.id, pos)}
                      onUpdate={(updates) => updateItem(item.id, updates)}
                      onDelete={() => deleteItem(item.id)}
                      onEditingEnd={handleEditingEnd}
                      isNew={item.isNew}
                    />
                  )
                case 'formula':
                  return (
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
                case 'chart':
                  return (
                    <Graphs
                      key={item.id}
                      item={item}
                      onPositionChange={(position) => updateItem(item.id, { position })}
                      onDelete={() => deleteItem(item.id)}
                      onUpdate={(id, updates) => updateItem(id, updates)}
                    />
                  )
                case 'grid':
                  return (
                    <DataGrid
                      key={item.id}
                      item={item}
                      onPositionChange={(pos) => updateItemPosition(item.id, pos)}
                      onUpdate={(updates) => updateItem(item.id, updates)}
                      onDelete={() => deleteItem(item.id)}
                      onEditingEnd={handleEditingEnd}
                      onCreateVariable={(variable) => handleCreateVariable(item.id, variable)}
                      isNew={item.isNew}
                    />
                  )
                default:
                  return null
              }
            })}
          </Suspense>

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
                  <LucideVariable className="mr-2"/> New Variable <PlusIcon className="ml-1"/>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={createFormula}>
                  <FunctionSquare className="mr-2"/> New Formula <PlusIcon className="ml-1"/>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={createGrid}>
                  <TableIcon className="mr-2"/> New Grid <PlusIcon className="ml-7"/>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}


