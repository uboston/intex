import { useState, CSSProperties } from "react";
import { FaStar } from "react-icons/fa";

type StarRatingProps = {
  totalStars?: number;
  onRatingChange?: (rating: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({
  totalStars = 5,
  onRatingChange,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);

  const handleClick = (index: number) => {
    setRating(index);
    if (onRatingChange) onRatingChange(index);
  };

  // Remove button styles so only the star icon is visible
  const starButtonStyle: CSSProperties = {
    background: "transparent",
    border: "none",
    padding: 0,
    margin: 0,
    cursor: "pointer",
  };

  // Container for star spacing
  const containerStyle: CSSProperties = {
    display: "flex",
    gap: "8px",
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
              size={40} // Slightly larger for visibility; adjust as needed
              style={{
                // If active, fill and outline gold; otherwise, clear fill & white outline
                fill: isActive ? "#ffc107" : "none",
                stroke: isActive ? "#ffc107" : "#ffffff",
                strokeWidth: 12, // Thicker outline
                transition: "fill 0.2s, stroke 0.2s",
              }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
