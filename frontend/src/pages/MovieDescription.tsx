import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./MovieDescription.css";
import MovieCarousel from '../components/MovieCarousel'; 

// Define the interface for a movie
interface Movie {
  id: string;
  title: string;
  director: string;
  description: string;
  cast: string;
  releaseYear: string;
  rating: string;
  duration: string;
  categories: string[];
}

// Define the interface for related movies
interface RelatedMovie extends Movie {}

function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<RelatedMovie[]>([]);

  useEffect(() => {
    // Fetch movie details
    fetch(`https://localhost:5000/Movies/MovieDetails/${movieId}`)
      .then(response => response.json())
      .then(data => {
        setMovie(data);
      });

    // Fetch related movies - adjust the URL similarly if needed
    fetch(`https://localhost:5000/Movies/RelatedMovies/${movieId}`)
      .then(response => response.json())
      .then(data => {
        setRelatedMovies(data);
      });
  }, [movieId]);

  if (!movie) return <div>Loading...</div>;

  // Create a URL-friendly version of the movie title for the poster
  const posterUrl = `https://showposters.blob.core.windows.net/poster/Movie%20Posters/${encodeURIComponent(movie.title)}.jpg`;

  return (
    <div className="movie-detail-page">
      <div className="movie-info">
        <div className="movie-text">
          <h1>{movie.title}</h1>
          <p>{movie.description}</p>
          <p><strong>Rating:</strong> {movie.rating}</p>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Release Year:</strong> {movie.releaseYear}</p>
          <p><strong>Duration:</strong> {movie.duration}</p>
          <p><strong>Cast:</strong> {movie.cast}</p>
          <p><strong>Categories:</strong> {movie.categories.join(', ')}</p>
        </div>
        <div className="movie-poster">
          <img src={posterUrl} alt={`Poster for ${movie.title}`} />
        </div>
      </div>
      <div className="related-movies">
        <h2>Similar Movies</h2>
        <MovieCarousel movies={relatedMovies} genre={''} />
      </div>
    </div>
  );
}

export default MovieDetailPage;