import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./MovieDescription.css";
import MovieCarousel from '../components/MovieCarousel'; 

// Define the interface for a movie
interface Movie {
  id: string;
  title: string;
  director: string;
  year: string;
  description: string;
  poster: string;
}

// Define the interface for related movies
// Assuming it's the same structure as Movie; adjust if different
interface RelatedMovie extends Movie {}

function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>(); // Specify type for useParams
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<RelatedMovie[]>([]);

  useEffect(() => {
    // Fetch movie details
    fetch(`https://api.example.com/movies/${movieId}`)
      .then(response => response.json())
      .then(data => {
        setMovie(data);
      });

    // Fetch related movies
    fetch(`https://api.example.com/movies/${movieId}/related`)
      .then(response => response.json())
      .then(data => {
        setRelatedMovies(data);
      });
  }, [movieId]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-detail-page">
      <div className="movie-info">
        <div className="movie-text">
          <h1>{movie.title}</h1>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Year Released:</strong> {movie.year}</p>
          <p>{movie.description}</p>
        </div>
        <div className="movie-poster">
          <img src={movie.poster} alt={movie.title} />
        </div>
      </div>
      <div className="related-movies">
        <h2>Similar Movies</h2>
        <MovieCarousel genre="Similar Movies" movies={relatedMovies} />
      </div>
    </div>
  );
}

export default MovieDetailPage;
