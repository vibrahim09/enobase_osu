'use client'

import { useRef, useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { X as XIcon, LucideVariable, FunctionSquare} from 'lucide-react'
import { useDrag } from '@/hooks/useDrag'
import { CanvasItem, Position } from '@/types'
import { cn } from '@/lib/utils'
import { FunctionRequestBody } from '@/lib/functions'
import { functionMetadata } from '@/lib/formula-metadata'

interface FormulaEngineProps {
  item: CanvasItem
  variables: CanvasItem[]
  onPositionChange: (position: Position) => void
  onUpdate: (updates: Partial<CanvasItem>) => void
  onDelete: () => void
  onEditingEnd: () => void
}


type FunctionType = keyof typeof functionMetadata

const FormulaEngine = ({ item, variables, onPositionChange, onUpdate, onDelete, onEditingEnd }: FormulaEngineProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formula, setFormula] = useState(item.formula || '')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownType, setDropdownType] = useState<'functions' | 'variables' | null>(null)
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null)
  const [result, setResult] = useState<number | string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [docs, setDocs] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null)
  const [isCommandFocused, setIsCommandFocused] = useState(false)
  const commandRef = useRef<HTMLDivElement>(null)

  const { position, startDrag } = useDrag({
    initialPosition: item.position,
    onDragEnd: onPositionChange,
    disabled: isEditing,
  })

  // Effect to handle external formula updates (for typewriter effect)
  useEffect(() => {
    if (item.formula !== undefined && item.formula !== formula) {
      setFormula(item.formula);
      
      // If calculateAfterUpdate flag is set, trigger calculation
      if (item.calculateAfterUpdate) {
        // Clear the flag to prevent repeated calculations
        onUpdate({ calculateAfterUpdate: false });
        
        // Schedule calculation after a short delay to ensure state is updated
        setTimeout(() => {
          calculateResult();
        }, 500);
      }
    }
  }, [item.formula, item.calculateAfterUpdate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const position = e.target.selectionStart || 0
    
    setFormula(value)
    setCursorPosition(position)

    // Find the current word being typed
    const words = value.slice(0, position).split(' ')
    const currentWord = words[words.length - 1]

    // Check for trigger characters and filter items
    if (currentWord.startsWith('@')) {
      setDropdownType('functions')
      setShowDropdown(true)
    } else if (currentWord.startsWith('#')) {
      setDropdownType('variables')
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
    
    // Reset command focus and highlight when typing
    setIsCommandFocused(false)
    setHighlightedItem(null)
  }

  // Filter functions and variables based on input
  const getFilteredItems = () => {
    const words = formula.slice(0, cursorPosition).split(' ')
    const currentWord = words[words.length - 1].toLowerCase()
    
    if (dropdownType === 'functions') {
      const searchTerm = currentWord.replace('@', '')
      
      const allFunctions = Object.entries(functionMetadata)
        .filter(([key, meta]) => 
          key.toLowerCase().includes(searchTerm) || 
          meta.label.toLowerCase().includes(searchTerm)
        )

      return {
        numberFunctions: allFunctions.filter(([_, meta]) => meta.type === 'number'),
        stringFunctions: allFunctions.filter(([_, meta]) => meta.type === 'string'),
        listFunctions: allFunctions.filter(([_, meta]) => meta.type === 'list'),
        dateFunctions: allFunctions.filter(([_, meta]) => meta.type === 'date')
      }
    } else if (dropdownType === 'variables') {
      const searchTerm = currentWord.replace('#', '')
      
      // Get formula variables from localStorage
      const formulaVariables = Object.entries(localStorage)
        .filter(([key]) => key.startsWith('result_'))
        // Filter out current formula's variable
        .filter(([key]) => key !== `result_${item.id}`)
        .map(([key, value]) => {
          const data = JSON.parse(value)
          return {
            id: key,
            name: data.name,
            value: data.value
          }
        })

      // Combine regular variables with formula variables
      const allVariables = [
        ...variables,
        ...formulaVariables
      ]

      return allVariables.filter(variable => 
        variable.name.toLowerCase().includes(searchTerm) ||
        variable.id.toLowerCase().includes(searchTerm)
      )
    }

    return null
  }

  // Add effect to update localStorage when result changes
  useEffect(() => {
    if (result !== null) {
      const storageKey = `result_${item.id}`
      
      // If result is a string starting with '[' and ending with ']', parse it as array
      let value = result
      if (typeof result === 'string' && result.startsWith('[') && result.endsWith(']')) {
        try {
          // Parse the formatted string back into an array
          const cleanValue = result.replace(/\s/g, '')
          value = JSON.parse(cleanValue)
        } catch {
          // If parsing fails, keep original string value
          console.warn('Failed to parse array result:', result)
        }
      }

      localStorage.setItem(storageKey, JSON.stringify({
        name: item.name,
        value: value
      }))
    }
  }, [result, item.id, item.name])

  const handleSelectItem = (item: string, type: 'functions' | 'variables') => {
    const prefix = type === 'functions' ? '@' : '#'
    const words = formula.slice(0, cursorPosition).split(' ')
    const beforeWords = words.slice(0, -1)
    const afterFormula = formula.slice(cursorPosition)
    
    let newFormula
    if (type === 'functions') {
      // Add function name without parentheses for all function types
      newFormula = [
        ...beforeWords,
        `${prefix}${item}`,
      ].join(' ') + ' ' + afterFormula
      
      setFormula(newFormula)
    } else {
      // For variables, format value based on type
      const variable = variables.find(v => v.id === item)
      let value

      if (variable) {
        value = variable.value
      } else if (item.startsWith('result_')) {
        // Handle formula variables from localStorage
        try {
          const storedData = JSON.parse(localStorage.getItem(item) || '')
          value = storedData.value
        } catch {
          value = item
        }
      } else {
        value = item
      }
      
      let formattedValue
      if (typeof value === 'string') {
        formattedValue = `#"${value}"`  // Only wrap strings in quotes
      } else if (Array.isArray(value)) {
        formattedValue = `#[${value.join(', ')}]`  // No quotes for arrays
      } else {
        formattedValue = `#${value}`  // Numbers and other types
      }
      
      newFormula = [
        ...beforeWords,
        formattedValue,
      ].join(' ') + ' ' + afterFormula
      
      setFormula(newFormula)
    }
    
    if (type === 'functions') {
      setSelectedFunction(item)
      setDocs(functionMetadata[item as keyof typeof functionMetadata]?.docs || '')
    }
    
    setShowDropdown(false)
    inputRef.current?.focus()
    setIsCommandFocused(false)
  }

  // Helper function to get value from variable ID or raw value
  const getValue = (part: string) => {
    const value = part.replace('#', '')
    
    // Try parsing as JSON array
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        // Remove brackets and split by comma
        const items = value
          .replace(/^\[|\]$/g, '')  // Remove brackets
          .split(',')               // Split by comma
          .map(item => item.trim()) // Trim whitespace
          .filter(Boolean)          // Remove empty entries
          .map(item => {
            // Try to convert to number if possible, otherwise keep as string
            const num = Number(item)
            return !isNaN(num) ? num : item.replace(/^["']|["']$/g, '') // Remove quotes if present
          })
        return items
      } catch {
        // Fallback to original value if parsing fails
        return value
      }
    }
    
    // Try parsing as string (remove quotes and check if it's an array string)
    if (value.startsWith('"') && value.endsWith('"')) {
      const unquoted = value.slice(1, -1)
      // Check if the unquoted value is an array string
      if (unquoted.startsWith('[') && unquoted.endsWith(']')) {
        try {
          const items = unquoted
            .replace(/^\[|\]$/g, '')
            .split(',')
            .map(item => item.trim())
            .filter(Boolean)
            .map(item => {
              const num = Number(item)
              return !isNaN(num) ? num : item.replace(/^["']|["']$/g, '')
            })
          return items
        } catch {
          return unquoted
        }
      }
      return unquoted
    }
    
    // Try parsing as number
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      return numValue
    }
    
    // Return as is if nothing else matches
    return value
  }

  // Helper function to check if a string is a valid date format
  const isDateString = (str: string): boolean => {
    // Check common date formats: YYYY-MM-DD, MM/DD/YYYY, etc.
    const dateRegex = /^\d{4}-\d{1,2}-\d{1,2}$|^\d{1,2}\/\d{1,2}\/\d{4}$/;
    return dateRegex.test(str);
  }

  // Helper function to convert a value to a Date object if it's a date string
  const convertToDateIfNeeded = (value: any, argName: string, functionName: string): any => {
    // Check if this is a date-related function and argument
    const isDateFunction = functionMetadata[functionName as keyof typeof functionMetadata]?.type === 'date';
    const isDateArg = ['date', 'startDate', 'endDate'].includes(argName);
    
    if (isDateFunction && isDateArg && typeof value === 'string') {
      // If it's a date string, convert to Date object
      if (isDateString(value)) {
        return new Date(value);
      }
    }
    
    // For unit parameter in date functions, ensure it's a string
    if (isDateFunction && argName === 'unit') {
      // If it's a number, convert to a default unit (days)
      if (typeof value === 'number') {
        return 'days';
      }
      
      // If it's a string, ensure it's one of the valid units
      if (typeof value === 'string') {
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '');
        
        // Check if it's a valid unit
        const validUnits = ['days', 'months', 'years', 'hours', 'minutes', 'seconds', 'quarters'];
        if (validUnits.includes(cleanValue.toLowerCase())) {
          return cleanValue.toLowerCase();
        }
        
        // Default to days if not valid
        return 'days';
      }
      
      // Default to days for any other type
      return 'days';
    }
    
    return value;
  }

  const calculateResult = async () => {
    setIsCalculating(true)
    setShowDropdown(false)

    try {
      // Parse formula string, but keep array contents together
      const parts = formula.trim().match(/(?:[^\s,\[\]]|\[[^\]]*\])+/g) || []
      
      if (parts.length === 0) {
        setResult('Invalid formula')
        return
      }

      // First part should be a function name (without @)
      const functionName = parts[0]?.replace('@', '') || ''
      
      // Get function metadata
      const metadata = functionMetadata[functionName as keyof typeof functionMetadata]
      if (!metadata) {
        setResult('Invalid function')
        return
      }

      // Build request body
      let requestBody: FunctionRequestBody = {
        function: functionName,
      }

      // Process all arguments after the function name
      metadata.args.forEach((arg, index) => {
        const rawValue = getValue(parts[index + 1] || '');
        if (rawValue !== null && rawValue !== undefined) {
          const argName = arg.replace('?', '');
          
          if (Array.isArray(rawValue)) {
            // Use the specified paramName from metadata if available
            const arrayParamName = (metadata as any).paramName || 'numbers';
            requestBody[arrayParamName] = rawValue;
          } else {
            // Convert to Date object if needed
            const processedValue = convertToDateIfNeeded(rawValue, argName, functionName);
            requestBody[argName] = processedValue;
          }
        }
      })

      console.log('Sending request:', requestBody) // Debug log

      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      
      // Check both response status and error in data
      if (!response.ok || 'error' in data) {
        setResult(`Error: ${data.error || response.statusText || data.message}`)
      } else {
        const result = data.result
        if (Array.isArray(result)) {
          // Format arrays with brackets and commas
          setResult(`[${result.join(', ')}]`)
        } else if (typeof result === 'number') {
          setResult(Number(result.toFixed(2)))
        } else if (result instanceof Date) {
          setResult(result.toLocaleDateString())
        } else {
          setResult(result)
        }
      }
    } catch (error) {
      console.error('Error calculating:', error)
      setResult('Error: Failed to calculate result')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
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

  // Clean up localStorage when component is deleted
  useEffect(() => {
    return () => {
      localStorage.removeItem(`result_${item.id}`)
    }
  }, [item.id])

  // Add keyboard event handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!isCommandFocused) {
          setIsCommandFocused(true)
          commandRef.current?.focus()
          // Select first item only when starting keyboard navigation
          const filtered = getFilteredItems()
          if (dropdownType === 'functions' && filtered && 'numberFunctions' in filtered) {
            const allFunctions = [
              ...filtered.numberFunctions,
              ...filtered.stringFunctions,
              ...filtered.listFunctions,
              ...filtered.dateFunctions
            ]
            if (allFunctions.length > 0) {
              setHighlightedItem(allFunctions[0][0])
            }
          } else if (dropdownType === 'variables' && Array.isArray(filtered) && filtered.length > 0) {
            setHighlightedItem(filtered[0].id)
          }
        } else {
          // Move to next item
          const filtered = getFilteredItems()
          if (dropdownType === 'functions' && filtered && 'numberFunctions' in filtered) {
            const allFunctions = [
              ...filtered.numberFunctions,
              ...filtered.stringFunctions,
              ...filtered.listFunctions,
              ...filtered.dateFunctions
            ]
            const currentIndex = allFunctions.findIndex(([key]) => key === highlightedItem)
            if (currentIndex < allFunctions.length - 1) {
              setHighlightedItem(allFunctions[currentIndex + 1][0])
            }
          } else if (dropdownType === 'variables' && Array.isArray(filtered)) {
            const currentIndex = filtered.findIndex(v => v.id === highlightedItem)
            if (currentIndex < filtered.length - 1) {
              setHighlightedItem(filtered[currentIndex + 1].id)
            }
          }
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        if (isCommandFocused) {
          const filtered = getFilteredItems()
          if (dropdownType === 'functions' && filtered && 'numberFunctions' in filtered) {
            const allFunctions = [
              ...filtered.numberFunctions,
              ...filtered.stringFunctions,
              ...filtered.listFunctions,
              ...filtered.dateFunctions
            ]
            const currentIndex = allFunctions.findIndex(([key]) => key === highlightedItem)
            if (currentIndex === 0) {
              setIsCommandFocused(false)
              inputRef.current?.focus()
            } else if (currentIndex > 0) {
              setHighlightedItem(allFunctions[currentIndex - 1][0])
            }
          } else if (dropdownType === 'variables' && Array.isArray(filtered)) {
            const currentIndex = filtered.findIndex(v => v.id === highlightedItem)
            if (currentIndex === 0) {
              setIsCommandFocused(false)
              inputRef.current?.focus()
            } else if (currentIndex > 0) {
              setHighlightedItem(filtered[currentIndex - 1].id)
            }
          }
        }
        break

      case 'Enter':
        e.preventDefault()
        if (isCommandFocused && highlightedItem) {
          handleSelectItem(
            highlightedItem,
            dropdownType || 'functions'
          )
          setIsCommandFocused(false)
        }
        break

      case 'Escape':
        e.preventDefault()
        setShowDropdown(false)
        setIsCommandFocused(false)
        inputRef.current?.focus()
        break
    }
  }

  return (
    <Card
      ref={cardRef}
      className={cn(
        "absolute w-96",
        !isEditing && "cursor-move",
        "select-none"
      )}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      data-id={item.id}
    >
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium flex items-center">
            {isEditing ? (
              <Input
                value={item.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                onBlur={handleBlur}
                onClick={(e) => e.stopPropagation()}
                className="w-48"
                autoFocus
              />
            ) : (
              <>
                <FunctionSquare className='mr-1 size-5'/>{item.name}
              </>
            )}
          </h3>
          <XIcon 
            className="h-6 w-6 rounded-full hover:cursor-pointer hover:bg-slate-100 p-1"
            onClick={(e) => {
              e.stopPropagation()
              localStorage.removeItem(`result_${item.id}`)
              onDelete()
            }}
          />
        </div>

        <div className="relative">
          <Input
            ref={inputRef}
            value={formula}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type @ for functions, # for variables"
            className="font-mono"
            autoComplete="off"
          />
          
          {showDropdown && (
            <Command
              ref={commandRef}
              className={cn(
                "absolute z-50 rounded-lg border shadow-md bg-popover h-[800px] overflow-hidden",
                // Adjust width based on dropdown type and content
                dropdownType === 'variables' ? "w-[150px] h-auto" : "w-auto h-auto"
              )}
              onKeyDown={handleKeyDown}
            >
              <CommandList className="max-h-[850px] overflow-auto">
                {(() => {
                  const filtered = getFilteredItems()
                  
                  if (!filtered) return null
                  
                  if (Array.isArray(filtered)) {  // Variables case
                    return (
                      <CommandGroup heading="Variables" className="w-full">
                        {filtered.map(variable => (
                          <CommandItem
                            key={variable.id}
                            onSelect={() => handleSelectItem(variable.id, 'variables')}
                            className={cn(
                              "cursor-pointer",
                              (isCommandFocused && highlightedItem === variable.id) && "bg-accent"
                            )}
                          >
                            <LucideVariable className="h-4 w-4" />
                            {variable.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )
                  }

                  // Functions case - only show columns that have content
                  const hasLeftColumn = filtered.numberFunctions.length > 0 || filtered.stringFunctions.length > 0
                  const hasRightColumn = filtered.listFunctions.length > 0 || filtered.dateFunctions.length > 0

                  return (
                    <div className={cn(
                      "divide-x overflow-hidden",
                      hasLeftColumn && hasRightColumn ? "grid grid-cols-2" : "w-full"
                    )}>
                      {hasLeftColumn && (
                        <div className="overflow-y-auto">
                          {filtered.numberFunctions.length > 0 && (
                            <CommandGroup heading="Number Functions">
                              {filtered.numberFunctions.map(([key, { label, icon: Icon }]) => (
                                <CommandItem
                                  key={key}
                                  onSelect={() => handleSelectItem(key, 'functions')}
                                  className={cn(
                                    "cursor-pointer",
                                    (isCommandFocused && highlightedItem === key) && "bg-accent"
                                  )}
                                >
                                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                                  {label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}

                          {filtered.stringFunctions.length > 0 && (
                            <CommandGroup heading="String Functions">
                              {filtered.stringFunctions.map(([key, { label, icon: Icon }]) => (
                                <CommandItem
                                  key={key}
                                  onSelect={() => handleSelectItem(key, 'functions')}
                                  className={cn(
                                    "cursor-pointer",
                                    (isCommandFocused && highlightedItem === key) && "bg-accent"
                                  )}
                                >
                                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                                  {label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </div>
                      )}

                      {hasRightColumn && (
                        <div className={cn(
                          "overflow-y-auto",
                          hasLeftColumn ? "pl-2" : "w-full"
                        )}>
                          {filtered.listFunctions.length > 0 && (
                            <CommandGroup heading="List Functions">
                              {filtered.listFunctions.map(([key, { label, icon: Icon }]) => (
                                <CommandItem
                                  key={key}
                                  onSelect={() => handleSelectItem(key, 'functions')}
                                  className={cn(
                                    "cursor-pointer",
                                    (isCommandFocused && highlightedItem === key) && "bg-accent"
                                  )}
                                >
                                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                                  {label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}

                          {filtered.dateFunctions.length > 0 && (
                            <CommandGroup heading="Date Functions">
                              {filtered.dateFunctions.map(([key, { label, icon: Icon }]) => (
                                <CommandItem
                                  key={key}
                                  onSelect={() => handleSelectItem(key, 'functions')}
                                  className={cn(
                                    "cursor-pointer",
                                    (isCommandFocused && highlightedItem === key) && "bg-accent"
                                  )}
                                >
                                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                                  {label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })()}
              </CommandList>
            </Command>
          )}
        </div>

        {selectedFunction && docs && (
          <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md whitespace-pre-wrap">
            {docs}
          </div>
        )}

        <Button 
          onClick={calculateResult}
          disabled={isCalculating}
          className="w-full"
        >
          {isCalculating ? 'Calculating...' : 'Calculate'}
        </Button>

        <div className="text-sm text-muted-foreground">
          Result: {result === null ? 'Type a formula and click Calculate' : result}
        </div>
      </CardContent>
    </Card>
  )
}

export { FormulaEngine }
export default FormulaEngine