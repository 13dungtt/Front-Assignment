import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import { TextField, Button, Typography, Paper } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";
const API_BASE = "https://gk34xq-8081.csb.app/api";

const LoginRegister = ({ onLoginSuccess }) => {
  const [loginName, setLoginName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetchModel(`http://localhost:8081/api/user/login`, {
        method: "POST",
        headers: {
          Accept: "Content-Type",
          "Content-Type": "application/json",
        },
        // credentials: "include", // important for session cookies
        body: JSON.stringify({ login_name: loginName }),
      });

      if (response) {
        const user = response
        onLoginSuccess(user);
        navigate("/user/list");
      } else setError("Invalid login name");
      // if (response.ok) {
      //   const user = await response.json();
      //   onLoginSuccess(user);
      // } else if (response.status === 400) {
      //   setError("Login failed: Invalid login name.");
      // } else {
      //   setError(`Unexpected error: ${response.statusText}`);
      // }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed!");
    }
  };

  return (
    <Paper style={{ padding: "2rem", maxWidth: "400px", margin: "2rem auto" }}>
      <Typography variant="h5" gutterBottom>
        Please Login
      </Typography>

      <TextField
        fullWidth
        label="Login name"
        value={loginName}
        onChange={(e) => setLoginName(e.target.value)}
        margin="normal"
        variant="standard"
      />


      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        fullWidth
        disabled={!loginName.trim()}
      >
        Login
      </Button>

      {/* <Typography variant="body2" style={{ marginTop: "1rem" }}>
        Don't have an account? Registration coming soon.
      </Typography> */}
    </Paper>
  );
};

export default LoginRegister;
