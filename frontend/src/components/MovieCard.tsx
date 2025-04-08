import React from 'react';
import './MovieCard.css';

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="movie-card">
      <img src={movie.imageUrl} alt={movie.title} className="movie-image" />
      <h3 className="movie-title">{movie.title}</h3>
    </div>
  );
};

export default MovieCard;
