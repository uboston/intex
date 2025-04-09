// components/AdminMovies.js
import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  fetchMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from '../api/MoviesAPI';

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

import Pagination from '../components/Pagination';

interface movie {
  showId: string;
  type: string;
  title: string;
  director: string;
  cast: string;
  country: string;
  releaseYear: string;
  rating: string;
  duration: string;
  description: string;
  categories: string[];
}

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
  const [movies, setMovies] = useState<movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<movie | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState<number>(50);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [editingMovie, setEditingMovie] = useState<movie | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies(pageSize, pageNumber, []);
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalMovies / pageSize));
        console.log("Page", pageNumber, "Movies:", data.movies.map((m: any) => m.showId));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    console.log("Loading movies for page", pageNumber);
    loadMovies();
  }, [pageSize, pageNumber]);

  const handleAdd = () => {
    setSelectedMovie(null);
    setOpenForm(true);
  };

  const handleEdit = (movie: movie) => {
    setSelectedMovie(movie);
    setOpenForm(true);
  };

  const handleDelete = async (showId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this Movie?'
    );
    if (!confirmDelete) return;
    try {
      await deleteMovie(showId);
      setMovies(movies.filter((movie) => movie.showId !== showId));
    } catch (error) {
      setError((error as Error).message);
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleFormSubmit = async (movieData: MovieFormData) => {
    try {
      let updatedMovies: movie[];

      // Convert string `showId` to number if needed for API
      const numericShowId = movieData.showId
        ? parseInt(movieData.showId)
        : undefined;

      if (numericShowId) {
        const updated = await updateMovie(numericShowId, {
          showId: movieData.showId || '', // backend expects string
          type: '', // or however you handle this
          title: movieData.title,
          director: movieData.director,
          cast: movieData.cast,
          country: movieData.country,
          releaseYear: movieData.releaseYear,
          rating: movieData.rating,
          duration: movieData.duration,
          description: movieData.description,
          categories: [], // or pull this from form if editable
        });

        updatedMovies = movies.map((m) =>
          m.showId === updated.showId ? updated : m
        );
      } else {
        const added = await addMovie({
          showId: '', // backend should auto-generate this
          type: '', // default value
          title: movieData.title,
          director: movieData.director,
          cast: movieData.cast,
          country: movieData.country,
          releaseYear: movieData.releaseYear,
          rating: movieData.rating,
          duration: movieData.duration,
          description: movieData.description,
          categories: [],
        });

        updatedMovies = [...movies, added];
      }

      setMovies(updatedMovies);
      setOpenForm(false);
    } catch (err) {
      console.error('Form submission error:', err);
      setError((err as Error).message);
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
            {movies.map((movie: movie) => (
              <TableRow key={movie.showId}>
                <TableCell>{movie.showId}</TableCell>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.director}</TableCell>
                <TableCell>{movie.releaseYear}</TableCell>
                <TableCell>{movie.rating}</TableCell>
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
                    onClick={() => handleDelete(movie.showId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        currentPage={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNumber}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNumber(1);
        }}
      />
      <MovieForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        initialData={
          selectedMovie
            ? {
                showId: selectedMovie.showId,
                title: selectedMovie.title,
                director: selectedMovie.director,
                cast: selectedMovie.cast || '',
                country: selectedMovie.country || '',
                releaseYear: selectedMovie.releaseYear,
                rating: selectedMovie.rating,
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
