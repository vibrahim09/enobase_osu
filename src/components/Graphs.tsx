import React, { useEffect, useState } from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'

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

interface GraphsProps {
  names: string[]
  values: number[]
}

const Graphs = ({ names, values }: GraphsProps) => {
  const labels = names
  const dataValues = values

  

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Line Chart',
        data: dataValues,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  }

  const barData = {
    labels,
    datasets: [
      {
        label: 'Bar Chart',
        data: dataValues,
        backgroundColor: ['red', 'blue', 'yellow', 'green', 'purple', 'orange'],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54,162,235,1)',
          'rgba(255,206,86,1)',
          'rgba(75,192,192,1)',
          'rgba(153,102,255,1)',
          'rgba(255,159,64,1)'
        ],
        borderWidth: 1,
      },
    ],
  }

  const pieData = {
    labels,
    datasets: [
      {
        label: 'Pie Chart',
        data: dataValues,
        backgroundColor: ['red', 'blue', 'yellow', 'green', 'purple', 'orange'],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54,162,235,1)',
          'rgba(255,206,86,1)',
          'rgba(75,192,192,1)',
          'rgba(153,102,255,1)',
          'rgba(255,159,64,1)'
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div>
      <h2>Line Chart</h2>
      <Line data={lineData} />
      <h2>Bar Chart</h2>
      <Bar data={barData} />
      <h2>Pie Chart</h2>
      <Pie data={pieData} />
    </div>
  )
}

export default Graphs










