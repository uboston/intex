import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { updateStarRating } from "../api/MoviesAPI"; // Assuming the function is in this file

type StarRatingProps = {
  showId: string; // Pass in showId to identify the item being rated
  totalStars?: number;
  initialRating?: number; // Optionally pass an initial rating
};

const StarRating: React.FC<StarRatingProps> = ({ showId, totalStars = 5, initialRating = 0 }) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hovered, setHovered] = useState<number>(0);

  const handleClick = async (index: number) => {
    setRating(index);
    try {
      // Call the function to send the updated rating to the backend
      await updateStarRating(showId, index);
    } catch (error) {
      console.error("Error updating rating:", error);
    }
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
