import { useEffect, useState } from 'react';
import MovieCarousel from '../components/MovieCarousel';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthorizeView from '../components/AuthorizeView';
import { getGenres, randomGenres } from '../api/MoviesAPI';
import './MoviesPage.css';

function MoviePage() {
  const [genres, setGenres] = useState<string[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreGenres, setHasMoreGenres] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    const loadInitialGenres = async () => {
      try {
        const initial = await getGenres(); // 5 base genres
        setGenres(initial);
        setAllGenres(initial);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadInitialGenres();
  }, []);

  // Infinite scroll: only triggers at page bottom
  useEffect(() => {
    const onScroll = async () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

      if (nearBottom && !loadingMore && hasMoreGenres) {
        setLoadingMore(true);
        try {
          const more = await randomGenres(allGenres);
          if (more.length > 0) {
            setGenres((prev) => [...prev, ...more]);
            setAllGenres((prev) => [...prev, ...more]);
          } else {
            setHasMoreGenres(false);
          }
        } catch (err) {
          console.error('Genre fetch error:', err);
        } finally {
          setLoadingMore(false);
        }
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loadingMore, hasMoreGenres, allGenres]);

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <AuthorizeView>
      <div className="movies-page">
        <Header />

        {/* Main Content */}
        <div className="row">
          <div className="col-12">
            <div className="mb-5">
              <MovieCarousel genre="Recommended" />
            </div>

            {genres.map((genre) => (
              <div key={genre} className="mb-5">
                <MovieCarousel genre={genre} />
              </div>
            ))}

            {loadingMore && (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </AuthorizeView>
  );
}

export default MoviePage;
