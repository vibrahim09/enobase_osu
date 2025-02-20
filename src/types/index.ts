export interface Position {
  x: number
  y: number
}

export interface CanvasItem {
  id: string
  type: 'variable' | 'formula'
  position: Position
  name: string
  value?: number
} 