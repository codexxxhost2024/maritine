"use client"

import { useRef } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

type ForecastItem = {
  dt: number
  temp: number
  humidity: number
  wind_speed: number
}

type WeatherChartProps = {
  forecast: ForecastItem[]
}

export function WeatherChart({ forecast }: WeatherChartProps) {
  const chartRef = useRef<ChartJS>(null)

  const data: ChartData<"line"> = {
    labels: forecast.map((item) =>
      new Date(item.dt * 1000).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    ),
    datasets: [
      {
        label: "Temperature (°C)",
        data: forecast.map((item) => item.temp),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Wind Speed (m/s)",
        data: forecast.map((item) => item.wind_speed),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y1",
      },
      {
        label: "Humidity (%)",
        data: forecast.map((item) => item.humidity),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        yAxisID: "y2",
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Weather Forecast",
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Wind Speed (m/s)",
        },
      },
      y2: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Humidity (%)",
        },
      },
    },
  }

  return <Line options={options} data={data} />
}
