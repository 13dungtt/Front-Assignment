import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, CardMedia, Link } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
// import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const API_BASE = "https://gk34xq-8081.csb.app/api";

function UserPhotos() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch user info
    fetchModel(`${API_BASE}/user/${userId}`)
      .then((data) => setUser(data))
      .catch((err) => setError(err.message || "Failed to fetch user"));

    // Fetch photos for user
    fetchModel(`${API_BASE}/photo/photosOfUser/${userId}`)
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

  return (
    <div className="photo-container">
      {photos.map((photo) => (
        <Card key={photo._id} className="photo-card">
          <CardMedia
            component="img"
            image={`/images/${photo.file_name}`}
            alt={`Photo by ${user.first_name}`}
            className="photo-image"
            loading="lazy"
          />
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
                      {formatDate(comment.date_time)} -{" "}
                      <Link
                        component={RouterLink}
                        to={`/users/${comment.user._id}`}
                        color="primary"
                        sx={{ ml: 1 }}
                      >
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
