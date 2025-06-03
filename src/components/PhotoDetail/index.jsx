import React, { useEffect, useState } from "react";
import { Stack, Typography, Card, CardContent, CardMedia, Link, TextField, Button, Box, CircularProgress } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
// import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";


const API_BASE = "http://localhost:8081/api";

function PhotoDetail() {
    const { photoId } = useParams();
    console.log(photoId)
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState("");
    useEffect(() => {

        setLoading(true);
        setError(null);
        fetchModel(`${API_BASE}/photo/${photoId}`, {
            method: "GET",
        })
            .then((data) => {
                setPhoto(data);
                console.log(photo)
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Failed to fetch user");
                setLoading(false);
            });
    }, [photoId]);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    if (!photo) {
        return (
            <Typography variant="h5" sx={{ p: 2 }}>
                Photo not found.
            </Typography>
        );
    }
  const handleClick = async () => {
    console.log("clicked")
    console.log(comment)
    const response = await fetchModel(`${API_BASE}/comment/commentsOfPhoto/${photo._id}`, {
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
        <Card key={photo._id} className="photo-card">
            <CardContent>
                 {/* <CardMedia
                              component="img"
                              image={`/images/${photo.file_name}`}
                              alt={`Photo by ${user.first_name}`}
                              className="photo-image"
                              loading="lazy"
                            /> */}
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
                                    <Link
                                        component={RouterLink}
                                        to={`/users/${comment.user_id}`}
                                        color="primary"
                                        sx={{ ml: 1 }}
                                    >
                                        {comment.user_id.first_name} {comment.user_id.last_name}
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
                                  <Stack spacing={2} direction='row'>
                                    <TextField label="Add new a comment ..." variant="outlined" values={comment} onChange={(e) => setComment(e.target.value)} > </TextField>
                                    <Button variant="outlined" size="small" color="primary" onClick={handleClick}>Send</Button>
                                  </Stack>
                </div>
            </CardContent>
        </Card>
    )
}

export default PhotoDetail;