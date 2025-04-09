import React, { useState, useEffect, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import AuthorizeView from '../components/AuthorizeView';
import Header from '../components/Header';

interface Movie {
  id: string;
  title: string;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);

  // Debounced function
  const fetchMovies = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setMovies([]);
        return;
      }

      try {
        const res = await fetch(
          `https://localhost:5000/Movies/SearchMovies?searchTerm=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        const mapped = data.map((item: any) => ({
          id: item.showId,
          title: item.title,
        }));
        setMovies(mapped);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    }, 400),
    []
  );

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm, fetchMovies]);

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
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-6"
            />
            <div className="grid gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
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
