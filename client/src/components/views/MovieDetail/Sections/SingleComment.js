import React, { useState } from 'react'
import { Comment, Avatar, Button, Input, Modal, Card } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import moment from 'moment';
import { createFromIconfontCN } from '@ant-design/icons';

const { Meta } = Card;

const SendIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1804216_o2mk1ztsiol.js',
});

const { TextArea } = Input;

function SingleComment(props) {
    const { t } = useTranslation();
    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState("")
    const [OpenReply, setOpenReply] = useState(false)

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    function convertHtmlToText(str) {
        str = str.toString();
        return str.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, '');
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if (!CommentValue) {
            return message.error(t('movie.replyEmptyCom'));
        }
        // else if (CommentValue.length >= 10) {
        //     return message.error("Message too long");
        // }

        let date = new Date();

        const variables = {
            writer: user.userData._id,
            postId: props.postId,
            date: date,
            responseTo: props.comment._id,
            content: convertHtmlToText(CommentValue)
        }


        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("")
                    setOpenReply(!OpenReply)
                    props.refreshFunction(response.data.result)
                } else {
                    message.error(t('movie.failCom'))
                }
            })
    }

    const actions = [
        <LikeDislikes comment commentId={props.comment._id} userId={localStorage.getItem('userId')} />,
        <span onClick={openReply} key="comment-basic-reply-to">{t('movie.reply')}</span>
    ]

    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    }

    const handleCancel = () => {
        setVisible(false);
    }

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer && props.comment.writer.username ? <b onClick={showModal} style={{ cursor: "pointer" }}>{props.comment.writer.username}</b> : t("movie.userDeleted")}
                avatar={
                    <Avatar onClick={showModal}
                        src={props.comment.writer && props.comment.writer.image ? props.comment.writer.image : t("landing.notAvail")}
                        alt="image"
                    />
                }
                datetime={moment(props.comment.date).format("DD/MM/YYYY - HH:mm")}
                content={
                    <p>
                        {props.comment.content}
                    </p>
                }
            ></Comment>
            {props.comment.writer ?
                <Modal
                    title={`${t('users.profileTitle')} - ${props.comment.writer.username}`}
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
                    <Card
                        hoverable
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        cover={<Avatar src={props.comment.writer.image} size={84} />}
                    >
                        <Meta title={<b>{props.comment.writer.username}</b>} />
                        <br />
                        <span>{props.comment.writer.firstName} {props.comment.writer.lastName}</span>
                    </Card>
                </Modal>
                : null
            }

            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={handleChange}
                        value={CommentValue}
                        placeholder={t('movie.comReply')}
                    />
                    <br />
                    <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}><SendIcon type="icon-send" style={{ fontSize: "20px" }} /></Button>
                </form>
            }

        </div>
    )
}

export default SingleComment
