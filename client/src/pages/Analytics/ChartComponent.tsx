import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartComponentProps {
    chartData: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
        }[];
    };
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartData }) => {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            title: {
                display: true,
                text: "Weekly Tasks Registration and Completion",
                font: {
                    size: 18,
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: "Weekdays",
                    font: {
                        size: 14,
                    },
                },
            },
            y: {
                grid: {
                    display: true,
                },
                title: {
                    display: true,
                    text: "Count",
                    font: {
                        size: 14,
                    },
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <div style={{ height: "400px", width: "90%", margin: "0 auto" }}>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default ChartComponent;
