import { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import './MovieCarousel.css';
import {
  getContentRecommended,
  getMoviesFromGenre,
  getRecommendedMovies,
} from '../api/MoviesAPI';

interface Movie {
  showId: string;
  title: string;
}

interface MovieCarouselProps {
  genre: string;
  showId?: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ genre, showId }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [carouselHeader, setCarouselHeader] = useState<string>(genre);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        if (genre === 'Recommended') {
          const data = await getRecommendedMovies();
          setMovieList(data.moviesList);
          setCarouselHeader(data.recommendType);
        } else if (genre === '') {
          const data = await getContentRecommended(showId || 's1');
          setMovieList(data);
        } else {
          const data = await getMoviesFromGenre(genre);
          setMovieList(data);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [genre, showId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const centerY = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(centerY - viewportHeight / 2);

      const maxDistance = viewportHeight / 2;
      const clamped = Math.min(distanceFromCenter / maxDistance, 1);

      const scaleValue = 0.92 + (1 - clamped) * 0.08; // scales from 0.92 → 1
      setScale(scaleValue);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div
      ref={containerRef}
      className={`carousel-animated-container ${isVisible ? 'animate-in' : ''}`}
      style={{ transform: `scale(${scale})`, transition: 'transform 0.2s ease-out' }}
    >
      <h3 className="mb-3">{carouselHeader}</h3>
      <div className="carousel-container">
        <button onClick={scrollLeft} className="carousel-arrow left">
          <i className="fa-solid fa-angle-left"></i>
        </button>
        <div className="carousel" ref={carouselRef}>
          {movieList.map((movie) => (
            <MovieCard key={movie.showId} movie={movie} />
          ))}
        </div>
        <button onClick={scrollRight} className="carousel-arrow right">
          <i className="fa-solid fa-angle-right"></i>
        </button>
      </div>
    </div>
  );
};

export default MovieCarousel;
