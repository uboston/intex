import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './MovieDescription.css';
import MovieCarousel from '../components/MovieCarousel';
import Header from '../components/Header'; // Import Header component
import StarRating from '../components/StarRating'; // Import StarRating component

// Define the interface for a movie
interface Movie {
  showId: string;
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

function MovieDescription() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<RelatedMovie[]>([]);

  useEffect(() => {
    // Helper function to safely parse JSON from a response
    const parseJSONResponse = async (response: Response) => {
      // Read the text from the response
      const text = await response.text();
      // If there's no content, return an empty object; otherwise, parse it
      return text ? JSON.parse(text) : {};
    };

    // Fetch movie details
    fetch(`https://localhost:5000/Movies/MovieDetails/${movieId}`, {
      method: 'get',
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return parseJSONResponse(response);
      })
      .then((data) => {
        setMovie(data);
      })
      .catch((error) => {
        console.error('Failed to fetch movie details:', error);
      });

    // Fetch related movies
    fetch(`https://localhost:5000/Movies/RelatedMovies/${movieId}`, {
      method: 'get',
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return parseJSONResponse(response);
      })
      .then((data) => {
        setRelatedMovies(data);
      })
      .catch((error) => {
        console.error('Failed to fetch related movies:', error);
      });
  }, [movieId]);

  if (!movie) return <div>Loading...</div>;

  // Create a URL-friendly version of the movie title for the poster
  const posterUrl = `https://showposters.blob.core.windows.net/poster/Movie%20Posters/${encodeURIComponent(movie.title)}.jpg`;

  return (
    <div>
      <Header />
      <div className="movie-detail-page">
        <div className="movie-info">
          <div className="movie-text">
            <h1>{movie.title}</h1>
            {/* Star rating appears just underneath the title */}
            <p>{movie.description}</p>
            <p>
              <strong>Rating:</strong> {movie.rating || 'NA'}
            </p>
            <p>
              <strong>Director:</strong> {movie.director || 'NA'}
            </p>
            <p>
              <strong>Release Year:</strong> {movie.releaseYear || 'NA'}
            </p>
            <p>
              <strong>Duration:</strong> {movie.duration || 'NA'}
            </p>
            <p>
              <strong>Cast:</strong> {movie.cast || 'NA'}
            </p>
            <div className="d-flex gap-2">
              <div className="btn btn-light">Watch</div>
              <Link to="/movies" className="btn btn-secondary">
                Back
              </Link>
            </div>
            <p>
              <strong>Your Rating:</strong>
            </p>
            <StarRating showId={movieId || ''} />
          </div>
          <div className="movie-poster">
            <img src={posterUrl} alt={`Poster for ${movie.title}`} />
          </div>
        </div>
        <div className="related-movies">
          <h2>Similar Movies</h2>
          <MovieCarousel genre={''} showId={movie.showId} />
        </div>
      </div>
    </div>
  );
}

export default MovieDescription;
