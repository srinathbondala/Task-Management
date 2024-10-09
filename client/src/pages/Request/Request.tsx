import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography, Alert } from "@mui/material";
import axios from 'axios';

const ContactAdmin: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState<boolean | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const requestData = {
            name,
            email,
            message,
        };

        try {
            // await axios.post('http://localhost:8080/api/contact-admin', requestData);
            setSuccess(true);
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            setSuccess(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Request Access
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                    Please fill in your details to request access to the application. An admin will review your request and get back to you.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Message"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Send Request
                    </Button>
                </Box>
                {success === true && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Your request has been sent successfully. The admin will contact you shortly.
                    </Alert>
                )}
                {success === false && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        Something went wrong. Please try again later.
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default ContactAdmin;
