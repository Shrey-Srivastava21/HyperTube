import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Card, Avatar, Col, Row, Typography } from 'antd';
import { useHistory } from 'react-router-dom';
const { Title } = Typography;
const { Meta } = Card;

function UsersPage() {

    const { t } = useTranslation();
    const [UserList, setUserList] = useState([])
    const [Loading, setLoading] = useState(true)
    const history = useHistory();

    useEffect(() => {
        axios.get('/api/users/getUsers')
            .then(response => {
                if (response.data.success) {
                    setUserList(response.data.users)
                    setLoading(false)
                } else {
                    history.push("/login");
                }
            })
    }, [history])

    const renderCards = UserList.map((user, index) => {
        return <Col lg={6} md={8} xs={24} key={user._id}>
            <Card
                hoverable
                style={{ width: 240, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                cover={<Avatar src={user.image} size={84} />}
            >
                <Meta title={user.username} />
                <br />
                <span>{user.firstName} {user.lastName}</span>
            </Card>
        </Col>
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}>{t("users.usersTitle")}</Title>
            <hr />
            <br />
            {!Loading &&
            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>
            }
        </div>
    )
}

export default UsersPage