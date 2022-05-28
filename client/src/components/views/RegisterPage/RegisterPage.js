import React, { useState } from "react";
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import { message } from 'antd';
import Spinner from '../LandingPage/Sections/Spinner';
import { useTranslation } from 'react-i18next';
import { store } from "react-notifications-component";
import {
  Form,
  Input,
  Button,
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};


function RegisterPage(props) {
  const { t } = useTranslation();

  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = React.useState("");
  const imageInputRef = React.useRef();
  var allowedTypes = ["jpg", "jpeg", "png", "gif"];


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
            // console.log(res)
            var url = res.data.secure_url;
            // console.log(res.data)
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

    <Formik
      initialValues={{
        email: '',
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: '',
        image: ''
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
        password: Yup.string()
          .min(4, t('register.passwordMin'))
          .max(15, t('register.passwordMax'))
          .required(t('register.passwordErr')),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], t('register.passwordMatch'))
          .required(t('register.cpasswordErr')),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {

          let dataToSubmit = {
            email: values.email,
            password: values.password,
            username: values.username,
            firstName: values.firstName,
            lastName: values.lastName,
            image: image
          };

          if (!image || image === '') {
            message.error(t('register.imageErr'))
          }
          else {

            dispatch(registerUser(dataToSubmit)).then(response => {
              if (response.payload.success) {
                store.addNotification({
                  message: t('register.checkEmail'),
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
                props.history.push("/login");
              } else {
                alert(response.payload.err);
              }
            })
          }
          setSubmitting(false);
        }, 500);
      }}

    >
      {props => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;
        return (
          <div className="registerbg">
            <div className="register">
              <h1 style={{textAlign: "center"}}>{t('register.signup')}</h1>
              <Form style={{ minWidth: '375px' }} {...formItemLayout} onSubmit={handleSubmit} >

                <Form.Item required label={t('register.username')}>
                  <Input
                    id="username"
                    placeholder={t('register.usernameForm')}
                    type="text"
                    autoComplete="username"
                    value={values.username}
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
                    placeholder={t('register.firstNameForm')}
                    type="text"
                    value={values.firstName}
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
                    placeholder={t('register.lastNameForm')}
                    type="text"
                    value={values.lastName}
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
                    placeholder={t('register.emailForm')}
                    type="email"
                    autoComplete="email"
                    value={values.email}
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

                <Form.Item required label={t('register.password')} hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
                  <Input
                    id="password"
                    placeholder={t('register.passwordForm')}
                    type="password"
                    autoComplete="new-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.password && touched.password ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.password && touched.password && (
                    <div className="input-feedback">{errors.password}</div>
                  )}
                </Form.Item>

                <Form.Item required label={t('register.cpassword')} hasFeedback validateStatus={errors.cpassword && touched.cpassword ? "error" : 'success'}>
                  <Input
                    id="confirmPassword"
                    placeholder={t('register.cpasswordForm')}
                    type="password"
                    autoComplete="new-password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="input-feedback">{errors.confirmPassword}</div>
                  )}
                </Form.Item>

                <Form.Item required label={t('register.image')}>
                  <Input
                    id="image"
                    type="file"
                    name="image"
                    accept={"image/*"}
                    onChange={uploadImage}
                    onBlur={handleBlur}
                    value={content}
                    ref={imageInputRef}
                  />
                  <div name="image" className="imagePreview">
                  {loading ? <Spinner />: <img src={image} alt="" />}
                  </div>
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                  <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                    {t('register.submit')}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};


export default RegisterPage