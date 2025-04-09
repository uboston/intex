import { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import './MovieCarousel.css';
import { getMoviesFromGenre, getRecommendedMovies } from '../api/MoviesAPI';

interface Movie {
  showId: string;
  title: string;
}

interface MovieCarouselProps {
  genre: string;
  movies?: Movie[]; // Optional movies array to be used instead of generated ones
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ genre, movies }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [carouselHeader, setCarouselHeader] = useState<string>(genre);

  if (genre === 'Recommended') {
    useEffect(() => {
      const loadRecommendedMovies = async () => {
        const data = await getRecommendedMovies();
        console.log(data);
        setMovieList(data.moviesList);
        setCarouselHeader(data.recommendType);
      };
      loadRecommendedMovies();
    }, []);
  } else {
    useEffect(() => {
      const loadMovies = async (genre: string) => {
        const data = await getMoviesFromGenre(genre);
        console.log(data);
        setMovieList(data);
      };
      loadMovies(genre);
    }, []);
  }

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
          {'<'}
        </button>
        <div className="carousel" ref={carouselRef}>
          {movieList.map((movie) => (
            <MovieCard key={movie.showId} movie={movie} />
          ))}
        </div>
        <button onClick={scrollRight} className="carousel-arrow right">
          {'>'}
        </button>
      </div>
    </>
  );
};

export default MovieCarousel;
