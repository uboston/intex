interface FetchMoviesResponse {
  totalMovies: number;
  movies: movie[];
  totalPages: number;
}

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

const API_URL = 'https://localhost:5000';

export const fetchMovies = async (
  pageNumber: number,
  pageSize: number,
  selectedCategories: string[]
): Promise<FetchMoviesResponse> => {
  const categoryParams = selectedCategories
    .map((category) => `&categories=${encodeURIComponent(category)}`)
    .join('&');
  const response = await fetch(
    `${API_URL}/Movies/GetMovies?pageSize=${pageSize}&pageNumber=${pageNumber}&${categoryParams}`,
    {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  const data = await response.json();
  return data;
};

export const addMovie = async (newMovie: movie): Promise<movie> => {
  try {
    const response = await fetch(`${API_URL}/Movies/CreateMovie?`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMovie),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add movie: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

export const updateMovie = async (
  showId: number,
  updatedMovie: movie
): Promise<movie> => {
  const response = await fetch(`${API_URL}/Movies/UpdateMovie/${showId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedMovie),
  });
  if (!response.ok) {
    throw new Error('Failed to update movie');
  }
  return await response.json();
};

export const deleteMovie = async (showId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/Movies/DeleteMovie/${showId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete movie');
  }
};
