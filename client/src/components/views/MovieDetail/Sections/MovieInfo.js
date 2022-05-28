import React, { useState } from 'react'
import { IMAGE_BASE_URL, IMAGE_SIZE, POSTER_SIZE } from '../../../Config'
import moment from 'moment';
// import numeral from 'numeral';
import { useTranslation } from 'react-i18next';
import { createFromIconfontCN, YoutubeOutlined} from '@ant-design/icons';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import useStyles from '../style';
import { Badge, Modal, Button } from 'antd';
import Favorite from '../Sections/Favorite';
import { Link } from 'react-router-dom';

function MovieInfo(props) {

  const [visible, setVisible] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();

  const calcTime = (time) => {
    const hours = Math.floor(time / 60);
    let mins = time % 60;
    if (mins < 10) { mins = "0" + mins; }
    return `${hours}h ${mins}min`;
  }

  const { movie, directors, cast, trailer } = props;

  const VoteColors = {
    UNKNOWN: '#999',
    BAD: '#cd5c5c',
    OK: '#ffa500',
    EXCELLENT: '#52c41a'
  }

  function getScoreColor(score) {
    let color = VoteColors.EXCELLENT
    if (!score || movie.vote_average === 0) color = VoteColors.UNKNOWN
    else if (score < 5.5) color = VoteColors.BAD
    else if (score < 7) color = VoteColors.OK

    return color
  }

  const BadgeColor = getScoreColor(movie.vote_average)

  const overviewLength = 700;

  const MovieInfoIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1804216_3easwvxbvnh.js',
  });


  var videoArray = [];
  var embedLink = '';
  if (trailer.length > 0) {
    var i;
    for (i = 0; i < trailer.length; i++) {
      if (trailer[i].type === 'Trailer') {
        videoArray.push(trailer[i].key);
      }
    }
    if (videoArray.length > 0) {
      embedLink = 'https://www.youtube.com/embed/' + videoArray[0] + '?&autoplay=1';
    }
  }

  const showModal = () => {
    setVisible(true);
  }

  const handleCancel = () => {
    setVisible(false);
  }

  const stopVideo = 'https://www.youtube.com/embed/' + videoArray[0] + '?&autoplay=0';
  const youtubeLink = visible ? embedLink : stopVideo;

  return (
    <main style={{ position: 'relative' }}>
      <div className={classes.backdrop}>
        <img className={classes.backdropImage} src={movie.backdrop_path ? `${IMAGE_BASE_URL}${IMAGE_SIZE}${movie.backdrop_path}` : "https://res.cloudinary.com/dkyqbngya/image/upload/v1586787757/detykqycj7ejezsjmxln.png"} alt="" />
      </div>
      <Container className={classes.movieContainer}>
        <Grid container spacing={7}>
          <Grid item md={3}>
            <img className={classes.poster} src={movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : t('landing.notAvail')} alt={"Poster of " + movie.title} />
          </Grid>
          <Grid item md={8} style={{ color: 'white' }}>
            <div className={classes.releaseDate}>
              <h2 style={{ color: "white" }}>{movie.release_date
                ? moment(new Date(movie.release_date)).format('YYYY') : 'N/A'}
              </h2>
            </div>
            <Typography variant={"h4"} style={{ fontWeight: 'bold', color: 'white' }} component={"h1"}>
              <MovieInfoIcon type="icon-movie1" style={{ fontSize: "30px", paddingRight: "10px" }} />{movie.title}
            </Typography>
            {movie.genres.length ?
              <ul className={classes.genreList}>
                {movie.genres.map((element, iterator) => {
                  return <Link to={{ pathname: `/landing/genre/${element.name}/${element.id}` }} key={iterator}><li className={classes.genre} key={element.id}>{element.name}</li></Link>
                })}
              </ul>
              :
              null
            }

            <div className={classes.vote}>
              <span style={{ margin: '2px 0px 0 6px' }}>
                <Badge
                  style={{ backgroundColor: BadgeColor, marginRight: 16 }}
                  offset={[0, 0]}
                  count={movie.vote_average}>
                </Badge>
                <Favorite movieInfo={movie} movieId={movie.id} userFrom={localStorage.getItem('userId')} />
              
              
                {
              trailer ?
                <>
                  <Button type="primary" style={{margin: "15px"}} onClick={showModal}>
                  <YoutubeOutlined style={{fontSize: "20px"}}/> {t("movieInfo.trailer")}
                        </Button>
                  <Modal
                    title={`${t('movieInfo.trailerTitle')} ${movie.title} ${t('movieInfo.watchHyper')}`}
                    visible={visible}
                    onCancel={handleCancel}
                    width={610}
                    style={{ top: 20 }}
                    footer={[
                      <Button type="primary" key="Close" onClick={handleCancel}>
                        {t("movieInfo.close")}
                      </Button>
                    ]}
                  >
                    <div className="iframe-container">
                    <iframe
                      title={movie.title}
                      width="560"
                      height="315"
                      src={youtubeLink}
                      frameBorder="0"
                      sameSite="none; secure"
                      Secure
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen>
                    </iframe>
                    </div>
                  </Modal>
                </>
                :
                null
            }
              
              
              </span>
            </div>
            <div style={{ marginTop: 10, marginBottom: 10 }}>
              <Typography component={"div"} style={{ marginRight: 15 }}>
                <b>{t('movieInfo.runtime')}</b> {movie.runtime ? calcTime(movie.runtime) : 'N/A'}
              </Typography>
              <Typography component={"div"}>
                <b>{t('movieInfo.movietitle')}</b> {movie.original_title}
              </Typography>
              <Typography component={"div"}>
              <b>{t('movieInfo.actors')}</b> {cast.map((element) => {
                  return element.name;
                }).slice(0, 5).join(", ")}
                <br />
                <b>{t('movieInfo.director')}</b> {directors.map((element) => {
                  return element.name;
                }).join(", ")}
                <br />
                <b>{t('movieInfo.prod')}</b> {movie.production_companies.map(function (company) {
                  return company.name;
                }).shift()}
              </Typography>
            </div>
            {movie.overview && <React.Fragment>
              <h4 className={classes.subtitle}>{t('movieInfo.overview')}</h4>
              <Typography variant={"body1"}>{movie.overview && movie.overview.length > overviewLength ? movie.overview.substring(0, overviewLength) + "..." : movie.overview}</Typography>
            </React.Fragment>}
            {/* <div style={{ marginTop: 20 }}>
              <Typography component={"div"}>
                <b>{t('movieInfo.budget')}</b> {movie.budget ? numeral(movie.budget).format('0,0[.]00 $') : 'N/A'}
              </Typography>
              <Typography component={"div"}>
                <b>{t('movieInfo.revenue')}</b> {movie.revenue ? numeral(movie.revenue).format('0,0[.]00 $') : 'N/A'}
              </Typography>
            </div> */}
          </Grid>
        </Grid>
      </Container>
    </main>
  )
}

export default MovieInfo
