import React, { useState, useEffect } from 'react';
import './MovieCard.css';

interface Movie {
  id: string;
  title: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const imageName = movie.title;
  const imagePath = `https://localhost:5000/posters/${imageName}.jpg`; // Path for movie images
  const fallbackImage = 'https://localhost:5000/default.jpg'; // Path for default image

  useEffect(() => {
    const checkImageExistence = async () => {
      try {
        const response = await fetch(imagePath, { method: 'HEAD' });
        if (response.ok) {
          setImageUrl(imagePath); // Image exists
        } else {
          setImageUrl(fallbackImage); // Fallback if the image doesn't exist
        }
      } catch {
        setImageUrl(fallbackImage); // In case of an error
      }
    };

    checkImageExistence();
  }, [imagePath]);

  return (
    <div className="movie-card">
      <img
        src={imageUrl || fallbackImage}
        alt={movie.title}
        className="movie-image"
      />
      <h3 className="movie-title">{movie.title}</h3>
    </div>
  );
};

export default MovieCard;
