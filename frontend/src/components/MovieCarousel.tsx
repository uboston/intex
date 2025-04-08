import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import './MovieCarousel.css';

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
}

interface MovieCarouselProps {
  genre: string;
}

// Helper function to generate 10 dummy movies based on the given genre.
const generateMovies = (genre: string): Movie[] => {
  return Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: `${genre} Movie ${index + 1}`,
    imageUrl: `https://via.placeholder.com/200x300?text=${encodeURIComponent(
      genre
    )}+Movie+${index + 1}`,
  }));
};

const MovieCarousel: React.FC<MovieCarouselProps> = ({ genre }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const movies = generateMovies(genre);

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
