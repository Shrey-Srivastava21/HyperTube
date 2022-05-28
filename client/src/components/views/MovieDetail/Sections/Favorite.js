import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createFromIconfontCN } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const PopcornIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1804216_05evm2uwptc9.js',
});

const PopcornColorIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1804216_c1v18kzse7b.js',
});

function Favorite(props) {
    const { t } = useTranslation();
    const history = useHistory();
    const user = useSelector(state => state.user)

    const movieId = props.movieId
    const userFrom = props.userFrom
    const movieTitle = props.movieInfo.title
    const moviePost = props.movieInfo.backdrop_path
    const movieRunTime = props.movieInfo.runtime

    const [FavoriteNumber, setFavoriteNumber] = useState(0)
    const [Favorited, setFavorited] = useState(false)
    const variables = {
        movieId: movieId,
        userFrom: userFrom,
        movieTitle: movieTitle,
        moviePost: moviePost,
        movieRunTime: movieRunTime
    }

    const onClickFavorite = () => {

        if (user.userData && !user.userData.isAuth) {
            return history.push("/");
        }

        if (Favorited) {
            //when we are already subscribed 
            axios.post('/api/favorite/removeFromFavorite', variables)
                .then(response => {
                    if (response.data.success) {
                        setFavoriteNumber(FavoriteNumber - 1)
                        setFavorited(!Favorited)
                    } else {
                        history.push("/");
                    }
                })

        } else {
            // when we are not subscribed yet

            axios.post('/api/favorite/addToFavorite', variables)
                .then(response => {
                    if (response.data.success) {
                        setFavoriteNumber(FavoriteNumber + 1)
                        setFavorited(!Favorited)
                    } else {
                        history.push("/");
                    }
                })
        }
    }

    useEffect(() => {
        let mounted = true;
        const fetchFavoriteNumber = () => {
            axios.post('/api/favorite/favoriteNumber', variables)
                .then(response => {
                    if (response.data.success) {
                        mounted && setFavoriteNumber(response.data.subscribeNumber)
                    } else {
                        history.push("/");
                    }
                })
                .catch((
                    error => { console.log(error) }
                ))
        }
        fetchFavoriteNumber();
        return () => { mounted = false; }
    }, [props, history, variables])

    useEffect(() => {
        let mounted = true;
        const fetchFavorited = () => {
            axios.post('/api/favorite/favorited', variables)
                .then(response => {
                    if (response.data.success) {
                        mounted && setFavorited(response.data.subcribed)
                    } else {
                        history.push("/");
                    }
                })
        }
        fetchFavorited();
        return () => {mounted = false;}
    }, [props, variables, history])

    return (
        <>
            <Button type="primary" onClick={onClickFavorite}>
                {!Favorited ? t('favorites.add') : t('favorites.remove')}{!Favorited ? <PopcornIcon type="icon-popcorn" style={{ fontSize: "20px" }} />
                    : <PopcornColorIcon type="icon-popcorn1" style={{ fontSize: "20px" }} />}{FavoriteNumber}
            </Button>
        </>
    )
}

export default Favorite

