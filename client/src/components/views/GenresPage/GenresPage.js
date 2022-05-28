import React, { useState, useRef, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { Typography, Row, Button } from 'antd';
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, IMAGE_SIZE, CurrentLanguage } from '../../Config'
import { useTranslation } from 'react-i18next';
import MainImage from '../../views/LandingPage/Sections/MainImage'
import GridCard from '../../commons/GridCards';
import SearchBar from '../LandingPage/Sections/SearchBar';
import Spinner from '../LandingPage/Sections/Spinner';
import { Link } from 'react-router-dom';
import { createFromIconfontCN } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
// Hooks
import { useFetchByGenre } from './hooks/useFetchByGenre';

const { Title } = Typography;

const GenresPage = () => {
    let { genreId, genreName, movieId } = useParams();
    const [{ state: { Movies, MainMovieImage, CurrentPage, totalPages },
        loading,
        error },
        fetchMoviesByGenre
    ] = useFetchByGenre(genreId);
    const history = useHistory();

    const handleClick = () => {
        history.push(`/movie/${movieId}`);
    }

    const [searchTerm, setSearchTerm] = useState('');
    const buttonRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, [])

    const genres = [
        { id: 28, name: t('genre.Action') },
        { id: 12, name: t('genre.Adventure') },
        { id: 16, name: t('genre.Animation') },
        { id: 35, name: t('genre.Comedy') },
        { id: 80, name: t('genre.Crime') },
        { id: 99, name: t('genre.Documentary') },
        { id: 18, name: t('genre.Drama') },
        { id: 10751, name: t('genre.Family') },
        { id: 14, name: t('genre.Fantasy') },
        { id: 36, name: t('genre.History') },
        { id: 27, name: t('genre.Horror') },
        { id: 10402, name: t('genre.Music') },
        { id: 9648, name: t('genre.Mystery') },
        { id: 10749, name: t('genre.Romance') },
        { id: 878, name: t('genre.Sci-Fi') },
        { id: 10770, name: t('genre.TV-Movie') },
        { id: 53, name: t('genre.Thriller') },
        { id: 10752, name: t('genre.War') },
        { id: 37, name: t('genre.Western') },
    ];

    const searchMovies = search => {
        // const endpoint = search ? `${API_URL}search/movie?api_key=${API_KEY}&language=${CurrentLanguage}&with_genres=${genreId}&query=` + search : `${API_URL}discover/movie?api_key=${API_KEY}&language=${CurrentLanguage}&with_genres=${genreId}`
        const endpoint = search ? `${API_URL}search/movie?api_key=${API_KEY}&with_genres=${genreId}&query=` + search : `${API_URL}discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
        setSearchTerm(search)
        fetchMoviesByGenre(endpoint)
    }

    const loadMoreMovies = () => {
        const genresEndpoint = `${API_URL}discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${CurrentPage + 1}`;
        const searchEndpoint = `${API_URL}search/movie?api_key=${API_KEY}&with_genres=${genreId}&query=${searchTerm}&page=${CurrentPage + 1}`
        const endpoint = searchTerm ? searchEndpoint : genresEndpoint
        fetchMoviesByGenre(endpoint);
    }

    const handleScroll = e => {
        const windowHeight =
            'innerHeight' in window
                ? window.innerHeight
                : document.documentElement.offsetHeight;

        const body = document.body;
        const html = document.documentElement;

        const docHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
        );

        const windowBottom = windowHeight + window.pageYOffset;

        if (windowBottom >= docHeight - 1) {
            buttonRef.current && buttonRef.current.click();
        }
    };

    const MovieIcon = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/font_1804216_tqdqw1tcevm.js',
    });

    if (error) return <div>Something went wrong...</div>;
    return (
        <div style={{ width: '100%', margin: '0' }}>
            {!loading ? MainMovieImage !== null &&
                <MainImage genre
                    image={MainMovieImage.backdrop_path ? `${IMAGE_BASE_URL}${IMAGE_SIZE}${MainMovieImage.backdrop_path}` : "https://res.cloudinary.com/dkyqbngya/image/upload/v1586787757/detykqycj7ejezsjmxln.png"}
                    genreName={genreName}
                />
                :
                <div><Spinner /></div>
            }

                <SearchBar callback={searchMovies} />

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="primary" shape="round" style={{ fontSize: '1rem' }}><a href="/landing">{t('genre.landing')}</a></Button>
            </div>

            <div style={{ width: '85%', margin: '1rem auto' }}>

                {!loading ?
                    <React.Fragment>
                        <Title level={2}><MovieIcon type="icon-movie3" style={{ fontSize: "35px", paddingRight: "10px" }} />{searchTerm ? t('landing.searchRes') : genreName}</Title>
                        <hr />
                        <br />
                    </React.Fragment>
                    :
                    null}

                <Row gutter={[16, 16]}>
                    {Movies[0] ? Movies && Movies.map((movie, index) => (
                        <React.Fragment key={movie.id}>
                            {movie && movie.poster_path && movie.release_date && movie.vote_count > 2300
                                && movie.imdb_id !== null && movie.backdrop_path !== null && movie.overview !== null && (
                                    <GridCard movie
                                        onClick={handleClick}
                                        image={movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : t('landing.notAvail')}
                                        movieId={movie.id}
                                        movieName={movie.title}
                                        date={movie.release_date}
                                        vote={movie.vote_average ? movie.vote_average : 'N/A'}
                                        movieGenre={movie.genre_ids &&
                                            movie.genre_ids.length &&
                                            movie.genre_ids.map(genreID => (
                                                <span key={genreID}>
                                                    {genres.map(
                                                        genre =>
                                                            genreID === genre.id && (
                                                                <Link key={genre.name} to={`/landing/genre/${genre.name}/${genre.id}`}>
                                                                    <Button
                                                                        key={genre.name}
                                                                        shape="round"
                                                                        size="small"
                                                                        style={{ borderColor: "#19ba90", textAlign: "center", fontSize: "0.9em", margin: "1px" }}
                                                                    >{genre.name}
                                                                    </Button>
                                                                </Link>
                                                            )
                                                    )}
                                                </span>
                                            )).slice(0, 3)}
                                    />)
                            }
                        </React.Fragment>
                    )) : !Movies[0] && !loading && <div style={{ width: '100%', fontSize: '1.5rem', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>{t("landing.noresults")}</div>}
                </Row>

                {loading && <Spinner />}
                {CurrentPage < totalPages && !loading && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div ref={buttonRef} className="loadMore" onClick={loadMoreMovies}>{t('landing.loadmore')}</div>
                    </div>
                )}



            </div>
        </div>
    )
}

export default GenresPage;