'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { X as XIcon, Table as TableIcon, Plus, Upload, Variable as VariableIcon, PlusIcon } from 'lucide-react'
import { useDrag } from '@/hooks/useDrag'
import { CanvasItem, Position } from '@/types'
import { cn } from '@/lib/utils'
import Papa from 'papaparse'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DataGridProps {
  item: CanvasItem
  onPositionChange: (position: Position) => void
  onUpdate: (updates: Partial<CanvasItem>) => void
  onDelete: () => void
  onEditingEnd: () => void
  onCreateVariable?: (variable: Partial<CanvasItem>) => void
  isNew?: boolean
}

const DataGrid = ({ item, onPositionChange, onUpdate, onDelete, onEditingEnd, onCreateVariable, isNew }: DataGridProps) => {
  const [isEditing, setIsEditing] = useState(isNew)
  const [isEditingName, setIsEditingName] = useState(isNew)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const { position, startDrag } = useDrag({
    initialPosition: item.position,
    onDragEnd: onPositionChange,
    disabled: isEditing,
  })

  useEffect(() => {
    if (isEditingName) {
      nameInputRef.current?.focus()
      nameInputRef.current?.select()
    }
  }, [isEditingName])

  const defaultColumns = [
    { field: 'column1', header: 'Column 1', type: 'string' },
    { field: 'column2', header: 'Column 2', type: 'number' }
  ]

  const defaultRows = [
    { column1: 'Row 1', column2: 1 },
    { column1: 'Row 2', column2: 2 }
  ]

  const columns = item.columns || defaultColumns
  const rows = item.rows || defaultRows

  const handleAddRow = () => {
    const newRow = columns.reduce((acc, col) => {
      acc[col.field] = col.type === 'number' ? 0 : ''
      return acc
    }, {} as Record<string, any>)

    onUpdate({
      rows: [...rows, newRow]
    })
  }

  const handleCellChange = (rowIndex: number, field: string, value: string) => {
    const newRows = [...rows]
    const column = columns.find(col => col.field === field)
    newRows[rowIndex][field] = column?.type === 'number' ? Number(value) : value
    
    onUpdate({
      rows: newRows
    })
  }

  const handleNameChange = (newName: string) => {
    onUpdate({ name: newName })
  }

  const handleNameSubmit = () => {
    setIsEditingName(false)
    onEditingEnd()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditing) {
      startDrag(e)
    }
  }

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Get filename without extension for the title
    const title = file.name.replace(/\.[^/.]+$/, '')

    Papa.parse(file, {
      complete: (results) => {
        if (results.data.length === 0) return

        // Get headers from first row
        const headers = results.data[0] as string[]
        
        // Create columns configuration
        const newColumns = headers.map((header, index) => ({
          field: `column${index + 1}`,
          header: header,
          // Try to detect if the column contains numbers
          type: results.data.slice(1).every(row => 
            !isNaN(Number(row[index])) && row[index] !== ''
          ) ? 'number' : 'string'
        }))

        // Create rows from data (skip header row)
        const newRows = results.data.slice(1)
          .filter(row => row.some(cell => cell !== '')) // Filter out empty rows
          .map(row => {
            const rowData: Record<string, any> = {}
            row.forEach((cell, index) => {
              const column = newColumns[index]
              rowData[column.field] = column.type === 'number' ? 
                (cell === '' ? 0 : Number(cell)) : 
                cell
            })
            return rowData
          })

        onUpdate({
          name: title,  // Set the name to the CSV filename
          columns: newColumns,
          rows: newRows
        })
      },
      error: (error) => {
        console.error('Error parsing CSV:', error)
      }
    })

    // Reset the input so the same file can be uploaded again
    e.target.value = ''
  }

  const handleCreateColumnVariable = (column: { field: string, header: string, type: string }) => {
    if (!onCreateVariable) return

    // Extract all values from the column
    const values = rows.map(row => row[column.field])
    
    // Create a new variable positioned to the right of the grid
    const cardRect = cardRef.current?.getBoundingClientRect()
    const newPosition = {
      x: (cardRect?.right || position.x) + 20,
      y: position.y
    }

    onCreateVariable({
      type: 'variable',
      name: column.header,
      variableType: 'list',
      value: values,
      position: newPosition
    })
  }

  return (
    <Card
      ref={cardRef}
      className={cn(
        "absolute w-auto max-w-[700px] shadow-md",
        !isEditing && "cursor-move",
        isEditing ? "ring-1 ring-primary" : "hover:ring-1 hover:ring-primary/50"
      )}
      style={{
        left: position.x,
        top: position.y
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation()
        !isEditing && setIsEditing(true)
      }}
      onMouseLeave={() => setIsEditing(false)}
      data-id={item.id}
      data-columns={JSON.stringify(columns.map(col => ({ field: col.field, header: col.header })))}
    >
      <CardContent className="p-4">
        <div 
          className="flex items-center justify-between mb-4 select-none"
        >
          <div className="flex items-center flex-1 gap-2">
            {isEditingName ? (
              <Input
                ref={nameInputRef}
                value={item.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSubmit()
                  if (e.key === 'Escape') {
                    handleNameSubmit()
                    e.stopPropagation()
                  }
                }}
                className="h-7 py-1"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3 
                className="flex items-center text-lg font-semibold"
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  setIsEditingName(true)
                }}
              >
                <TableIcon className="mr-2 h-5 w-5" />
                {item.name}
              </h3>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
              id={`csv-upload-${item.id}`}
            />
            <label
              htmlFor={`csv-upload-${item.id}`}
              className="flex items-center px-2 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded-md cursor-pointer ml-4"
            >
              <Upload className="h-4 w-4 mr-1" />
              Import CSV
            </label>
            
            <XIcon 
              className="h-6 w-6 rounded-full hover:cursor-pointer hover:bg-slate-100 p-1"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            />
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(column => (
                  <TableHead 
                    key={column.field}
                    className="group"
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className="bg-gray-400 hover:bg-gray-500 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 "
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCreateColumnVariable(column)
                              }}
                            >
                              <VariableIcon className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                          className="bg-gray-400 text-white"
                          >
                            <p> Create <i>{column.header}</i> variable </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map(column => (
                    <TableCell key={column.field}>
                      <Input
                        type={column.type === 'number' ? 'number' : 'text'}
                        value={row[column.field]}
                        onChange={(e) => handleCellChange(rowIndex, column.field, e.target.value)}
                        className="h-8"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={handleAddRow}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Row
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { DataGrid }
export default DataGrid 