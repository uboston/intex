import { useState } from "react";
import { FaStar } from "react-icons/fa";

type StarRatingProps = {
  totalStars?: number;
  onRatingChange?: (rating: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({ totalStars = 5, onRatingChange }) => {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);

  const handleClick = (index: number) => {
    setRating(index);
    if (onRatingChange) onRatingChange(index);
  };

  return (
    <div className="flex gap-1">
      {[...Array(totalStars)].map((_, i) => {
        const index = i + 1;
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none"
          >
            <FaStar
              size={24}
              color={index <= (hovered || rating) ? "#ffc107" : "#e4e5e9"}
              className="transition-colors duration-200"
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
