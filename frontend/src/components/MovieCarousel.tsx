import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import './MovieCarousel.css';

interface Movie {
  id: string;
  title: string;
}

// Dummy data for 10 movies. Replace the IDs and titles as needed.
const movies: Movie[] = [
  { id: '1', title: 'Movie 1' },
  { id: '2', title: 'Movie 2' },
  { id: '3', title: 'Movie 3' },
  { id: '4', title: 'Movie 4' },
  { id: '5', title: 'Movie 5' },
  { id: '6', title: 'Movie 6' },
  { id: '7', title: 'Movie 7' },
  { id: '8', title: 'Movie 8' },
  { id: '9', title: 'Movie 9' },
  { id: '10', title: 'Movie 10' },
];

const MovieCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="carousel-container">
      <button onClick={scrollLeft} className="carousel-arrow left">
        {'<'}
      </button>
      <div className="carousel" ref={carouselRef}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <button onClick={scrollRight} className="carousel-arrow right">
        {'>'}
      </button>
    </div>
  );
};

export default MovieCarousel;
