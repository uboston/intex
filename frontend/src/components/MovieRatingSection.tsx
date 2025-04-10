import React, { useState } from 'react';
import StarRating from './StarRating'; // adjust path as needed

type MovieRatingSectionProps = {
  showId: string;
  userId: number;
};

const MovieRatingSection: React.FC<MovieRatingSectionProps> = ({
  showId,
  userId,
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      alert('Please select a rating before submitting.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://cinenicheee-c0fqg8b9hscqe7bk.eastus-01.azurewebsites.net/Movies/RateMovie',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            showId,
            userId,
            rating: selectedRating,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      alert('Rating submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Error submitting your rating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-3 mt-4">
      <StarRating
        showId={showId}
        onRatingChange={setSelectedRating}
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Rating'}
      </button>
    </div>
  );
};

export default MovieRatingSection;
