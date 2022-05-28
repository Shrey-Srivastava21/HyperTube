import React from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as API from "../../../_actions/user_actions";
import { useTranslation } from 'react-i18next';
import { LockOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { store } from "react-notifications-component";
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


function ResetPass() {
    const { t } = useTranslation();
    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    password: '',
                }}
                validationSchema={Yup.object().shape({
                    password: Yup.string()
                        .min(4, t('register.passwordMin'))
                        .max(15, t('register.passwordMax'))
                        //DECOMMENTER AVANT PUSH FINAL
                        // .matches(
                        //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
                        //   t('register.passRegex')
                        // )
                        .required(t('register.passwordErr')),
                    password_confirm: Yup.string()
                        .oneOf([Yup.ref('password'), null], t('register.passwordMatch'))
                        .required(t('register.cpasswordErr')),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {

                        API.resetPasswordProfile(values.password, values.password_confirm)
                            .then(response => {
                                if (response.status === 200) {
                                    store.addNotification({
                                        message: t('editProfile.newpassok'),
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
                                    alert('Password Update Fail')
                                }
                            })
                        setSubmitting(false);
                    }, 500);
                }}
            >
                {props => {
                    const {
                        errors,
                        values,
                        touched,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                    } = props;
                    return (
                        <div style={{ width: '85%', margin: '3rem auto' }}>
                        <Title level={2}><LockOutlined style={{ paddingRight: "10px" }} />{t("editProfile.editPassword")}</Title>
                            <hr />
                            <br />
                        <Form style={{ minWidth: '375px' }} {...formItemLayout} onSubmit={handleSubmit}>
                            <Input type="text" name="username" value="" autoComplete="username" style={{ display: 'none' }} />
                            <Form.Item required label={t('editProfile.newpass')} hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
                                <Input
                                    id="password"
                                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder={t('register.passwordForm')}
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    className={
                                        errors.password && touched.password ? 'text-input error' : 'text-input'
                                    }
                                />
                                {errors.password && touched.password && (
                                    <div className="input-feedback">{errors.password}</div>
                                )}
                            </Form.Item>

                            <Form.Item required label={t('editProfile.newcpass')} hasFeedback validateStatus={errors.password_confirm && touched.password_confirm ? "error" : 'success'}>
                                <Input
                                    id="password_confirm"
                                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder={t('register.cpasswordForm')}
                                    type="password"
                                    name="password_confirm"
                                    autoComplete="current-password"
                                    value={values.password_confirm}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.password_confirm && touched.password_confirm ? 'text-input error' : 'text-input'
                                    }
                                />
                                {errors.password_confirm && touched.password_confirm && (
                                    <div className="input-feedback">{errors.password_confirm}</div>
                                )}
                            </Form.Item>

                            <Form.Item {...tailFormItemLayout}>
                                <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                                    {t('editProfile.updatePass')}
                                </Button>
                            </Form.Item>
                        </Form>
                        </div>
                    )
                }}
            </Formik>
        </React.Fragment>
    )
}
export default ResetPass