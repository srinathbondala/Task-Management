import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

const LineChartComponent: React.FC<{ registeredData: { _id: string; registeredCount: number }[], completedData: { _id: string; completedCount: number }[] }> = ({ registeredData, completedData }) => {

    Chart.register(...registerables);
    const labels = registeredData.map(task => task._id);
    const registeredCounts = registeredData.map(task => task.registeredCount || 0);
    const completedCounts = completedData.map(task => task.completedCount || 0);

    const data = {
        labels,
        datasets: [
            {
                label: 'Registered Tasks',
                data: registeredCounts,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 0.7)',
            },
            {
                label: 'Completed Tasks',
                data: completedCounts,
                fill: false,
                borderColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };
    return <Line data={data} />;
};

export default LineChartComponent;
