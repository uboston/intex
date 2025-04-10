import { useState, useEffect, CSSProperties } from 'react';
import { FaStar } from 'react-icons/fa';
import { readStarRating, updateStarRating } from '../api/MoviesAPI';
import { getCookieConsentValue } from 'react-cookie-consent';

type StarRatingProps = {
  showId: string;
  totalStars?: number;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({
  showId,
  totalStars = 5,
  initialRating = 0,
  onRatingChange,
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hovered, setHovered] = useState<number>(0);

  // Load existing rating on page load
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const fetchedRating = await readStarRating(showId);
        if (
          fetchedRating !== null &&
          fetchedRating >= 1 &&
          fetchedRating <= 5
        ) {
          setRating(fetchedRating);
          if (onRatingChange) {
            onRatingChange(fetchedRating);
          }
        }
      } catch (error) {
        console.error('Failed to fetch initial rating:', error);
      }
    };

    fetchRating();
  }, [showId]);

  useEffect(() => {
    setRating(initialRating); // Reset local state
    setHovered(0); // Reset hover
  }, [showId, initialRating]);

  const handleClick = async (index: number) => {
    const consent = getCookieConsentValue('siteConsent');

    if (consent === 'true') {
      setRating(index);

      if (onRatingChange) {
        onRatingChange(index); // Notify parent if needed
      }

      try {
        await updateStarRating(showId, index); // Save rating to backend
      } catch (error) {
        console.error('Error updating rating:', error);
      }
    } else {
      alert('You must have cookies enabled to rate movies.');
    }
  };

  const starButtonStyle: CSSProperties = {
    background: 'transparent',
    border: 'none',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    gap: '8px',
  };

  return (
    <div style={containerStyle}>
      {[...Array(totalStars)].map((_, i) => {
        const index = i + 1;
        const isActive = index <= (hovered || rating);

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(0)}
            style={starButtonStyle}
          >
            <FaStar
              size={40}
              style={{
                fill: isActive ? '#ffc107' : 'none',
                stroke: isActive ? '#ffc107' : '#ffffff',
                strokeWidth: 12,
                transition: 'fill 0.2s, stroke 0.2s',
              }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
