import MovieCarousel from '../components/MovieCarousel';
import Header from '../components/Header';
import Footer from '../components/Footer'; // Import the Footer component
import { useEffect, useState } from 'react';
import AuthorizeView from '../components/AuthorizeView';
import './MoviesPage.css';
import { getGenres, randomGenres } from '../api/MoviesAPI';

function MoviePage() {
  const [genres, setGenres] = useState<string[]>([]); // Displayed genres
  const [allGenres, setAllGenres] = useState<string[]>([]); // All genres including previously loaded ones
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMoreGenres, setHasMoreGenres] = useState<boolean>(true);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        const data = await getGenres(); // Fetch top genres (only 5)
        setGenres(data); // Set the first 5 genres
        setAllGenres(data); // Add them to the allGenres list
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  useEffect(() => {
    const handleScroll = async () => {
      const bottom =
        Math.ceil(window.innerHeight + document.documentElement.scrollTop) ===
        document.documentElement.offsetHeight;
      if (bottom && !loadingMore && hasMoreGenres) {
        setLoadingMore(true);
        try {
          // Fetch more genres, passing the already loaded ones
          const moreGenres = await randomGenres(allGenres);

          // If we received new genres, update the lists
          if (moreGenres.length > 0) {
            setGenres((prev) => [...prev, ...moreGenres]); // Add new genres to the display list
            setAllGenres((prev) => [...prev, ...moreGenres]); // Add them to the full list
          } else {
            setHasMoreGenres(false); // No more genres to load
          }
        } catch (error) {
          console.error('Error loading more genres:', error);
        } finally {
          setLoadingMore(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Clean up event listener on unmount
  }, [loadingMore, hasMoreGenres, allGenres]);

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

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

          {/* Main Content Section */}
          <div className="row">
            <div className="col-12">
              {/* Top Carousel for Recommended Movies */}
              <div className="mb-5">
                <MovieCarousel genre="Recommended" />
              </div>

              {/* Carousels for each genre */}
              {genres.map((genre) => (
                <div key={genre} className="mb-5">
                  <MovieCarousel genre={genre} />
                </div>
              ))}

              {/* Loading more genres indicator */}
              <p>Loading more...</p>
            </div>
          </div>
        </div>
        {/* Add Footer here */}
        <Footer />
      </div>
    </AuthorizeView>
  );
}

export default MoviePage;
