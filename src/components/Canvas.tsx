"use client";


import { Suspense } from 'react'
import { useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Position, CanvasItem } from '@/types/index'
import { ClientOnly } from './ClientOnly'
import { FunctionSquare, LucideVariable, PlusIcon, TableIcon, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AIChatSidebar } from '@/components/AIChatSidebar'
import DatabaseSidebar from '@/components/DatabaseSidebar'
import {DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


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
  const allVariables = items.filter(item => item.type === 'variable')


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
      value: '',
      isNew: true
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


  const handleCreateVariable = useCallback((gridId: string, variable: Partial<CanvasItem>) => {
    const newVariable: CanvasItem = {
      id: `var-${Date.now()}`,
      ...variable,
      position: variable.position || { x: 100, y: 100 }
    }
   
    setItems(prev => [...prev, newVariable])
  }, [setItems])


  // Helper function to trigger calculation on a formula
  const calculateResult = useCallback((formulaId: string) => {
    // Find the calculate button in the formula component and click it
    const formulaElement = document.querySelector(`[data-id="${formulaId}"]`);
    if (formulaElement) {
      const calculateButton = formulaElement.querySelector('button');
      if (calculateButton && calculateButton instanceof HTMLButtonElement) {
        calculateButton.click();
      }
    }
  }, []);


  // New function to handle formula creation from LLM
  const handleCreateFormulaFromLLM = useCallback((formulaString: string, variableNames: string[]) => {
    // Create the formula component with a fixed position
    const newFormula: CanvasItem = {
      id: `formula-${Date.now()}`,
      type: 'formula',
      name: 'Generated Formula',
      position: {
        x: 700,  // Fixed position
        y: 700
      }
    }
   
    // Add the formula to the canvas
    setItems(prev => [...prev, newFormula])
   
    // We need to wait for the formula to be created before setting its value
    setTimeout(() => {
      // Implement typewriter effect using React state updates
      let currentIndex = 0;
      const typingSpeed = 50; // milliseconds per character
     
      const typeNextChar = () => {
        if (currentIndex <= formulaString.length) {
          // Get the partial formula
          const partialFormula = formulaString.substring(0, currentIndex);
         
          // Update the formula component with the partial text
          updateItem(newFormula.id, {
            formula: partialFormula
          });
         
          // Move to next character
          currentIndex++;
         
          // Continue typing if not finished
          if (currentIndex <= formulaString.length) {
            setTimeout(typeNextChar, typingSpeed);
          } else {
            // Typing is complete - ensure the final value is set correctly
            console.log("Typing complete, setting final formula:", formulaString);
           
            // First, set the complete formula without triggering calculation
            updateItem(newFormula.id, {
              formula: formulaString
            });
           
            // Then wait a moment to ensure the formula is processed
            setTimeout(() => {
              console.log("Formula set, preparing to calculate...");
             
              // Now trigger the calculation after a delay
              setTimeout(() => {
                console.log("Triggering calculation now");
                calculateResult(newFormula.id);
              }, 1000); // 1 second delay before calculation
            }, 500); // 500ms delay after setting formula
          }
        }
      };
     
      // Start the typewriter effect after a short delay
      setTimeout(typeNextChar, 500);
    }, 500);
   
  }, [setItems, updateItem, calculateResult])


  const createGrid = () => {
    const id = `grid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newGrid: CanvasItem = {
      id,
      type: 'grid',
      name: 'New Grid',
      position: {
        x: menuPosition?.x || 100,
        y: menuPosition?.y || 100
      },
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
  }


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


  const createGridFromJson = useCallback((jsonData: any) => {
    const id = `grid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newGrid: CanvasItem = {
      id,
      type: 'grid',
      name: jsonData.name || 'Imported Grid',
      position: {
        x: 100,  // Default position
        y: 100
      },
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
  }, [setItems]);
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
  return (
    <ClientOnly>
      <div className="flex">
        <div className="fixed top-5 right-5 z-10">
          <DatabaseSidebar onTableClick={handleTableSelect} />


        </div> 
        <div className="fixed top-5 left-5 z-10">
          <AIChatSidebar
            onJsonReceived={createGridFromJson}
            getCanvasData={returnCanvasAsJson}
            functionMetadata={FormulaMetadata}
            onCreateFormula={handleCreateFormulaFromLLM}
          />
        </div>
        <div
          ref={canvasRef}
          className="flex-1 h-screen relative select-none canvas-background"
          onClick={handleCanvasClick}
        >
          {/* Export button - positioned in top-right corner */}
          


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


