import { use, useEffect, useState } from "react";
import {
  searchMovies,
  fetchPopularMovies,
  fetchMovieDetails,
} from "./api/tmdb";

import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [movieDetails, setMovieDetails] = useState<any | null>(null);

  useEffect(() => {
    const loadPopular = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPopularMovies();
        setMovies(data.results);
        console.log("popular movies : ", data);
      } catch (err) {
        setError("Failed to fetch popular movies");
        console.error("Error fetching popular movies:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPopular();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchMovies(query);
      setMovies(data.results);
    } catch (err) {
      setError("Failed to fetch movies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = async (movieId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const details = await fetchMovieDetails(movieId);
      setSelectedMovie(details);
    } catch (err) {
      setError("Failed to fetch movie details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Movie Search</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="border border-gray-300 rounded px-2 py-1 flex-grow"
          placeholder="Search for a movie..."
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white rounded px-4 py-1"
        >
          Search
        </button>
      </div>
      {isLoading && (
        <p className="text-center text-blue-500 mb-4">Loading...</p>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!isLoading && !error && movies.length === 0 && (
        <p className="text-center text-gray-500 mb-4">No movies found</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMovieClick(movie.id)}
            className="bg-white rounded shadow p-2 cursor-pointer hover:shadow-lg transition-shadow"
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto rounded"
              />
            ) : (
              <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded">
                No image
              </div>
            )}
            <h2 className="font-semibold text-sm mt-2">{movie.title}</h2>
            <p className="text-gray-500 text-xs">{movie.release_date}</p>
            <p className="text-xs text-yellow-600">* {movie.vote_average}</p>
          </div>
        ))}
      </div>
      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedMovie.title}</h2>
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {selectedMovie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    className="w-full md:w-1/3 h-auto rounded"
                  />
                )}

                <div className="flex-1">
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Release Date:</span>{" "}
                    {selectedMovie.release_date}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Rating:</span>{" "}
                    {selectedMovie.vote_average}/10
                  </p>
                  <p className="text-gray-700 mb-4">
                    <span className="font-semibold">Runtime:</span>{" "}
                    {selectedMovie.runtime} minutes
                  </p>
                  <p className="text-gray-700">{selectedMovie.overview}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
