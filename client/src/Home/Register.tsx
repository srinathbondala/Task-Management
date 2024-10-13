import React, { useState } from "react";
import { Button, Container, TextField, Typography, Paper, Alert, Select, MenuItem } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import { register, roleType } from "../Types/Task";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<register>({ username: "", email: "", password: "", firstName: "", lastName: "" , role: roleType.USER});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; firstName?: string; lastName?: string; }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStrongPassword = (password: string) =>
    password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%]/.test(password);

  const validateForm = () => {
    const newErrors: { username?: string; email?: string; password?: string; firstName?: string; lastName?: string } = {};
    let isValid = true;

    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if(!formData.firstName){
      newErrors.firstName = "First Name is required";
      isValid = false;
    }

    if(!formData.lastName){
      newErrors.lastName = "Last Name is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is not valid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!isStrongPassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long, include uppercase, lowercase, a digit, and a special character";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:8080/auth/register", formData);
      setSuccessMessage(response.data.message);
      setError("");
      setFormData({ username: "", email: "", password: "", firstName: "", lastName: "" , role: roleType.USER}); 
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred while registering. Please try again.");
      }

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const handleRoleChange = (e: SelectChangeEvent<roleType>) => {
    setFormData({ ...formData, role: e.target.value as roleType });
  };

  return (
    <Container maxWidth="sm" sx={{maxHeight:'100%'}}>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 5}}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.password}
            helperText={errors.password}
          />
          <Select
            label="role"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            fullWidth
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
