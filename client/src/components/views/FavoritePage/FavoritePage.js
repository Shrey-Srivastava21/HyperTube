import React, { useEffect, useState } from 'react'
import { Typography, Popover, Button } from 'antd';
import axios from 'axios';
import './favorite.css';
import { useTranslation } from 'react-i18next';
import { ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { IMAGE_BASE_URL, POSTER_SIZE } from '../../Config'
import { createFromIconfontCN } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { Title } = Typography;

const MovieInfoIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1804216_3easwvxbvnh.js',
});

const PopcornIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1804216_05evm2uwptc9.js',
});

function FavoritePage() {
    const { t } = useTranslation();

    const [Favorites, setFavorites] = useState([])
    const [Loading, setLoading] = useState(true)
    const history = useHistory();
    let variable = { userFrom: localStorage.getItem('userId') }

    const calcTime = (time) => {
        const hours = Math.floor(time / 60);
        let mins = time % 60;
        if (mins < 10) { mins = "0" + mins; }
        return `${hours}h ${mins}min`;
    }

    useEffect(() => {
        fetchFavoredMovie()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchFavoredMovie = () => {
        axios.post('/api/favorite/getFavoredMovie', variable)
            .then(response => {
                if (response.data.success) {
                    // console.log(response.data.favorites)
                    setFavorites(response.data.favorites)
                    setLoading(false)
                } else {
                    history.push("/login");
                }
            })
    }

    const onClickDelete = (movieId, userFrom) => {

        const variables = {
            movieId: movieId,
            userFrom: userFrom,
        }

        axios.post('/api/favorite/removeFromFavorite', variables)
            .then(response => {
                if (response.data.success) {
                    fetchFavoredMovie()
                } else {
                    history.push("/login");
                }
            })
    }

    const renderCards = Favorites.map((favorite, index) => {


        const content = (
            <div>
                {favorite.moviePost ?
                    <img src={`${IMAGE_BASE_URL}${POSTER_SIZE}${favorite.moviePost}`} alt="" />
                    : "no image"}
            </div>
        );

        return <tr key={favorite._id}>

            <Popover content={content} title={`${favorite.movieTitle}`}>
                <td><MovieInfoIcon type="icon-movie1" style={{ fontSize: "20px", paddingRight: "10px" }} /><strong><a style={{ color: "black" }} href={`/movie/${favorite.movieId}`}>{favorite.movieTitle}</a></strong></td>
            </Popover>

            <td><center><ClockCircleOutlined style={{ paddingRight: "10px" }} />{calcTime(favorite.movieRunTime)}</center></td>
            <td><center><Button type="primary" onClick={() => onClickDelete(favorite.movieId, favorite.userFrom)}><DeleteOutlined />{t('favorites.removeButton')}</Button></center></td>
        </tr>
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}><PopcornIcon type="icon-popcorn" style={{ paddingRight: "10px" }} />{t('favorites.title')}</Title>
            <hr />
            <br />
            {!Loading &&
                <table>
                    <thead>
                        <tr>
                            <th><MovieInfoIcon type="icon-movie1" style={{ fontSize: "20px", paddingRight: "10px" }} />{t('favorites.movieTitle')}</th>
                            <th><center><ClockCircleOutlined style={{ paddingRight: "10px" }} />{t('favorites.movieRuntime')}</center></th>
                            <th><center><DeleteOutlined style={{ paddingRight: "10px" }} />{t('favorites.remove')}</center></th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderCards}
                    </tbody>
                </table>
            }
        </div>
    )
}

export default FavoritePage
