import React, { useEffect, useState } from "react";
import { Stack, Typography, Card, CardContent, CardMedia, TextField, Button } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
// import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const API_BASE = "http://localhost:8081/api";

function UserPhotos() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch user info
    fetchModel(`${API_BASE}/user/${userId}`, {
      method: "GET"
    })
      .then((data) => setUser(data))
      .catch((err) => setError(err.message || "Failed to fetch user"));

    // Fetch photos for user
    fetchModel(`${API_BASE}/photo/photosOfUser/${userId}`, {
      method: "GET"
    })
      .then((data) => setPhotos(data))
      .catch((err) => setError(err.message || "Failed to fetch photos"))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="h4" color="error">
        {error}
      </Typography>
    );
  }

  if (!user || photos.length === 0) {
    return <Typography variant="h4">Photos not found</Typography>;
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleClick = async () => {
    console.log("clicked")
    console.log(comment)
    const response = await fetchModel(`${API_BASE}/comment/commentsOfPhoto/${photos.comments}`, {
      method: "POST",
      headers: {
        Accept: "Content-Type",
        "Content-Type": "application/json",
      },
      // credentials: "include", // important for session cookies
      body: JSON.stringify({ comment })
    })
    console.log(response)
  }
  return (
    <div className="photo-container">
      {photos.map((photo) => (
        <Card key={photo._id} className="photo-card">
          <RouterLink component={RouterLink} to={`/details/${photo._id}`} onClick={() => console.log('Clicked!')}>
            <CardMedia
              component="img"
              image={`/images/${photo.file_name}`}
              alt={`Photo by ${user.first_name}`}
              className="photo-image"
              loading="lazy"
            />
          </RouterLink>

          <CardContent>
            <Typography variant="body2" color="textSecondary">
              Posted on {formatDate(photo.date_time)}
            </Typography>
            <div className="comment-section">
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>
              {photo.comments && photo.comments.length > 0 ? (
                photo.comments.map((comment) => (
                  <Card key={comment._id} className="comment-card">
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(comment.date_time)} - {" "}
                      <RouterLink
                        component={RouterLink}
                        to={`/users/${comment.user._id}`}
                        color="primary"
                        sx={{ ml: 1 }}
                      >
                        {comment.user.first_name} {comment.user.last_name}
                      </RouterLink>
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {comment.comment}
                    </Typography>

                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No comments yet.
                </Typography>
              )}
              
              <RouterLink to={`/details/${photo._id}`} component={RouterLink}>
                <Button
                  variant="contained"
                  color="primary"
                  className="photos-button"
                  onClick={() => console.log('Clicked!')}
                >
                  Detail Photo
                </Button>
              </RouterLink>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
