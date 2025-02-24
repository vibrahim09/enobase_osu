export interface Position {
  x: number
  y: number
}

type CanvasItem = {
  id: string
  type: 'variable' | 'formula'
  position: Position
  name: string
  value?: string | number
  isNew?: boolean  // Add this field
  variableType?: 'number' | 'list' | 'string' | 'date'  // Changed 'integer' to 'number'
}