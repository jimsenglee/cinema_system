import { useState, useEffect, useCallback } from 'react';
import { movies, type Movie } from '@/data/mockData';

interface UseMoviesResult {
  movies: Movie[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  filterByGenre: (genre: string) => Movie[];
  filterByStatus: (status: 'coming_soon' | 'now_showing' | 'ended') => Movie[];
  searchMovies: (query: string) => Movie[];
  getMovieById: (id: string) => Movie | undefined;
}

/**
 * Custom hook for movie data operations
 * Centralizes all movie-related logic following DRY principles
 */
export function useMovies(): UseMoviesResult {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMovieList(movies);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const filterByGenre = useCallback((genre: string): Movie[] => {
    return movieList.filter(movie => 
      movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  }, [movieList]);

  const filterByStatus = useCallback((status: 'coming_soon' | 'now_showing' | 'ended'): Movie[] => {
    return movieList.filter(movie => movie.status === status);
  }, [movieList]);

  const searchMovies = useCallback((query: string): Movie[] => {
    const lowerQuery = query.toLowerCase();
    return movieList.filter(movie =>
      movie.title.toLowerCase().includes(lowerQuery) ||
      movie.director.toLowerCase().includes(lowerQuery) ||
      movie.cast.some(actor => actor.toLowerCase().includes(lowerQuery)) ||
      movie.genre.some(g => g.toLowerCase().includes(lowerQuery))
    );
  }, [movieList]);

  const getMovieById = useCallback((id: string): Movie | undefined => {
    return movieList.find(movie => movie.id === id);
  }, [movieList]);

  return {
    movies: movieList,
    isLoading,
    error,
    refetch: fetchMovies,
    filterByGenre,
    filterByStatus,
    searchMovies,
    getMovieById
  };
}
