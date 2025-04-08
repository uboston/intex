//import MovieCarousel from '../components/MovieCarousel'; // Assumes Carousel.tsx exports MovieCarousel
import Header from '../components/Header';
import { useState } from 'react';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
function MoviePage() {
  // If you need state for filtering or other sidebar functionality, you can keep it.
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);
  return (
    <AuthorizeView>
      <div className="container mt-4">
        {/* Header and Logout Section */}
        <div className="row mb-3">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <Header />
            <Logout>
              Logout <AuthorizedUser value="email" />
            </Logout>
          </div>
        </div>
        {/* Content Section */}
        <div className="row">
          {/* Optional Sidebar (e.g., for filtering) */}
          <div className="col-md-3">
            {/* If you have a ContainerFilter component or similar, you can include it here:
            <ContainerFilter
              selectedContainers={selectedContainers}
              setSelectedContainers={setSelectedContainers}
            /> */}
          </div>
          {/* Movie Carousel Component */}
          <div className="col-md-9">
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
}
export default MoviePage;









