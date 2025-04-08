// components/AdminMovies.js
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

// MovieForm Component: used for both creating and editing a movie.
interface MovieFormData {
  showId?: string;
  title: string;
  director: string;
  cast: string;
  country: string;
  releaseYear: string;
  rating: string;
  duration: string;
  description: string;
}

interface Movie {
  ShowId: string;
  Title: string;
  Director: string;
  ReleaseYear: string;
  Rating: string;
  [key: string]: any;
}

const MovieForm = ({
  open,
  onClose,
  onSubmit,
  initialData = {
    showId: '',
    title: '',
    director: '',
    cast: '',
    country: '',
    releaseYear: '',
    rating: '',
    duration: '',
    description: '',
  },
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MovieFormData) => void;
  initialData?: MovieFormData;
}) => {
  const [formData, setFormData] = useState({
    showId: initialData.showId || '',
    title: initialData.title || '',
    director: initialData.director || '',
    cast: initialData.cast || '',
    country: initialData.country || '',
    releaseYear: initialData.releaseYear || '',
    rating: initialData.rating || '',
    duration: initialData.duration || '',
    description: initialData.description || '',
  });

  useEffect(() => {
    setFormData({
      showId: initialData.showId || '',
      title: initialData.title || '',
      director: initialData.director || '',
      cast: initialData.cast || '',
      country: initialData.country || '',
      releaseYear: initialData.releaseYear || '',
      rating: initialData.rating || '',
      duration: initialData.duration || '',
      description: initialData.description || '',
    });
  }, [initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {formData.showId ? 'Edit Movie' : 'Add New Movie'}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Director"
          name="director"
          value={formData.director}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Cast"
          name="cast"
          value={formData.cast}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Release Year"
          name="releaseYear"
          type="number"
          value={formData.releaseYear}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Rating"
          name="rating"
          type="number"
          value={formData.rating}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AdminMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [openForm, setOpenForm] = useState(false);

  // Fetch movies from the backend
  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        'https://localhost:5000/Movies/GetMovies',
        { withCredentials: true }
      );
      setMovies(response.data.Movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleAdd = () => {
    setSelectedMovie(null);
    setOpenForm(true);
  };

  const handleEdit = (movie: Movie) => {
    setSelectedMovie(movie);
    setOpenForm(true);
  };

  const handleDelete = async (movie: Movie) => {
    if (window.confirm(`Are you sure you want to delete "${movie.Title}"?`)) {
      try {
        await axios.delete(
          `https://localhost:5000/Movies/DeleteMovie/${movie.ShowId}`,
          { withCredentials: true }
        );
        setMovies(movies.filter((m) => m.ShowId !== movie.ShowId));
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  const handleFormSubmit = async (movieData: MovieFormData) => {
    if (movieData.showId) {
      // Update existing movie; note the updated full URL for consistency.
      try {
        const response = await axios.put(
          `https://localhost:5000/Movies/UpdateMovie/${movieData.showId}`,
          movieData,
          { withCredentials: true }
        );
        setMovies(
          movies.map((m) =>
            m.ShowId === movieData.showId ? (response.data as Movie) : m
          )
        );
      } catch (error) {
        console.error('Error updating movie:', error);
      }
    } else {
      // Create new movie
      try {
        const response = await axios.post(
          'https://localhost:5000/Movies/CreateMovie',
          movieData,
          { withCredentials: true }
        );
        setMovies([...movies, response.data] as Movie[]);
      } catch (error) {
        console.error('Error creating movie:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Movies Admin</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        style={{ marginBottom: '20px' }}
      >
        Add New Movie
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Show ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Director</TableCell>
              <TableCell>Release Year</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie: Movie) => (
              <TableRow key={movie.ShowId}>
                <TableCell>{movie.ShowId}</TableCell>
                <TableCell>{movie.Title}</TableCell>
                <TableCell>{movie.Director}</TableCell>
                <TableCell>{movie.ReleaseYear}</TableCell>
                <TableCell>{movie.Rating}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleEdit(movie)}
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(movie)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <MovieForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        initialData={
          selectedMovie
            ? {
                showId: selectedMovie.ShowId,
                title: selectedMovie.Title,
                director: selectedMovie.Director,
                cast: selectedMovie.cast || '',
                country: selectedMovie.country || '',
                releaseYear: selectedMovie.ReleaseYear,
                rating: selectedMovie.Rating,
                duration: selectedMovie.duration || '',
                description: selectedMovie.description || '',
              }
            : {
                showId: '',
                title: '',
                director: '',
                cast: '',
                country: '',
                releaseYear: '',
                rating: '',
                duration: '',
                description: '',
              }
        }
      />
    </div>
  );
};

export default AdminMovies;
