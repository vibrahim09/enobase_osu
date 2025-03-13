import React, { useState, useEffect } from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChartLineIcon, GitGraphIcon, X as XIcon, BarChart, LineChart, PieChart } from 'lucide-react'
import { useDrag } from '@/hooks/useDrag'
import { Position } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Set default font for all charts
ChartJS.defaults.font.family = "'Inter', sans-serif"
ChartJS.defaults.color = '#64748b' // slate-500 for better readability

interface GraphsProps {
  item: {
    id: string
    type: 'chart'
    position: Position
    chartType: 'line' | 'bar' | 'pie'
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
  }
  onPositionChange: (position: Position) => void
  onDelete: () => void
  onUpdate?: (id: string, updates: Partial<any>) => void
}

const Graphs = ({ item, onPositionChange, onDelete, onUpdate }: GraphsProps) => {
  const { position, startDrag } = useDrag({
    initialPosition: item.position,
    onDragEnd: onPositionChange
  })

  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>(item.chartType)
  const hasMultipleDatasets = item.data.datasets.length > 1

  // If multiple datasets and pie chart is selected, switch to bar chart
  useEffect(() => {
    if (hasMultipleDatasets && chartType === 'pie') {
      setChartType('bar')
      if (onUpdate) {
        onUpdate(item.id, { chartType: 'bar' })
      }
    }
  }, [hasMultipleDatasets, chartType, item.id, onUpdate])

  const handleChartTypeChange = (newType: 'line' | 'bar' | 'pie') => {
    setChartType(newType)
    if (onUpdate) {
      onUpdate(item.id, { chartType: newType })
    }
  }

  const { names: labels, datasets } = item.data

  // Default colors if not provided
  const defaultBackgroundColors = [
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(231, 233, 237, 0.6)',
    'rgba(75, 192, 192, 0.6)'
  ]
  
  const defaultBorderColors = [
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(231, 233, 237, 1)',
    'rgba(75, 192, 192, 1)'
  ]

  // Format data for Chart.js
  const chartData = {
    labels,
    datasets: datasets.map((dataset, index) => {
      // For single dataset charts, use different colors for each data point
      const isSingleDataset = datasets.length === 1;
      
      if (isSingleDataset && chartType !== 'line') {
        // For bar and pie charts with a single dataset, use different colors for each bar/slice
        return {
          label: dataset.label,
          data: dataset.values,
          backgroundColor: dataset.values.map((_, i) => defaultBackgroundColors[i % defaultBackgroundColors.length]),
          borderColor: dataset.values.map((_, i) => defaultBorderColors[i % defaultBorderColors.length]),
          borderWidth: 1
        };
      } else if (chartType === 'line') {
        // For line charts, use a single color
        return {
          label: dataset.label,
          data: dataset.values,
          backgroundColor: dataset.backgroundColor || 'rgba(75,192,192,0.2)',
          borderColor: dataset.borderColor || defaultBorderColors[index % defaultBorderColors.length],
          borderWidth: 1,
          fill: false
        };
      } else {
        // For multiple datasets, use a single color per dataset
        return {
          label: dataset.label,
          data: dataset.values,
          backgroundColor: dataset.backgroundColor || defaultBackgroundColors[index % defaultBackgroundColors.length],
          borderColor: dataset.borderColor || defaultBorderColors[index % defaultBorderColors.length],
          borderWidth: 1
        };
      }
    })
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        padding: 10,
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      },
      title: {
        display: false,
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 'bold' as const
        }
      }
    },
    scales: chartType !== 'pie' ? {
      x: {
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        },
        grid: {
          color: 'rgba(226, 232, 240, 0.5)'
        }
      },
      y: {
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        },
        grid: {
          color: 'rgba(226, 232, 240, 0.5)'
        }
      }
    } : undefined
  }

  return (
    <Card
      className="absolute w-[500px] shadow-lg"
      style={{ left: position.x, top: position.y }}
    >
      <div className="p-4 border-b flex items-center justify-between cursor-move" onMouseDown={startDrag}>
        <h3 className="font-medium flex items-center"><ChartLineIcon className="mr-2" />{item.name}</h3>
        <XIcon 
          className="absolute right-2 top-2 h-6 w-6 rounded-full hover:cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-1"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        />
      </div>
      
      <div className="flex justify-center gap-2 p-2 border-b">
        <Button 
          onClick={() => handleChartTypeChange('bar')}
          className={`flex items-center gap-1 ${chartType === 'bar' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
        >
          <BarChart className="h-4 w-4" />
          Bar
        </Button>
        <Button 
          onClick={() => handleChartTypeChange('line')}
          className={`flex items-center gap-1 ${chartType === 'line' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
        >
          <LineChart className="h-4 w-4" />
          Line
        </Button>
        {!hasMultipleDatasets && (
          <Button 
            onClick={() => handleChartTypeChange('pie')}
            className={`flex items-center gap-1 ${chartType === 'pie' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          >
            <PieChart className="h-4 w-4" />
            Pie
          </Button>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="h-[300px]">
          {chartType === 'line' && <Line data={chartData} options={chartOptions} />}
          {chartType === 'bar' && <Bar data={chartData} options={chartOptions} />}
          {chartType === 'pie' && <Pie data={chartData} options={chartOptions} />}
        </div>
      </CardContent>
    </Card>
  )
}

export default Graphs