import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Paper, Typography } from "@mui/material";
import ChartComponent from "./ChartComponent";
import DoughnutChart from "./PieChart";
import { pieChartData } from "../../Types/Task";
import LineChartComponent from "./LineChartComponent";
import useToken from "../../hooks/useToken";

const Analytics: React.FC = () => {
    const [registeredTasks, setRegisteredTasks] = useState<{ _id: string; registeredCount: number }[]>([]);
    const [completedTasks, setCompletedTasks] = useState<{ _id: string; completedCount: number }[]>([]);
    const [completions, setCompletions] = useState<{ _id: string; count: number }[]>([]);
    const { token } = useToken();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/user/completions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }); 
                setRegisteredTasks(response.data.registeredTasks);
                setCompletedTasks(response.data.completedTasks);
                setCompletions(response.data.completions);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [token]);

    const allLabels = Array.from(new Set([...registeredTasks.map(task => task._id), ...completedTasks.map(task => task._id)])); // Union of both label sets

const registeredCounts = allLabels.map(label => {
    const task = registeredTasks.find(task => task._id === label);
    return task ? task.registeredCount : 0;
});

const completedCounts = allLabels.map(label => {
    const task = completedTasks.find(task => task._id === label);
    return task ? task.completedCount : 0;
});

const chartData = {
    labels: allLabels,
    datasets: [
        {
            label: "Registered Tasks",
            data: registeredCounts,
            backgroundColor: "rgba(75, 192, 192, 0.7)",
        },
        {
            label: "Completed Tasks",
            data: completedCounts,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
    ],
};


    const data: pieChartData = {
        backlog: completions.find(c => c._id === "backlog")?.count || 0,
        inProgress: completions.find(c => c._id === "in progress")?.count || 0,
        completed: completions.find(c => c._id === "completed")?.count || 0,
    };

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto', marginBottom:'10px' }}>
            <Typography variant="h4" textAlign={"center"} fontWeight={"bold"} paddingTop={2}>
                Dashboard
            </Typography>
            <br />
            <Grid container height={'85%'} padding={1} gap={2}>
                <Paper elevation={3} sx={{width:'100%', height: '100%',display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius:'16px',padding:'4px'}}>
                    <Grid item xs={12} md={6} sx={{ height: '90%',display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                            <DoughnutChart piedata={data} />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        {/* <ChartComponent chartData={chartData} /> */}
                        <LineChartComponent registeredData={registeredTasks} completedData={completedTasks} />
                    </Grid>
                </Paper>
                <Paper elevation={3} sx={{width:'100%', height: '100%',display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius:'16px'}}>
                    <Grid item xs={12} md={8} sx={{ width: '50%', height: '100%' }}>
                        <ChartComponent chartData={chartData} />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <Box sx={{ width: '80%', height:'100%', borderRadius: '8px',
                                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        }}>
                            <Paper sx={{backgroundColor:'transparent',
                                padding: 2, borderRadius: 2, boxShadow: 2 
                            }}>
                                <Typography variant="h6" fontWeight="bold" textAlign="center">
                                    Task Summary
                                </Typography>
                                <Typography variant="body1" textAlign="center" sx={{ marginTop: 1 }}>
                                    <strong>Total Registered Tasks:</strong> {registeredTasks.reduce((total, task) => total + task.registeredCount, 0)}
                                </Typography>
                                <Typography variant="body1" textAlign="center" sx={{ marginTop: 1 }}>
                                    <strong>Total Completed Tasks:</strong> {completedTasks.reduce((total, task) => total + task.completedCount, 0)}
                                </Typography>
                                <Typography variant="body1" textAlign="center" sx={{ marginTop: 1 }}>
                                    <strong>Total In Progress:</strong> {completions.find(c => c._id === "in progress")?.count || 0}
                                </Typography>
                                <Typography variant="body1" textAlign="center" sx={{ marginTop: 1 }}>
                                    <strong>Total Backlog:</strong> {completions.find(c => c._id === "backlog")?.count || 0}
                                </Typography>
                            </Paper>
                        </Box>
                    </Grid>
                </Paper>
            </Grid>
        </Box>
    );
};

export default Analytics;
