import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';

const Contact: React.FC = () => {
    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Contact
                </Typography>
                <hr />
                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="h6">Phone:</Typography>
                    <Typography variant="body1">8500152222</Typography>
                </Box>
                <Box>
                    <Typography variant="h6">Email:</Typography>
                    <Typography variant="body1">srinath.b2004@gmail.com</Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Contact;
