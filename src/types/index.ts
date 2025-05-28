export interface Position {
  x: number
  y: number
}

export type BaseCanvasItem = {
  id: string
  position: Position
  name: string
  isNew?: boolean
}

export type VariableItem = BaseCanvasItem & {
  type: 'variable'
  value?: string | number | any[]
  variableType?: 'string' | 'number' | 'list' | 'date'
}

export type FormulaItem = BaseCanvasItem & {
  type: 'formula'
  value?: string
  formula?: string
  calculateAfterUpdate?: boolean
}

export type GridItem = BaseCanvasItem & {
  type: 'grid'
  columns: GridColumn[]
  rows: GridRow[]
}

export type ChartItem = BaseCanvasItem & {
  type: 'chart'
  chartType: 'line' | 'bar' | 'pie'
  data: {
    names: string[]
    datasets: Array<{
      label: string
      values: number[]
      backgroundColor?: string
      borderColor?: string
    }>
  }
}

export type CanvasItem = VariableItem | FormulaItem | GridItem | ChartItem

export type GridColumn = {
  field: string
  header: string
  type: string
}

export type GridRow = Record<string, any>