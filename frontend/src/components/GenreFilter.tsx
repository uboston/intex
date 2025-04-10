import { useEffect, useState } from 'react';
import { getAllGenres } from '../api/MoviesAPI';
import './GenreFilter.css';

function GenreFilter({
  selectedGenres,
  setSelectedGenres,
}: {
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
}) {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres', error);
      }
    };

    fetchGenres();
  }, []);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedGenres = selectedGenres.includes(target.value)
      ? selectedGenres.filter((x) => x !== target.value)
      : [...selectedGenres, target.value];

    setSelectedGenres(updatedGenres);
  }

  return (
    <div className="mt-3">
      <p className="text-white">Filter Movies by Genre</p>
      <div className="d-flex justify-content-center flex-wrap gap-1">
        {genres.map((g) => (
          <div key={g}>
            <input
              type="checkbox"
              id={g}
              value={g}
              checked={selectedGenres.includes(g)}
              style={{
                opacity: 0,
                position: 'absolute',
                pointerEvents: 'none',
              }}
              onChange={handleCheckboxChange}
            />

            <label className="genre-label" htmlFor={g}>
              {g}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GenreFilter;
