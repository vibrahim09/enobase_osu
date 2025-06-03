"use client";

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { X as XIcon, Table as TableIcon, Plus, Upload, Variable as VariableIcon, PlusIcon } from 'lucide-react'
import { useDrag } from '@/hooks/useDrag'
import { CanvasItem, Position, VariableItem, GridItem, GridRow } from '@/types'
import { cn } from '@/lib/utils'
import Papa from 'papaparse'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Graphs from './Graphs'

interface DataGridProps {
  item: GridItem
  onPositionChange: (position: Position) => void
  onUpdate: (updates: Partial<GridItem>) => void
  onDelete: () => void
  onEditingEnd: () => void
  onCreateVariable?: (variable: Partial<VariableItem>) => void
  isNew?: boolean
}

export function DataGrid({
  item,
  onPositionChange,
  onUpdate,
  onDelete,
  onEditingEnd,
  onCreateVariable,
  isNew
}: DataGridProps) {
  const { position, startDrag } = useDrag({
    initialPosition: item.position,
    onDragEnd: onPositionChange
  })

  const [isEditing, setIsEditing] = useState(isNew)
  const [name, setName] = useState(item.name)
  const [rows, setRows] = useState<GridRow[]>(item.rows)
  const [columns, setColumns] = useState(item.columns)

  useEffect(() => {
    if (!isEditing && (name !== item.name || rows !== item.rows || columns !== item.columns)) {
      onUpdate({
        name,
        rows,
        columns
      })
    }
  }, [isEditing, name, rows, columns, item.name, item.rows, item.columns, onUpdate])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      complete: (results) => {
        if (results.data && Array.isArray(results.data) && results.data.length > 0) {
          const headers = results.data[0] as string[]
          const newColumns = headers.map(header => ({
            field: header.toLowerCase().replace(/\s+/g, '_'),
            header,
            type: 'string'
          }))

          const newRows = (results.data.slice(1) as string[][]).map((row) => {
            const newRow: Record<string, unknown> = {}
            headers.forEach((header, index) => {
              newRow[header.toLowerCase().replace(/\s+/g, '_')] = row[index]
            })
            return newRow as GridRow
          })

          setColumns(newColumns)
          setRows(newRows)
        }
      }
    })
  }

  const handleCreateVariable = (row: GridRow, columnIndex: number) => {
    if (!onCreateVariable) return

    const column = columns[columnIndex]
    const value = row[column.field]
    
    onCreateVariable({
      name: `${name}_${column.field}`,
      type: 'variable',
      value: value,
      variableType: column.type === 'number' ? 'number' : 'string'
    })
  }

  return (
    <Card
      className={cn(
        'absolute w-[600px] shadow-md cursor-move',
        isEditing && 'ring-2 ring-blue-500'
      )}
      style={{ left: position.x, top: position.y }}
      onMouseDown={startDrag}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            {isEditing ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  setIsEditing(false)
                  onEditingEnd()
                }}
                autoFocus
                className="h-6 text-sm"
              />
            ) : (
              <div
                className="text-sm font-medium cursor-text"
                onClick={() => setIsEditing(true)}
              >
                {name}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <button
              className="h-6 w-6 hover:bg-gray-100 rounded-full flex items-center justify-center"
              onClick={onDelete}
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, columnIndex) => (
                  <TableHead key={column.field}>
                    <div className="flex items-center gap-1">
                      {column.header}
                      {onCreateVariable && (
                        <button
                          className="h-4 w-4 hover:bg-gray-100 rounded-full flex items-center justify-center"
                          onClick={() => {
                            const firstRow = rows[0]
                            if (firstRow) {
                              handleCreateVariable(firstRow, columnIndex)
                            }
                          }}
                        >
                          <VariableIcon className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {String(row[column.field])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default DataGrid 