import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
// import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const API_BASE = "http://localhost:8081/api";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchModel(`${API_BASE}/user/${userId}`,{
      method: "GET"
    })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch user");
        setLoading(false);
      });
  }, [userId]);

  if (!user) {
    return <Typography variant="h4">User not found</Typography>;
  }

  return (
    <Card className="user-detail-card">
      <CardContent>
        <div className="user-detail-header">
          <Typography variant="h4" gutterBottom>
            {user.first_name} {user.last_name}
          </Typography>

          <Typography variant="h6" color="textSecondary">
            {user.occupation}
          </Typography>
        </div>

        <Typography variant="body1" className="user-detail-location">
          Location: {user.location}
        </Typography>

        <Typography variant="body1" className="user-detail-description">
          {user.description}
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to={`/photos/${user._id}`}
          color="primary"
          className="photos-button"
        >
          View Photos
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;
