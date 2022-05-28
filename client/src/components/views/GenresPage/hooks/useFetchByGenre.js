import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { API_URL, API_KEY } from '../../../Config'

export const useFetchByGenre = (genreId) => {
    const [state, setState] = useState({ Movies: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const history = useHistory();

    const fetchMoviesByGenre = async endpoint => {
        setError(false);
        setLoading(true);
    
        const isLoadMore = endpoint.search('page');
    
        try {
          const result = await (await fetch(endpoint)).json();
          if (result.results.length === 0) {
            history.goBack();
          }
          const randomIndex = Math.floor(Math.random() * 20)
          setState(prev => ({
            ...prev,
            Movies:
              isLoadMore !== -1
                ? [...prev.Movies, ...result.results]
                : [...result.results],
                MainMovieImage : prev.MainMovieImage || result.results[randomIndex],
                CurrentPage: result.page,
                totalPages: result.total_pages,
          }));
  
        } catch (error) {
          setError(true);
          console.error(error);
        }
        setLoading(false);
      };

    useEffect(() => {
      const CurrentLanguage = localStorage.getItem('language');
      fetchMoviesByGenre(`${API_URL}discover/movie?api_key=${API_KEY}&language=${CurrentLanguage}&with_genres=${genreId}`)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [genreId]);

    return [{ state, loading, error }, fetchMoviesByGenre]
  }