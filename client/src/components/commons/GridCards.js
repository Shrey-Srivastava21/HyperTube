import React from 'react'
import { Col, Card, Badge } from 'antd';
import { IMAGE_BASE_URL } from '../Config';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

function GridCards(props) {

    const { t } = useTranslation();
    let { actor, movie, image, movieId, movieName, actorName, charName, date, vote, movieGenre } = props
    const POSTER_SIZE = "w154";

    const VoteColors = {
        UNKNOWN: '#999',
        BAD: '#cd5c5c',
        OK: '#ffa500',
        EXCELLENT: '#52c41a'
    }

    function getScoreColor(score) {
        let color = VoteColors.EXCELLENT
        if (!score || vote === 0) color = VoteColors.UNKNOWN
        else if (score < 5.5) color = VoteColors.BAD
        else if (score < 7) color = VoteColors.OK

        return color
    }

    const BadgeColor = getScoreColor(vote)

    const imageClick = () => {
        return (window.location.href = "/movie/" + movieId)
    }

    if (actor !== undefined) {
        return (
            <Col lg={4} md={6} xs={24}>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Card
                        hoverable
                        style={{ width: '100%' }}
                        alt={movieName}
                        cover={<img alt={actorName} src={image ? `${IMAGE_BASE_URL}${POSTER_SIZE}${image}` : 'https://res.cloudinary.com/dkyqbngya/image/upload/v1586537514/twdjio2duy8ebxulqwti.png'} />}
                    >
                        <h3 style={{ textAlign: "center", fontWeight: "bold" }}>{actorName}</h3>
                        <h5 style={{ textAlign: "center", fontWeight: "bold" }}>{charName}</h5>
                    </Card>
                </div>
            </Col>
        )
    } else {
        if (movie !== undefined) {
            return (
                <Col lg={4} md={6} xs={24}>
                    <div style={{ position: 'relative' }}>
                        <Badge
                            style={{ backgroundColor: BadgeColor }}
                            offset={[-15, 15]}
                            count={vote}>
                                <Card className="posterCard"
                                    hoverable
                                    style={{ width: '100%', height: '100%' }}
                                    alt={movieName}
                                    cover={<img onClick={() => imageClick()} alt={movieName} src={image ? `${image}` : t('landing.notAvail')} />}
                                >
                                    <a style={{ color: "black" }} href={`/movie/${movieId}`} ><div style={{ textAlign: "center", fontWeight: "bold" }}>{movieName} ({date ? moment(new Date(date)).format('YYYY') : 'N/A'})</div></a>
                                    <br />
                                    <div style={{ textAlign: "center" }}>{movieGenre}</div>
                                </Card>
                            </Badge>
                    </div>
                </Col>
            )
        }
    }

}

export default GridCards
