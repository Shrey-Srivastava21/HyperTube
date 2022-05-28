import React, { useState } from 'react'
import { Button, Input, Typography, } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';

const SendIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1804216_o2mk1ztsiol.js',
  });
const { TextArea } = Input;
const { Title } = Typography;

function Comments(props) {
    const { t } = useTranslation();
    const user = useSelector(state => state.user)
    const [Comment, setComment] = useState("")

    const handleChange = (e) => {
        setComment(e.currentTarget.value)
    }

    function convertHtmlToText(str) {
        str = str.toString();
        return str.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, '');
    }

    const onSubmit = (e) => {

        e.preventDefault();

        if (user.userData && !user.userData.isAuth) {
            return message.error(t('movie.loginFirst'));
        }
        else if (!Comment) {
            return message.error(t('movie.emptyCom'));
        }
        const variables = {
            content: convertHtmlToText(Comment),
            writer: user.userData._id,
            postId: props.postId,
        }
        // console.log(variables)

        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setComment("")
                    props.refreshFunction(response.data.result)
                } else {
                    message.error(t('movie.failCom'))
                }
            })
    }

    return (
        <div>
            <br />
            <Title level={3}><CommentOutlined style={{paddingRight: "10px", fontSize: "30px"}}/>{t('movie.share')} {props.movieTitle} </Title>
            <hr />

            {props.CommentLists && props.CommentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment key={comment._id}>
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                        <ReplyComment CommentLists={props.CommentLists} postId={props.postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                )
            ))}

            {props.CommentLists && props.CommentLists.length === 0 &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }} >
                    {t('movie.comFirst')}
                </div>
            }

            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={Comment}
                    placeholder={t('movie.comText')}
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}><SendIcon type="icon-send" style={{fontSize: "20px"}}/></Button>
            </form>

        </div>
    )
}

export default Comments
