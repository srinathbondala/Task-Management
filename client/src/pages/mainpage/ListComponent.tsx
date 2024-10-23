import React, { useState } from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Task } from '../../Types/Task';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

interface ListViewProps {
    tasks: Task[];
}

const ListView: React.FC<ListViewProps> = ({ tasks }) => {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 6 });
    const navigate = useNavigate();

    const onView = (taskId: string) => {
        navigate('edit/' + taskId);
    };

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'created_at', headerName: 'Created At', width: 200 },
        { field: 'updated_at', headerName: 'Updated At', width: 200 },
        { field: 'category', headerName: 'Category', width: 150 },
        { field: 'priority', headerName: 'Priority', width: 150 },
        {
            field: 'project',
            headerName: 'Project',
            width: 150,
            valueGetter: (params: any) => {
                return params.name ? params.name : 'Project';
            },
        },
        { field: 'due_date', headerName: 'Due Date', width: 150 },
        { field: 'user', headerName: 'Assignee', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => onView(params.row._id)}
                />
            ]
        }
    ];

    return (
        <Grid container>
            <Grid item xs={12} md={12}>
                <DataGrid
                    rows={tasks}
                    columns={columns}
                    getRowId={(row) => row._id}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    checkboxSelection
                    sx={{ height: 450 }}
                />
            </Grid>
        </Grid>
    );
};

export default ListView;
