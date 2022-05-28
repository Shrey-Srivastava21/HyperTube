import React, { useEffect, useState } from 'react'
import { message, Typography } from 'antd';
import { Row } from 'antd';
import useStyles from './style';
import axios from 'axios';
import Comments from './Sections/Comments'
import LikeDislikes from './Sections/LikeDislikes';
import { API_URL, API_KEY } from '../../Config'
import GridCards from '../../commons/GridCards';
import MovieInfo from './Sections/MovieInfo';
import Spinner from '../LandingPage/Sections/Spinner';
import RecommendedMovies from './Sections/Recommended';
import SimilarMovies from './Sections/Similar';
import { createFromIconfontCN } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';

function MovieDetailPage(props) {
    const classes = useStyles();
    const { t } = useTranslation();
    const CurrentLanguage = localStorage.getItem('language')
    const { Title } = Typography;
    const movieId = props.match.params.movieId
    const [Movie, setMovie] = useState([])
    const [Directors, setDirectors] = useState([])
    const [Trailer, setTrailer] = useState([])
    const [Casts, setCasts] = useState([])
    const [CommentLists, setCommentLists] = useState([])
    const [LoadingForMovie, setLoadingForMovie] = useState(true)
    const [LoadingForCasts, setLoadingForCasts] = useState(true)
    const [ActorToggle, setActorToggle] = useState(false)

    const StreamTitleIcon = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/font_1804216_vq7xtyn73yj.js',
    });
    const postId = props.match.params.movieId;
    // const { movie } = props;

    let variable = {
        postId: postId
    }

    const user = useSelector(state => state.user)

    var videoArray = [];
    var embedLink = '';
    if (Trailer.length > 0) {
      var i;
      for (i = 0; i < Trailer.length; i++) {
        if (Trailer[i].type === 'Trailer') {
          videoArray.push(Trailer[i].key);
        }
      }
      if (videoArray.length > 0) {
        embedLink = 'https://www.youtube.com/embed/' + videoArray[0];
      }
    }

    useEffect(() => {
        // new endpoint not based on most popular like landing page but movie id
        let _mounted = true;
        const fetchDetailInfo = (endpoint) => {

            fetch(endpoint)
                .then(result => result.json())
                .then(result => {
                    if (result.status_code) {
                        _mounted && setLoadingForMovie(true);
                        message.error(t("landing.nomovie"));
                        props.history.push("/landing");
                    } else {
                        _mounted && setMovie(result)
                        _mounted && setLoadingForMovie(false)

                        let endpointForCasts = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
                       const videoLang = () => {
                            const CurrentLanguage = localStorage.getItem('language')
                            if (CurrentLanguage) return `${API_URL}movie/${movieId}/videos?api_key=${API_KEY}&language=${CurrentLanguage}`
                            else return `${API_URL}movie/${movieId}/videos?api_key=${API_KEY}`
                        }
                        let endpointTrailer = videoLang();
                        fetch(endpointForCasts)
                            .then(result => result.json())
                            .then(result => {
                                _mounted && setCasts(result.cast);
                                const Directors = result.crew.filter((member) => member.job === "Director");
                                _mounted && setDirectors(Directors);
                            })
                        setLoadingForCasts(false)
                        fetch(endpointTrailer)
                            .then(result => result.json())
                            .then(result => {
                                _mounted && setTrailer(result.results);
                            })
                    }
                })
                .catch(error => console.error('Error:', error)
                )
        }
        // console.log(movieSources)

        let endpointForMovieInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=${CurrentLanguage}`;
        fetchDetailInfo(endpointForMovieInfo)

        axios.post('/api/comment/getComments', variable)
            .then(response => {
                // console.log("get comments ", response)
                if (response.data.success) {
                    // console.log('response.data.comments ', response.data.comments)
                    _mounted && setCommentLists(response.data.comments)
                } else {
                    props.history.push("/login");
                }
            })
        return () => { _mounted = false }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movieId, t, props, CurrentLanguage])

    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }

    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }

    return (
        <div>
            {user.userData && user.userData.isAuth ?
                <>
                    {/* Movie Info */}
                    {!LoadingForMovie && Trailer ?
                        <MovieInfo movie={Movie} directors={Directors} cast={Casts} trailer={Trailer} />
                        :
                        <div><Spinner /></div>
                    }


                    {/* Body */}
                    <div style={{ width: '85%', margin: '1rem auto' }}>

                        {/* Actors Grid*/}

                        {!LoadingForMovie ?
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                                <Button variant="contained" className={classes.buttonActors} onClick={toggleActorView}>{ActorToggle ? t('movie.dontShowActors') : t('movie.showActors')}</Button>
                            </div>
                            :
                            null
                        }
                        {ActorToggle &&
                            <Row gutter={[16, 16]}>
                                {
                                    !LoadingForCasts ? Casts.map((cast, index) => (
                                        cast.profile_path &&
                                        <React.Fragment key={cast.id}>
                                            <GridCards actor image={cast.profile_path} actorName={cast.name} charName={cast.character} />
                                        </React.Fragment>
                                    )) :
                                        <div><Spinner /></div>
                                }
                            </Row>
                        }
                        <br />


                        {/* Stream */}

                        <Title level={3}>
                            <StreamTitleIcon type="icon-movie2" style={{ fontSize: "28px", paddingRight: "10px" }} />{t('movie.streamTitle')} {Movie.title}</Title>
                        <hr />
                        <br />
                        <label ><p style={{ color: '#ff0000bf', textAlign: 'center', fontSize: '1rem', border: '1px solid', padding: '0.5rem', borderRadius: '10px' }}>
                  For legal reasons - this demo only allows you to watch the associated Youtube trailer.
                  </p></label>
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                        <div className="iframe-container">
                    <iframe
                      title={Movie.title}
                      width="560"
                      height="315"
                      src={embedLink}
                      frameBorder="0"
                      sameSite="none; secure"
                      Secure
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen>
                    </iframe>
                    </div>
                        </div>
                    
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <LikeDislikes video videoId={movieId} userId={localStorage.getItem('userId')} />
                        </div>

                        {/* Comments */}
                        <Comments movieTitle={Movie.title} CommentLists={CommentLists} postId={postId} refreshFunction={updateComment} />

                        <br />
                        {/* Recommended Movies */}
                        {!LoadingForMovie ?
                            <div><RecommendedMovies type="Recommended Movies" urlParams={movieId} /></div>
                            :
                            null
                        }
                        {/* <br /> */}
                        {/* Similar Movies */}
                        {!LoadingForMovie ?
                            <div><SimilarMovies type="Similar Movies" urlParams={movieId} /></div>
                            :
                            null
                        }
                    </div>
                </>
                : <Spinner />}
        </div>
    )
}

export default MovieDetailPage
