import React, { useState, useEffect, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import AuthorizeView from '../components/AuthorizeView';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import GenreFilter from '../components/GenreFilter';

interface Movie {
  showId: string;
  title: string;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Debounced function
  const fetchMovies = useCallback(
    debounce(async (query: string, selectedGenres: string[]) => {
      if (!query) {
        setMovies([]);
        return;
      }

      try {
        const genreParams = selectedGenres
          .map((genre) => `genres=${encodeURIComponent(genre)}`)
          .join('&');

        const res = await fetch(
          `https://cinenicheee-c0fqg8b9hscqe7bk.eastus-01.azurewebsites.net/Movies/SearchMovies?searchTerm=${encodeURIComponent(query)}&${genreParams}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        const data = await res.json();
        const mapped = data.map((item: any) => ({
          showId: item.showId,
          title: item.title,
        }));
        setMovies(mapped);
        console.log(movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    }, 400),
    []
  );

  useEffect(() => {
    fetchMovies(searchTerm, selectedGenres);
  }, [searchTerm, fetchMovies, selectedGenres]);

  return (
    <AuthorizeView>
      <div className="movies-page">
        <div className="container mt-4">
          {/* Header and Logout Section */}
          <div className="row mb-3">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <Header />
            </div>
          </div>
          <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Search Movies</h1>
            <div className="d-flex justify-content-center gap-2">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 mb-6"
              />
              <Link to="/movies" className="btn btn-secondary">
                Back
              </Link>
            </div>
            <GenreFilter
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
            />
            <div className="grid gap-4 d-flex justify-content-center flex-wrap mt-3">
              {movies.map((movie) => (
                <MovieCard key={movie.showId} movie={movie} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
};

function debounce<Func extends (...args: any[]) => void>(
  fn: Func,
  delay: number
): (...args: Parameters<Func>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<Func>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default Search;
