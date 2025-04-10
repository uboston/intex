import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './MovieDescription.css';
import MovieCarousel from '../components/MovieCarousel';
import Header from '../components/Header';
import StarRating from '../components/StarRating';
import { getCookieConsentValue } from 'react-cookie-consent';

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

interface RelatedMovie extends Movie {}

function MovieDescription() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<RelatedMovie[]>([]);

  useEffect(() => {
    const parseJSONResponse = async (response: Response) => {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    };

    fetch(
      `https://cinenicheee-c0fqg8b9hscqe7bk.eastus-01.azurewebsites.net/Movies/MovieDetails/${movieId}`,
      {
        method: 'get',
        credentials: 'include',
      }
    )
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

    fetch(
      `https://cinenicheee-c0fqg8b9hscqe7bk.eastus-01.azurewebsites.net/Movies/RelatedMovies/${movieId}`,
      {
        method: 'get',
        credentials: 'include',
      }
    )
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

  const posterUrl = `https://showposters.blob.core.windows.net/poster/Movie%20Posters/${encodeURIComponent(movie.title)}.jpg`;

  return (
    <div className="movie-detail-page">
      <div className="container mt-4">
        <div className="row mb-3">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <Header />
          </div>
        </div>
      </div>

      <div className="movie-info">
        <div className="movie-text">
          <h1>{movie.title}</h1>
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
          <img
            src={
              getCookieConsentValue('kidsView') === 'true'
                ? 'https://localhost:5000/default.jpg'
                : posterUrl
            }
            alt={`Poster for ${movie.title}`}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.src =
                'https://localhost:5000/default.jpg';
            }}
          />
        </div>
      </div>
      <div className="related-movies">
        <h2>Similar Movies</h2>
        <MovieCarousel genre={''} showId={movie.showId} />
      </div>
    </div>
  );
}

export default MovieDescription;
