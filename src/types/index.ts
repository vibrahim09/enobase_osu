export interface Position {
  x: number
  y: number
}

export interface GridColumn {
  field: string
  header: string
  type: string
}

export interface GridRow {
  [key: string]: any
}

type BaseCanvasItem = {
  id: string
  position: Position
  name: string
  isNew?: boolean
}

type VariableItem = BaseCanvasItem & {
  type: 'variable'
  value?: string | number | any[]
  variableType?: 'string' | 'number' | 'list' | 'date'
}

type FormulaItem = BaseCanvasItem & {
  type: 'formula'
  value?: string
  formula?: string
  calculateAfterUpdate?: boolean
}

type GridItem = BaseCanvasItem & {
  type: 'grid'
  columns: GridColumn[]
  rows: GridRow[]
}

type ChartItem = BaseCanvasItem & {
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