import StarRating from '../components/StarRating';

function MovieDetailPage() {
  return (
    <StarRating
      onRatingChange={(rating) => console.log('User selected:', rating)}
    />
  );
}

export default MovieDetailPage;
