import "./App.css";
import React, { useState } from "react";
import { Grid, Paper, Button } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import PhotoDetail from "./components/PhotoDetail";
const NavigateButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate("/users")}
      style={{ position: "absolute", bottom: "30px", left: "30px" }}
    >
      Show User List
    </Button>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null); // null = not logged in

  const handleLogin = (user) => {
    setCurrentUser(user);

  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const ProtectedRoute = ({ element }) => {
    return currentUser ? element : <Navigate to="/admin/login" />;
  };

  return (
    <Router>
      <div>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TopBar
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          </Grid>

          <Grid item xs={12}>
            <div className="main-topbar-buffer" />
          </Grid>

          {currentUser && (
            <Grid item xs={10}>
              <NavigateButton />
            </Grid>
          )}

          {currentUser && (
            <Grid item sm={3}>
              <Paper className="main-grid-item" elevation={10}>
                <UserList />
              </Paper>
            </Grid>
          )}

          <Grid item sm={currentUser ? 9 : 12}>
            <Paper className="main-grid-item">
              <Routes>
                <Route
                  path="/admin/login"
                  element={
                    <LoginRegister onLoginSuccess={handleLogin} />
                  }
                />
                <Route
                  path="/users/:userId"
                  element={<ProtectedRoute element={<UserDetail />} />}
                />
                <Route
                  path="/photos/:userId"
                  element={<ProtectedRoute element={<UserPhotos curretUser={currentUser} />} />}
                />
                <Route
                  path="/details/:photoId" // <-- THÊM ROUTE MỚI CHO PhotoDetail
                  element={<ProtectedRoute element={<PhotoDetail />} />}
                />
                <Route
                  path="/users"
                  element={<ProtectedRoute element={<UserList />} />}
                />
                <Route
                  path="/"
                  element={
                    currentUser ? (
                      <Navigate to={`/users/${currentUser._id}`} />
                    ) : (
                      <Navigate to="/admin/login" />
                    )
                  }
                />

              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>

    </Router>
  );
};

export default App;
