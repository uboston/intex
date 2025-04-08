import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import './MovieCarousel.css';

interface Movie {
  id: string;
  title: string;
  imageUrl?: string;  // Assuming imageUrl might be part of Movie, adjust as necessary
}

interface MovieCarouselProps {
  genre: string;
  movies?: Movie[]; // Optional movies array to be used instead of generated ones
}

// Helper function to generate 10 dummy movies based on the given genre.
const generateMovies = (genre: string): Movie[] => {
  return Array.from({ length: 10 }, (_, index) => ({
    id: `${genre}-${index + 1}`, // Ensure unique IDs in case of similar genre names
    title: `${genre} Movie ${index + 1}`,
    imageUrl: `https://via.placeholder.com/200x300?text=${encodeURIComponent(
      genre
    )}+Movie+${index + 1}`,
  }));
};

const MovieCarousel: React.FC<MovieCarouselProps> = ({ genre, movies }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const movieList = movies || generateMovies(genre); // Use provided movies if available, else generate based on genre

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
        {movieList.map((movie) => (
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
