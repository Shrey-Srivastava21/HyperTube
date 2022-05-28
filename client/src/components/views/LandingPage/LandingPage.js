import React, { useState, useEffect, useRef } from 'react'
import { Typography, Row, Col, Button, Divider } from 'antd';
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, CurrentLanguage } from '../../Config'
import MainImage from './Sections/MainImage'
import GridCard from '../../commons/GridCards'
import { useTranslation } from 'react-i18next';
import SearchBar from './Sections/SearchBar';
import Spinner from './Sections/Spinner';
import { Link } from 'react-router-dom';
import { createFromIconfontCN } from '@ant-design/icons';
import InputRange from "react-input-range";

//custom hook
import { useFetchMovies } from './Sections/hooks/useFetchMovies'

const { Title } = Typography;

const date = new Date();

const LandingPage = () => {

    const [
        { item: { Movies, CurrentPage, totalPages },
            loading,
            error,
            year,
            sort,
            rating,
            yearRange,
            genreID,
            selectEl,
            selectElPop
        },
        fetchMovies,
        makeItYear,
        makeItSort,
        onRatingSliderChange,
        onYearRangeSliderChange,
        handleGenre,
        clearFilters
    ] = useFetchMovies()
    const [searchTerm, setSearchTerm] = useState('');
    const [toggle, setToggle] = useState(false);
    const buttonRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, [])

    function convertDate(date) {
        const yyyy = date.getFullYear().toString();
        const mm = (date.getMonth() + 1).toString();
        const dd = date.getDate().toString();

        const mmChars = mm.split('');
        const ddChars = dd.split('');

        return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
    }

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

    //search movies function 
    const searchMovies = search => {
        const endpoint = search ? `${API_URL}search/movie?api_key=${API_KEY}&language=${CurrentLanguage}&query=` + search : `${API_URL}discover/movie?api_key=${API_KEY}&language=${CurrentLanguage}&vote_count.gte=2500&sort_by=${sort}&primary_release_year=${year}&primary_release_date.gte=${yearRange.min}-01-01&primary_release_date.lte=${yearRange.max === date.getFullYear() ? convertDate(date) : yearRange.max + '-12-31'}&with_genres=${genreID}`
        setSearchTerm(search)
        fetchMovies(endpoint)
    }

    //loadmoremovies function
    const loadMoreMovies = () => {
        const popularEndpoint = `${API_URL}discover/movie?api_key=${API_KEY}&language=${CurrentLanguage}&vote_count.gte=2500&sort_by=${sort}&primary_release_year=${year}&vote_average.gte=${rating.min}&vote_average.lte=${rating.max}&primary_release_date.gte=${yearRange.min}-01-01&primary_release_date.lte=${yearRange.max === date.getFullYear() ? convertDate(date) : yearRange.max + '-12-31'}&with_genres=${genreID}&page=${CurrentPage + 1}`;
        const searchEndpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=${CurrentLanguage}&query=${searchTerm}&page=${CurrentPage + 1}`
        const endpoint = searchTerm ? searchEndpoint : popularEndpoint
        fetchMovies(endpoint)
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

    const toggleFilterBar = () => {
        setToggle(!toggle)
    }
    const pickYear = new Date().getFullYear();

    const MovieIcon = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/font_1804216_tqdqw1tcevm.js',
    });

    if (error) return <div style={{ width: '100%', fontSize: '1.5rem', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>Woops! Something went very wrong...</div>
    return (
        <div style={{ width: '100%', margin: '0' }}>
            <MainImage landing
                image={"https://res.cloudinary.com/dkyqbngya/image/upload/v1586011642/czr9s0nxspurc9blgn9l.jpg"}
            />

            <SearchBar callback={searchMovies} />

            {/* Filters */}

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="primary" shape="round" onClick={toggleFilterBar} style={{ fontSize: '1rem' }}>{!toggle ? t('filters.showFilters') : t('filters.dontShowFilters')}</Button>
            </div>

            {toggle &&
                <div style={{ width: '85%', margin: '1rem auto', justifyContent: 'center' }}>
                    <br />
                    <Row gutter={[8, 8]}>
                        <Col span={12}>
                            <form style={{ textAlign: 'center' }}>
                                <label style={{ padding: "10px" }}><b>{t('filters.sortMovies')}:</b></label>
                                <select name="sortBy" onChange={makeItSort} ref={selectElPop}>
                                    <option value="popularity.desc">{t('filters.sortMovies')}</option>
                                    <option value="primary_release_date.desc">{t('filters.releaseYearHigh')}</option>
                                    <option value="primary_release_date.asc">{t('filters.releaseYearLow')}</option>
                                    <option value="original_title.asc">{t('filters.titleName')}</option>
                                    <option value="vote_average.desc">{t('filters.ratingHigh')}</option>
                                    <option value="vote_average.asc">{t('filters.ratingLow')}</option>
                                </select>
                            </form>
                        </Col>
                        <br />
                        <Col span={12}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={{ display: 'flex', justifyContent: 'center', paddingRight: '20px' }}><b>{t('filters.rating')}</b></p>
                                <InputRange
                                    className="input-range"
                                    maxValue={10}
                                    minValue={0}
                                    value={rating}
                                    onChange={value => onRatingSliderChange(value)}
                                    // onChange={rating => onRatingSliderChange(rating)}
                                />
                            </div>
                        </Col>
                        <br />
                    </Row>
                    <Row gutter={[8, 8]}>
                        <Col span={12}>
                            <form style={{ textAlign: 'center' }}>
                                <label style={{ padding: "10px" }}><b>{t('filters.sortYear')}:</b></label>
                                <select onChange={makeItYear} ref={selectEl}>
                                    <option value="">{t('filters.year')}</option>
                                    {Array.from(new Array(41), (value, i) =>
                                        <option key={i} value={pickYear - i}>{pickYear - i}</option>
                                    )}
                                </select>
                            </form>
                        </Col>
                        <Col span={12}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>

                                <p style={{ display: 'flex', justifyContent: 'center', paddingRight: '20px' }}><b>{t('filters.releaseYear')}</b></p>
                                <InputRange
                                    className="input-range"
                                    maxValue={2020}
                                    minValue={1980}
                                    value={yearRange}
                                    onChange={value => onYearRangeSliderChange(value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Divider>Genres</Divider>
                    <div style={{ textAlign: 'center' }}>
                        {genres.map(
                            genre =>
                                <Button
                                    key={genre.name}
                                    shape="round"
                                    size="small"
                                    onClick={handleGenre}
                                    value={genre.id}
                                    style={{ borderColor: "#19ba90", textAlign: "center", fontSize: "0.9em", margin: "1px" }}
                                >{genre.name}
                                </Button>
                        )}
                    </div>

                    <br />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {/* <Button><a href="/landing">{t('filters.clearFilters')}</a></Button> */}
                        <Button onClick={clearFilters}>{t('filters.clearFilters')}</Button>
                    </div>

                </div>
            }

            <div style={{ width: '85%', margin: '1rem auto' }}>


                <React.Fragment>
                    <Title level={2}><MovieIcon type="icon-movie3" style={{ fontSize: "35px", paddingRight: "10px" }} />{searchTerm ? t('landing.searchRes') : t('landing.latest')}</Title>
                    <hr />
                    <br />
                </React.Fragment>

                <Row gutter={[16, 16]}>
                    {Movies !== undefined && Movies[0] ? Movies && Movies.map((movie, index) => (
                        <React.Fragment key={movie.id}>
                            {movie && movie.poster_path && movie.release_date && movie.vote_count > 2300
                                && movie.imdb_id !== null && movie.backdrop_path !== null && movie.overview !== null && (
                                    <GridCard movie
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
                                    />
                                )
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

export default LandingPage