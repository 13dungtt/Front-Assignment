import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";
// import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";

const API_BASE = "http://localhost:8081/api";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchModel(`${API_BASE}/user/list`,{
      method: "GET"
    })
      .then((data) => {
        //console.log(data);
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch user list");
        setLoading(false);
      });
  }, []);

  if (loading) return <Typography>Loading users...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div className="user-list">
      <List component="nav">
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem disablePadding className="user-list-item">
              <ListItemButton component={Link} to={`/users/${user._id}`}>
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                  secondary={`${user.occupation}` || "None"}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
