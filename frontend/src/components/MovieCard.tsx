import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './MovieCard.css';

interface Movie {
  showId: string;
  title: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const imagePath = `https://showposters.blob.core.windows.net/poster/Movie%20Posters/${encodeURIComponent(movie.title)}.jpg`; // URL encode the title to avoid issues with special characters
  const fallbackImage =
    'https://cinenicheee-c0fqg8b9hscqe7bk.eastus-01.azurewebsites.net/default.jpg'; // Path for default image

  // Read the cookie value for kidsView
  const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  // Check if the 'kidsView' cookie is set to 'true'
  const isKidsView = getCookie('kidsView') === 'true';

  useEffect(() => {
    const checkImageExistence = async () => {
      try {
        const response = await fetch(imagePath, { method: 'HEAD' });
        if (response.ok) {
          setImageUrl(imagePath); // Image exists, use it
        } else {
          setImageUrl(fallbackImage); // If the image is not found, use fallback image
        }
      } catch (error) {
        // If there is any error (CORS, network issue, etc.), use the fallback image
        console.error('Error fetching image:', error);
        setImageUrl(fallbackImage);
      }
    };

    checkImageExistence();
  }, [imagePath]);

  // Use fallback image if 'kidsView' is true
  const displayImage = isKidsView ? fallbackImage : imageUrl;

  return (
    <Link
      to={`/detail/${movie.showId}`}
      className="movie-card"
      style={{ textDecoration: 'none' }}
    >
      {displayImage && (
        <div className="movie-card">
          <img src={displayImage} alt={movie.title} className="movie-image" />
          {displayImage === fallbackImage && (
            <p className="movie-card-text">{movie.title}</p>
          )}
          <h3 className="movie-title">{movie.title}</h3>
        </div>
      )}
    </Link>
  );
};

export default MovieCard;
