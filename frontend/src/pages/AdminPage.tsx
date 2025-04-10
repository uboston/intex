// components/AdminMovies.js
import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  fetchMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  fetchCategories,
  fetchRatingCategories,
  getNextShowId,
  searchMovies
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';

import Pagination from '../components/Pagination';
import BackArrow from '../components/BackArrow';

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

const MovieForm = ({
  open,
  onClose,
  onSubmit,
  initialData = {
    showId: '',
    type: '',
    title: '',
    director: '',
    cast: '',
    country: '',
    releaseYear: '',
    rating: '',
    duration: '',
    description: '',
    categories: [],
  },
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MovieFormData) => void;
  initialData?: MovieFormData;
}) => {
  const [formData, setFormData] = useState({
    showId: initialData.showId || '',
    type: initialData.type || '',
    title: initialData.title || '',
    director: initialData.director || '',
    cast: initialData.cast || '',
    country: initialData.country || '',
    releaseYear: initialData.releaseYear || '',
    rating: initialData.rating || '',
    duration: initialData.duration || '',
    description: initialData.description || '',
    categories: initialData.categories || [],
  });

  // ✅ Move useState for options HERE
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [ratingOptions, setRatingOptions] = useState<string[]>([]);
  const typeOptions = ['Movie', 'TV Show'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedCategories, fetchedRatings] = await Promise.all([
          fetchCategories(),
          fetchRatingCategories(),
        ]);

        setCategoryOptions(fetchedCategories);
        setRatingOptions(fetchedRatings);
      } catch (error) {
        console.error('Failed to load form metadata:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    setFormData({
      showId: initialData.showId || '',
      type: initialData.type || '',
      title: initialData.title || '',
      director: initialData.director || '',
      cast: initialData.cast || '',
      country: initialData.country || '',
      releaseYear: initialData.releaseYear || '',
      rating: initialData.rating || '',
      duration: initialData.duration || '',
      description: initialData.description || '',
      categories: initialData.categories || [],
    });
  }, [JSON.stringify(initialData)]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
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
        <FormControl fullWidth margin="dense">
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            label="Type"
          >
            {typeOptions.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        <FormControl fullWidth margin="dense">
        <InputLabel>Rating</InputLabel>
        <Select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          label="Rating"
        >
          {ratingOptions.map((rating) => (
            <MenuItem key={rating} value={rating}>
              {rating}
            </MenuItem>
          ))}
        </Select>
        </FormControl>

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
        <FormControl fullWidth margin="dense">
        <InputLabel>Categories</InputLabel>
        <Select
          multiple
          name="categories"
          value={formData.categories}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              categories: e.target.value as string[],
            }))
          }
          input={<OutlinedInput label="Categories" />}
          renderValue={(selected) => (selected as string[]).join(', ')}
        >
          {categoryOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={formData.categories.includes(option)} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
        </FormControl>
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
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [editingMovie, setEditingMovie] = useState<movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');


  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        setError(null);
  
        if (searchQuery.trim()) {
          // ✅ Search mode: fetch all matches
          const searchResults = await searchMovies(searchQuery);
          setMovies(searchResults);
          setIsSearching(true);
        } else {
          // ✅ Normal paginated fetch
          const data = await fetchMovies(pageSize, pageNumber, []);
          setMovies(data.movies);
          setTotalPages(Math.ceil(data.totalMovies / pageSize));
          setIsSearching(false);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
  
    loadMovies();
  }, [pageSize, pageNumber, searchQuery]); // ← ✅ include searchQuery as a dependency
  

  const handleAdd = async () => {
    try {
      const nextId = await getNextShowId();
      setSelectedMovie({
        showId: nextId,
        title: '',
        type: '',
        director: '',
        cast: '',
        country: '',
        releaseYear: '',
        rating: '',
        duration: '',
        description: '',
        categories: [],
      });
      setOpenForm(true);
    } catch (err) {
      console.error('Failed to fetch next ShowId:', err);
      setError((err as Error).message);
    }
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
      console.log('log error:', error);
      setError((error as Error).message);
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleFormSubmit = async (movieData: MovieFormData) => {
    try {
      let updatedMovies: movie[];
  
      if (!movieData.showId && !selectedMovie) {
        throw new Error("Missing showId for new movie.");
      }
      if (selectedMovie) {
        // Update existing movie
        const updated = await updateMovie(movieData.showId || '', {
          ...movieData,
          showId: movieData.showId || '', // Ensure showId is always a string
          categories: movieData.categories || [],
        });
  
        updatedMovies = movies.map((m) =>
          m.showId === updated.showId ? updated : m
        );
      } else {
        // Add new movie
        const added = await addMovie({
          ...movieData,
          showId: movieData.showId || '', // Ensure showId is always a string
          categories: movieData.categories || [],
        });
  
        updatedMovies = [...movies, added];
      }
  
      setMovies(updatedMovies);
      setOpenForm(false);
      setSelectedMovie(null); // Reset for next add
    } catch (err) {
      console.error('Form submission error:', err);
      setError((err as Error).message);
    }
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <BackArrow />
  
      {error ? (
        <div>
          <p className="text-red-600 mt-4">{error}</p>
        </div>
      ) : (
        <>
          <h1>Movies Admin</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            style={{ marginBottom: '20px' }}
          >
            Add New Movie
          </Button>
          <TextField
            label="Search by title, director, cast..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            margin="normal"
          />
  
          {isSearching && (
            <Button
              onClick={() => setSearchQuery('')}
              variant="outlined"
              size="small"
              style={{ marginTop: '8px', marginBottom: '16px' }}
            >
              Clear Search
            </Button>
          )}
  
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
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
          {!isSearching && (
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
          )}
          <MovieForm
            open={openForm}
            onClose={() => setOpenForm(false)}
            onSubmit={handleFormSubmit}
            initialData={selectedMovie || undefined}
          />
        </>
      )}
    </div>
  );
  
};

export default AdminMovies;