import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Task } from '../../Types/Task';
import { Grid } from '@mui/material';

interface ListViewProps {
    tasks: Task[];
}

const ListView: React.FC<ListViewProps> = ({ tasks }) => {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 6 });

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'created_at', headerName: 'Created At', width: 200 },
        { field: 'updated_at', headerName: 'Updated At', width: 200 },
        { field: 'category', headerName: 'Category', width: 150 },
        { field: 'priority', headerName: 'Priority', width: 150 },
        { field: 'project', headerName: 'project', width: 150 },
        { field: 'due_date', headerName: 'Due Date', width: 150 },
    ];

    return (
        <Grid container >
            <Grid item xs={12} md={12}>
                <DataGrid 
                    rows={tasks} 
                    columns={columns} 
                    getRowId={(row) => row._id}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    // rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection
                    sx={{ height: 450}}
                />
            </Grid>
        </Grid>
    );
};

export default ListView;