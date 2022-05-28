import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { updateUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import { message, Typography, Avatar } from 'antd';
import { useTranslation } from 'react-i18next';
import ResetPass from './ResetPass';
import { UserOutlined } from '@ant-design/icons';
import Spinner from '../LandingPage/Sections/Spinner';
import { store } from "react-notifications-component";
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Form,
  Input,
  Button,
} from 'antd';

const { Title } = Typography;

const formItemLayout = {
  labelCol: {
      xs: { span: 20 },
      sm: { span: 8 },
  },
  wrapperCol: {
      xs: { span: 14 },
      sm: { span: 6 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
      xs: {
          span: 20,
          offset: 0,
      },
      sm: {
          span: 14,
          offset: 8,
      },
  },
};


function ProfilePage() {
  const { t, i18n } = useTranslation();
  const user = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [content, setContent] = React.useState("");
  const [UserID, setUserID] = useState([]);
  const imageInputRef = React.useRef();
  const history = useHistory();
  var allowedTypes = ["jpg", "jpeg", "png", "gif"];

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };
  let language = i18n.language;

  function onChange(e) {
    changeLanguage(e.target.value);
    localStorage.setItem("language", e.target.value);
  }

  useEffect(() => {
    axios.get('/api/users/:userId')
      .then(response => {
        if (response.data.success) {
          setUserID(response.data.users)
        } else {
          history.push("/login");
        }
      })
  }, [history])

  const uploadImage = e => {
    e.preventDefault();
    setContent(e.target.value)
    const files = e.target.files[0];
    const cloudName = "dkyqbngya";
    const unsignedUploadPreset = "f7r0dz2t";
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    if (!files || files.length === 0)
      return;
    if (files) {
      var extension = files.name.replace(/.*\./, '').toLowerCase();
      if (allowedTypes.indexOf(extension) < 0) {
        message.error(`${files.type}${t('register.imgFormat')}`)
        imageInputRef.current.value = "";
        setContent("");
        setImage(""); 
        return;
      }
      if (files.size > 150000) {
        message.error(`${files.name}${t('register.imgTooLarge')}`)
        imageInputRef.current.value = "";
        setContent("");
        setImage(""); 
        return;
      }
      else {
        var fd = new FormData();
        fd.append("file", files);
        fd.append("upload_preset", unsignedUploadPreset);
        setLoading(true);
        const config = {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        };
        axios.post(url, fd, config)
          .then(res => {
            setLoading(false)
            var url = res.data.secure_url;
            var resize = url.split('/');
            resize.splice(-3, 0, 'w_125,c_scale');
            var img = new Image();
            img.src = resize.join('/');
            setImage(img.src)
          })
          .catch((err) => {
            if (err) {
              switch (err.response.status) {
                case 400:
                  message.error(t('register.imgInvalid'))
                  break;
                case 404:
                  message.error(t('register.imgNotFound'))
                  break;
                case 500:
                  message.error(t('register.imgError'))
                  break;
                default:
                  break;
              }
            }
          })
      }
    }
  }

  const dispatch = useDispatch();
    return (
      user.userData && user.userData.isAuth ?
    UserID.map((info, index) => (
      <React.Fragment key={info._id}>
        <Formik
          initialValues={{
            email: info.email,
            firstName: info.firstName,
            lastName: info.lastName,
            username: info.username,
            image: image,
            lang: language,
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string()
              .required(t('register.usernameErr'))
              .matches(/^[A-Za-z0-9_]{2,20}$/, t('register.usernameRules'))
              .min(2, t('register.usernameMin'))
              .max(20, t('register.usernameMax')),
            firstName: Yup.string()
              .required(t('register.firstNameErr'))
              .matches(/^[A-Z]+$/i, t('register.firstNameAlpha'))
              .min(2, t('register.firstNameMin'))
              .max(20, t('register.firstNameMax')),
            lastName: Yup.string()
              .required(t('register.lastNameErr'))
              .matches(/^[A-Z]+$/i, t('register.lastNameAlpha'))
              .min(2, t('register.lastNameMin'))
              .max(20, t('register.lastNameMax')),
            email: Yup.string()
              .email(t('register.emailInvalid'))
              .required(t('register.emailErr')),
          })}
          onSubmit={(info, { setSubmitting }) => {
            setTimeout(() => {

              let dataToSubmit = {
                email: info.email,
                username: info.username,
                firstName: info.firstName,
                lastName: info.lastName,
                image: image,
                lang: language,
              };

              dispatch(updateUser(dataToSubmit)).then(response => {
                if (response.payload.success) {
                  store.addNotification({
                    message: t('editProfile.profileUpdated'),
                    insert: "top",
                    type: 'success',
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true
                    }
                  });
                } else {
                  alert(response.payload.err)
                }
              })
              setSubmitting(false);
            }, 500);
          }}
        >
          {props => {
            const {
              errors,
              touched,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            } = props;
            return (

              <div style={{ width: '85%', margin: '3rem auto' }}>

                <Title level={2}><UserOutlined style={{paddingRight: "10px"}}/>{t("editProfile.title")}</Title>
                <hr />
                <br />
                <main style={{ position: 'relative' }}>
                <Form key={info._id} style={{ minWidth: '375px' }} {...formItemLayout} onSubmit={handleSubmit}>
                  <Form.Item required label={t('editProfile.avatar')}>
                    <div name="image" className="imagePreview" >
                    {image ? <Avatar src={image} size={130}/>
                    : 
                    loading ? <Spinner /> : 
                    <Avatar src={info.image} alt="" size={130}/>}
                    </div>
                    <Input
                      id="image"
                      type="file"
                      name="image"
                      accept="image/*"
                      ref={imageInputRef} 
                      onChange={uploadImage}
                      value={content}
                      onBlur={handleBlur}
                    />
                  </Form.Item>

                  <Form.Item required label={t("editProfile.prefLang")}>
                    <select defaultValue={language} onChange={onChange}>
                      <option value="en-US">{t("navbar.lngEN")}</option>
                      <option value="fr-FR">{t("navbar.lngFR")}</option>
                    </select>
                  </Form.Item>

                  <Form.Item required label={t('register.username')}>
                    <Input
                      id="username"
                      type="text"
                      autoComplete="username"
                      defaultValue={info.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.username && touched.username ? 'text-input error' : 'text-input'
                      }
                    />
                    {errors.username && touched.username && (
                      <div className="input-feedback">{errors.username}</div>
                    )}
                  </Form.Item>

                  <Form.Item required label={t('register.firstName')}>
                    <Input
                      id="firstName"
                      type="text"
                      defaultValue={info.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.firstName && touched.firstName ? 'text-input error' : 'text-input'
                      }
                    />
                    {errors.firstName && touched.firstName && (
                      <div className="input-feedback">{errors.firstName}</div>
                    )}
                  </Form.Item>

                  <Form.Item required label={t('register.lastName')}>
                    <Input
                      id="lastName"
                      type="text"
                      defaultValue={info.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.lastName && touched.lastName ? 'text-input error' : 'text-input'
                      }
                    />
                    {errors.lastName && touched.lastName && (
                      <div className="input-feedback">{errors.lastName}</div>
                    )}
                  </Form.Item>

                  <Form.Item required label={t('register.email')}>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      defaultValue={info.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.email && touched.email ? 'text-input error' : 'text-input'
                      }
                    />
                    {errors.email && touched.email && (
                      <div className="input-feedback">{errors.email}</div>
                    )}
                  </Form.Item>

                  <Form.Item {...tailFormItemLayout}>
                    <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                      {t('editProfile.update')}
                    </Button>
                  </Form.Item>
                </Form>
                </main>
              </div>
            )
          }}
        </Formik>
            <br />
        <ResetPass />
      </React.Fragment>
    ))
    :
    <Spinner />
  )
}
export default ProfilePage