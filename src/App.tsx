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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadPopular = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPopularMovies(page);
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError("Failed to fetch popular movies");
      } finally {
        setIsLoading(false);
      }
    };
    loadPopular();
  }, [page]);

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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          🎬 Movie Search
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="bg-gray-800 border border-gray-700 rounded px-4 py-2 flex-grow text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Search for a movie..."
          />
          <button
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded px-6 py-2 transition"
          >
            Search
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
          </div>
        )}

        {error && <p className="text-orange-400 text-center mb-4">{error}</p>}

        {!isLoading && !error && movies.length === 0 && (
          <p className="text-center text-gray-400 mb-4">No movies found</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie.id)}
              className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-700 transition"
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-72 object-cover"
                />
              ) : (
                <div className="w-full h-72 bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-base text-white">
                  {movie.title}
                </h2>
                <p className="text-gray-400 text-xs">{movie.release_date}</p>
                <p className="text-xs text-orange-400 mt-1">
                  ★ {movie.vote_average}
                </p>
              </div>
            </div>
          ))}
        </div>

        {selectedMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold text-white">
                  {selectedMovie.title}
                </h2>
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="text-gray-400 hover:text-orange-400 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {selectedMovie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    className="w-full md:w-1/3 h-auto rounded-lg"
                  />
                )}
                <div className="flex-1 text-gray-300">
                  <p className="mb-2">
                    <span className="font-semibold text-white">
                      Release Date:
                    </span>{" "}
                    {selectedMovie.release_date}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold text-white">Rating:</span>{" "}
                    {selectedMovie.vote_average}/10
                  </p>
                  <p className="mb-4">
                    <span className="font-semibold text-white">Runtime:</span>{" "}
                    {selectedMovie.runtime} minutes
                  </p>
                  <p>{selectedMovie.overview}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded disabled:bg-gray-700 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span className="px-4 py-2 self-center text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded disabled:bg-gray-700 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
