// src/pages/Search.tsx
import React, { useState } from 'react';
import Slider from 'react-slick';
import { fetchMovies } from '../api/MoviesAPI';
import './Search.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Define an interface for your movie objects
interface Movie {
  ShowId: string;
  Title: string;
  Poster?: string;
  // Add additional fields if necessary
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      // Fetch movies from page 1 with a large page size (e.g., 100)
      const data = await fetchMovies(1, 100, []);
      // The helper returns an object with a "movies" property (adjust if necessary)
      const allMovies: Movie[] = data.movies;
      // Filter movies by Title (case-insensitive)
      const filteredMovies = allMovies.filter((movie) =>
        movie.Title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      // Limit to 10 results maximum
      setMovies(filteredMovies.slice(0, 10));
    } catch (err: any) {
      console.error('Error searching for movies:', err);
      setError(err.message);
    }
  };

  // Settings for the react-slick carousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
          />
          <button type="submit" className="btn-search">
            Search
          </button>
        </form>
        {error && <p className="error-message">Error: {error}</p>}
      </header>

      {movies.length > 0 ? (
        <section className="carousel-section">
          <Slider {...sliderSettings}>
            {movies.map((movie) => (
              <div key={movie.ShowId} className="movie-slide">
                {movie.Poster ? (
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="movie-poster"
                  />
                ) : (
                  <div className="no-poster">No Image</div>
                )}
                <h3>{movie.Title}</h3>
              </div>
            ))}
          </Slider>
        </section>
      ) : (
        // Optionally display a message if no movies are found
        <p className="no-results">No movies found</p>
      )}
    </div>
  );
};

export default Search;
