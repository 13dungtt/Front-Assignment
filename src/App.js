import "./App.css";

import React from "react";
import { Grid, Paper, Button } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";

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
  return (
    <Router>
      <div>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TopBar />
          </Grid>

          <div className="main-topbar-buffer" />
          <Grid item xs={10}>
            <NavigateButton />
          </Grid>

          <Grid item sm={3}>
            <Paper className="main-grid-item" elevation={10}>
              <UserList />
            </Paper>
          </Grid>

          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route path="/users/:userId" element={<UserDetail />} />
                <Route path="/photos/:userId" element={<UserPhotos />} />
                <Route path="/users" element={<UserList />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
