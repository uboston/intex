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
  pageSize: number,
  pageNumber: number,
  selectedCategories: string[]
): Promise<FetchMoviesResponse> => {
  const categoryParams = selectedCategories
    .map((category) => `&categories=${encodeURIComponent(category)}`)
    .join('&');
  const response = await fetch(
    `${API_URL}/Movies/GetMovies?pageSize=${pageSize}&pageNum=${pageNumber}&${categoryParams}`,
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
    const response = await fetch(`${API_URL}/Admin/CreateMovie?`, {
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
  const response = await fetch(`${API_URL}/Admin/UpdateMovie/${showId}`, {
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
  const response = await fetch(`${API_URL}/Admin/DeleteMovie/${showId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete movie');
  }
};

export const getGenres = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/Recommend/TopGenres/`, {
      method: 'GET',
      credentials: 'include', // send credentials to get cookies
    });

    if (!response.ok) {
      throw new Error('Failed to fetch TopGenres');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching top genres:', error);
    throw error;
  }
};

export const randomGenres = async (usedGenres: string[]): Promise<string[]> => {
  try {
    const genreParameters = usedGenres
      .map((g) => `usedGenres=${encodeURIComponent(g)}`)
      .join('&');

    const response = await fetch(
      `${API_URL}/Recommend/RandomGenres?${
        usedGenres.length ? `&${genreParameters}` : ''
      }`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch RandomGenres');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching random genres:', error);
    throw error;
  }
};

export const getMoviesFromGenre = async (genre: string): Promise<movie[]> => {
  try {
    const response = await fetch(
      `${API_URL}/Movies/MoviesByGenre?genre=${encodeURIComponent(genre)}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch getMoviesFromGenre');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movies from genres:', error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/Movies/GetCategories`);

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export const fetchRatingCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/Movies/GetRatingCategories`);

    if (!response.ok) {
      throw new Error('Failed to fetch rating categories');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching rating categories:', error);
    throw error;
  }
}

};

export const getRecommendedMovies = async (): Promise<{
  recommendType: string;
  moviesList: movie[];
}> => {
  try {
    const response = await fetch(`${API_URL}/Recommend/TrendingOrForYou`, {
      method: 'GET',
      credentials: 'include', // send credentials to get cookies
    });

    if (!response.ok) {
      throw new Error('Failed to fetch getRecommendedMovies');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movies from trending or for you:', error);
    throw error;
  }
};

export const updateStarRating = async (showId: string, rating: number) => {
  try {
    const response = await fetch(`${API_URL}/Recommend/TrendingOrForYou`, {
      method: 'POST',
      credentials: 'include', // send credentials to get cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        showId: showId,
        rating: rating,
      }),
    });

    if (!response.ok) {
      alert('Update failed to save.');
      throw new Error('Failed to fetch getRecommendedMovies');
    }
  } catch (error) {
    console.error('Error updating star rating:', error);
    throw error;
  }
};
