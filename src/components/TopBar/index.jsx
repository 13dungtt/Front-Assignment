import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import models from "../../modelData/models";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function TopBar({ currentUser, onLogout }) {
  const location = useLocation();
  const [contextText, setContextText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const userId = pathParts[pathParts.length - 1];

    if (pathParts.includes("photos")) {
      const user = models.userModel(userId);
      if (user) {
        setContextText(`Photos of ${user.first_name} ${user.last_name}`);
      } else {
        setContextText("");
      }
    } else if (pathParts.includes("users")) {
      const user = models.userModel(userId);
      if (user) {
        setContextText(`${user.first_name} ${user.last_name}`);
      } else {
        setContextText("");
      }
    } else {
      setContextText("User List");
    }
  }, [location]);

  const handleClick = async () => {
    try {
      await fetchModel(`http://localhost:8081/api/user/admin/logout`, {
        method: "POST"
      })
      onLogout();
      navigate('/admin/login')
    } catch (error) {
      console.error("Logout failed:", error);
      onLogout(); // Vẫn xóa thông tin local ngay cả khi logout API lỗi
      navigate('/admin/login');
    }
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className="topbar-toolbar">
        <Typography variant="h5" className="topbar-title" color="inherit">
          Trần Tiến Dũng - B22DCCN140
        </Typography>
        {currentUser ? (
          <>
            <Typography variant="h6" color="inherit" sx={{ flexGrow: 1, textAlign: 'center' }}>
              Hi {currentUser.first_name}!
            </Typography>

            <Button variant="standard" color="error" onClick={handleClick} >
              Logout
            </Button>
          </>
        ) : (
          <Typography variant="h6" color="inherit" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Please Login
          </Typography>
        )}

        <Typography variant="h6" className="topbar-context" color="inherit">
          {contextText}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
