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
  showId?: string; // Optional movies array to be used instead of generated ones
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ genre, showId }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [carouselHeader, setCarouselHeader] = useState<string>(genre);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        if (genre === 'Recommended') {
          const data = await getRecommendedMovies();
          console.log(data);
          setMovieList(data.moviesList);
          setCarouselHeader(data.recommendType);
        } else if (genre === '') {
          const data = await getContentRecommended(showId || 's1');
          console.log(data);
          setMovieList(data);
        } else {
          const data = await getMoviesFromGenre(genre);
          console.log(data);
          setMovieList(data);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [genre, showId]); // Only re-run when genre or showId changes

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
    <>
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
    </>
  );
};

export default MovieCarousel;
