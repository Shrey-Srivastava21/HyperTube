import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

function LoginPage(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

  const [formErrorMessage, setFormErrorMessage] = useState('')
  const [rememberMe, setRememberMe] = useState(rememberMeChecked)

  const handleRememberMe = () => {
    setRememberMe(!rememberMe)
  };

  const initialUsername = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .min(2, t('login.usernameErr'))
          .required(t('login.usernameErr2')),
        password: Yup.string()
          .min(4, t('login.passwordErr'))
          .required(t('login.passwordErr2')),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            username: values.username,
            password: values.password
          };

          dispatch(loginUser(dataToSubmit))
            .then(response => {
              if (response.payload.loginSuccess) {
                props.history.push("/landing");
              } else {
                setFormErrorMessage(t('login.formErr'))
              }
            })
            .catch(err => {
              setFormErrorMessage(t('login.formErr'))
              setTimeout(() => {
                setFormErrorMessage("")
              }, 3000);
            });
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
          <div className="loginbg">
            <div className="login">
              <Title level={3} style={{textAlign: "center"}}>{t('login.login')}</Title>
              <form onSubmit={handleSubmit}>

                <Form.Item required>
                  <Input
                    id="username"
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder={t('login.username')}
                    type="text"
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

                <Form.Item required>
                  <Input
                    id="password"
                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder={t('login.password')}
                    type="password"
                    autoComplete="off"
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

                {formErrorMessage && (
                  <label ><p style={{ color: '#ff0000bf', textAlign: 'center', fontSize: '0.8rem', border: '1px solid', padding: '0.5rem', borderRadius: '10px' }}>{formErrorMessage}</p></label>
                )}

                <Form.Item>
                  <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe}>{t('login.remember')}</Checkbox>
                  <a className="login-form-forgot" href="/forgot" style={{ float: 'right' }}>
                    {t('login.forgot')}
                  </a>
                  <div>
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} disabled={isSubmitting} onSubmit={handleSubmit}>
                      {t('login.login')}
                    </Button>
                  </div>
                Or <a href="/register">{t('login.registernow')}</a>
                </Form.Item>

                <h3>{t('login.connect')}</h3>

                <div className="container" style={{ textAlign: "center" }}>
                <label ><p style={{ color: '#ff0000bf', backgroundColor: 'white', textAlign: 'center', fontSize: '0.85rem', border: '1px solid', padding: '0.5rem', borderRadius: '10px' }}>
                Welcome to the Live Demo.<br />
                  You can sign up now or use the following credentials:<br />
                  <b>Username:</b> test <br />
                  <b>Password:</b> test</p></label>
                </div>
              </form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default withRouter(LoginPage);