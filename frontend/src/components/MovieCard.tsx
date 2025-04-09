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
  const fallbackImage = 'https://localhost:5000/default.jpg'; // Path for default image

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

  return (
    <Link to={`/detail/${movie.showId}`} className="movie-card"

      style={{ textDecoration: 'none' }}
    >
      <img
        src={imageUrl || fallbackImage}
        alt={movie.title}
        className="movie-image"
      />
      <h3 className="movie-title">{movie.title}</h3>
    </Link>
  );
};

export default MovieCard;
