// src/pages/Search.tsx
import React, { useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import './Search.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Movie {
  ShowId: string;
  Title: string;
  Poster?: string;
  // add more movie fields if needed
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);

  // Triggered when the search form is submitted.
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Replace the URL below with the actual endpoint your backend provides.
      const response = await axios.get(
        `https://localhost:5000/Movies/Search?title=${encodeURIComponent(searchQuery)}`
      );
      // Assume the endpoint returns an object with a Movies property (an array of movies)
      setMovies(response.data.Movies);
    } catch (error) {
      console.error('Error searching for movies:', error);
    }
  };

  // Slider settings – you can tweak these settings as needed.
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // for wider screens; adjust based on design
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
          />
          <button type="submit">Search</button>
        </form>
      </header>

      {movies.length > 0 && (
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
      )}
    </div>
  );
};

export default Search;
