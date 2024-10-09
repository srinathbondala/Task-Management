import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { pieChartData } from '../../Types/Task';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
    piedata: pieChartData;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ piedata }) => {
    const data = {
        labels: ['Backlog', 'In Progress', 'Completed'],
        datasets: [
            {
                data: [piedata.backlog, piedata.inProgress, piedata.completed],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Task Distribution',
            },
        },
        cutout: '50%',
    };

    return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
