// import EditReview from "../components/EditReview";
import MovieDetails from "../components/MovieDetails";

function MovieDetailsAuthed() {
  const token = localStorage.getItem("authToken");
  return (
    <>
      <MovieDetails authToken={token} />
      {/* <EditReview /> */}
    </>
  );
}

export default MovieDetailsAuthed;
