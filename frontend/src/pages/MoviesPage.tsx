import MovieCarousel from '../components/MovieCarousel'; // MovieCarousel now accepts a 'genre' prop for filtering/display purposes
import Header from '../components/Header';
import { useState } from 'react';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import './MoviesPage.css';  // Import the CSS file from the same folder

const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Romance"];

function MoviePage() {
  // State for optional sidebar/filter functionality (if needed)
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);

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
                <h3 className="mb-3">Recommended For You</h3>
                <MovieCarousel genre="Recommended" />
              </div>
              
              {/* Carousels for each genre */}
              {genres.map((genre) => (
                <div key={genre} className="mb-5">
                  <h3 className="mb-3">{genre}</h3>
                  <MovieCarousel genre={genre} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
}

export default MoviePage;
;