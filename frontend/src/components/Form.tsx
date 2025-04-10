import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";

interface FormProps {
  initialData: Partial<any>; // Replace `any` with your proper Movie model type if you have one
  categoryOptions: string[];
  ratingOptions: string[];
  typeOptions: string[];
  onSubmit: (data: any) => void;
  getNextShowId: () => Promise<string>;
}

const Form: React.FC<FormProps> = ({
  initialData,
  categoryOptions,
  ratingOptions,
  typeOptions,
  onSubmit,
  getNextShowId,
}) => {
  const [formData, setFormData] = useState({
    showId: initialData.showId || "",
    title: initialData.title || "",
    type: initialData.type || "",
    rating: initialData.rating || "",
    releaseYear: initialData.releaseYear || 0,
    duration: initialData.duration || "",
    director: initialData.director || "",
    cast: initialData.cast || "",
    country: initialData.country || "",
    description: initialData.description || "",
    categories: [] as string[],
  });

  useEffect(() => {
    const init = async () => {
      if (!initialData.showId) {
        try {
          const newId = await getNextShowId();
          setFormData((prev) => ({ ...prev, showId: newId }));
        } catch (err) {
          console.error("Failed to get next ShowId", err);
        }
      }

      // Pre-fill category flags if editing existing data
      const selectedCategories = categoryOptions.filter((cat) => (initialData as any)[cat] === 1);
      if (selectedCategories.length > 0) {
        setFormData((prev) => ({ ...prev, categories: selectedCategories }));
      }
    };
    init();
  }, [initialData, categoryOptions, getNextShowId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "releaseYear" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: any) => {
    const {
      target: { value },
    } = e;
    setFormData((prev) => ({
      ...prev,
      categories: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map categories to individual int flags
    const categoryFlags = Object.fromEntries(
      categoryOptions.map((cat) => [cat, formData.categories.includes(cat) ? 1 : 0])
    );

    const result = {
      ...formData,
      ...categoryFlags,
    };

    onSubmit(result);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {initialData.showId ? "Edit Movie" : "Add New Movie"}
      </Typography>

      <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} margin="normal" required />
      <TextField fullWidth label="Director" name="director" value={formData.director} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Cast" name="cast" value={formData.cast} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Country" name="country" value={formData.country} onChange={handleChange} margin="normal" />

      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select name="type" value={formData.type} onChange={handleSelectChange} label="Type" required>
          {typeOptions.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Rating</InputLabel>
        <Select name="rating" value={formData.rating} onChange={handleSelectChange} label="Rating">
          {ratingOptions.map((rating) => (
            <MenuItem key={rating} value={rating}>
              {rating}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Release Year"
        name="releaseYear"
        type="number"
        value={formData.releaseYear}
        onChange={handleChange}
        margin="normal"
      />
      <TextField fullWidth label="Duration" name="duration" value={formData.duration} onChange={handleChange} margin="normal" />
      <TextField
        fullWidth
        label="Description"
        name="description"
        multiline
        rows={4}
        value={formData.description}
        onChange={handleChange}
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Categories</InputLabel>
        <Select
          multiple
          value={formData.categories}
          onChange={handleCategoryChange}
          input={<OutlinedInput label="Categories" />}
          renderValue={(selected) => selected.join(", ")}
        >
          {categoryOptions.map((cat) => (
            <MenuItem key={cat} value={cat}>
              <Checkbox checked={formData.categories.indexOf(cat) > -1} />
              <ListItemText primary={cat} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        {initialData.showId ? "Update Movie" : "Add Movie"}
      </Button>
    </Box>
  );
};

export default Form;
