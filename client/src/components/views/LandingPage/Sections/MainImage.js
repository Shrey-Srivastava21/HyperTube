import React from 'react'
import { Typography } from 'antd';
const { Title } = Typography;

function MainImage(props) {

    let { landing, genre } = props
    if (landing) {
        return (
            <div
                style={{
                    background:
                        `linear-gradient(to bottom, rgba(0,0,0,0)
            39%,rgba(0,0,0,0)
            41%,rgba(0,0,0,0.65)
            100%),
            url('${props.image}'), #1c1c1c`,
                    // height: '500px',
                    height: '400px',
                    backgroundSize: '100%, cover',
                    backgroundPosition: 'center, center',
                    backgroundPositionY: '9px',
                    width: '100%',
                    position: 'relative'
                }}
            >
            </div>
        )
    } else {
        if (genre) {
            return (
                <div
                    style={{
                        background:
                            `linear-gradient(to bottom, rgba(0,0,0,0)
            39%,rgba(0,0,0,0)
            41%,rgba(0,0,0,0.65)
            100%),
            url('${props.image}'), #1c1c1c`,
                        // height: '500px',
                        height: '400px',
                        backgroundSize: '100%, cover',
                        backgroundPosition: 'center, center',
                        backgroundPositionY: '9px',
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    <div>
                        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '10px', padding: '10px', position: 'absolute', maxWidth: '500px', bottom: '2rem', marginLeft: '2rem' }} >
                            <Title style={{ color: 'white' }} level={2} > {props.genreName}</Title>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default MainImage
