import React from 'react';
import { API_KEY, CurrentLanguage , IMAGE_BASE_URL, POSTER_SIZE} from '../../../Config'
import { withTranslation } from 'react-i18next';
import { createFromIconfontCN } from '@ant-design/icons';
import { Typography, Row } from 'antd';
import GridCard from '../../../commons/GridCards'

const { Title } = Typography;

const MovieIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1804216_cpuj79al49d.js',
});

class RecommendedMovies extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: ''
        }

        if (props.type === 'Recommended Movies') {
            fetch('https://api.themoviedb.org/3/movie/' + this.props.urlParams + '/recommendations?api_key=' + API_KEY)
                .then(res => res.json())
                .then(res => {
                    this.setState({ data: res.results });
                })
                .catch(error => console.error('Error:', error))
        }
    }

    render() {
        const { t } = this.props
        // if (!this.state.data) return "";
        if (this.state.data === '') return ('');
        else {
            let data_arr = [];
            for (let i in this.state.data.slice(0, 5)) {
                if (this.state.data[i].vote_count > 2300 && this.state.data[i].backdrop_path !== null && this.state.data[i].overview !== null)

                    data_arr.push(
                        <React.Fragment key={i}>
                        <GridCard movie
                        className="similar_movies"
                            image={ this.state.data[i].poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${ this.state.data[i].poster_path}` : t('landing.notAvail')}
                            movieId={ this.state.data[i].id}
                            movieName={ this.state.data[i].title}
                            date={ this.state.data[i].release_date}
                            vote={ this.state.data[i].vote_average ?  this.state.data[i].vote_average : 'N/A'}
                        />
                        </React.Fragment>
                    )
            }

            return (
                <div>
                    <Title level={3}><MovieIcon type="icon-movie" style={{ fontSize: "35px", paddingRight: "10px" }} />{t('movie.recommended')}</Title>
                    <hr />
                    <br />
                    <Row gutter={[16, 16]}>
                        {this.state.data.length === 0 ? 
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                            {t("movie.recoNone")}
                            </div> : data_arr}
                    </Row>
                </div>
            )
        }
    }
}

export default withTranslation()(RecommendedMovies);