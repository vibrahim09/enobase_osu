export interface Position {
  x: number
  y: number
}

export interface GridColumn {
  field: string
  header: string
  type: 'number' | 'string' | 'date'
}

export interface GridRow {
  [key: string]: string | number | Date
}

export type CanvasItem = {
  id: string
  type: 'variable' | 'formula' | 'grid'
  position: Position
  name: string
  isNew?: boolean
} & (
  | {
      type: 'variable'
      value?: string | number | Array<any>
      variableType?: 'number' | 'list' | 'string' | 'date'
    }
  | {
      type: 'formula'
      value?: string
      formula?: string
      calculateAfterUpdate?: boolean
    }
  | {
      type: 'grid'
      columns: GridColumn[]
      rows: GridRow[]
    }
)