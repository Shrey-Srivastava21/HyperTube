
import React, { useState } from 'react';
import { Grow, Typography, TextField, Container, Grid, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as API from "../../../_actions/user_actions";
import { store } from "react-notifications-component";
import { useTranslation } from 'react-i18next';
import {
    Button
} from 'antd';
const useStyles = makeStyles(theme => ({
    loginContainer: {
        padding: '9em 0 0 0',
        margin: 'auto',
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: theme.spacing(5),
    },
    login: {
        marginTop: 'auto',
        backgroundColor: 'rgba(250, 250, 250, 0.9)',
        borderRadius: '12px',
        padding: theme.spacing(3),
        //  boxShadow: '1px 1px 42px rgba(238, 28, 115,0.2);',
    },
    signupButton: {
        // background: 'linear-gradient(-317deg, #207af4 -25%, #0b1123, #0b1123 70%, #f02678 160% )',
        margin: theme.spacing(3, 0, 3, 0),
        borderRadius: '10px !important',
        color: 'white',
    },
    textfield: {
        '& fieldset': {
            borderRadius: '10px !important',
        },
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    }
}));


export default function ForgotPassword(props) {
    const classes = useStyles();
    const [mounted, setMounted] = useState(true);
    const [validationErrors, setValidationErrors] = React.useState({ err_email: false });
    const [value, setValue] = React.useState({ email: '' });
    const { t } = useTranslation();

    function validateEmail(email) {
        // eslint-disable-next-line
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const handleRedirectSignup = (e) => {
        setMounted(!mounted);
        e.preventDefault();
        props.history.push('/register');
    };

    const handleChange = (event) => {
        const { err_email } = validationErrors;
        if (event.target.id === "email" && err_email)
            setValidationErrors({ ...validationErrors, err_email: false });
        setValue({ ...value, [event.target.id]: event.target.value });
    };

    const handleMailSend = (e) => {
        e.preventDefault();
        if (value && value.email && value.email.length && !validateEmail(value.email)) {
            setValidationErrors({ err_email: t('reset.resetMailErr') });
        }
        else if (validateEmail(value.email) && !validationErrors.err_email) {
            API.sendResetMail(value.email)
                .then(res => {
                    if (res.status === 200)
                        store.addNotification({
                            message: t("reset.resetMail"),
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
                    props.history.push('/login');
                })
                .catch(() => { setValidationErrors({ err_email: t('reset.resetMailErr') }) })
        }
        else
            setValidationErrors({ err_mail: t("reset.resetMailErr") });
    };

    return (
        <div className="loginbg">
            <div className={classes.loginContainer}>
                <Grow in={mounted}>
                    <Container className={classes.login} component="main" maxWidth="xs">
                        {/* <CssBaseline /> */}
                        <div className={classes.paper}>
                            <Typography component="h1" variant="h5">
                                {t("reset.forgotPassword")}
                            </Typography>
                            <form className={classes.form} onSubmit={handleMailSend} noValidate>
                                <Grid alignContent="center" alignItems="center" container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="email"
                                            label={t("reset.email")}
                                            name="email"
                                            autoComplete="email"
                                            className={classes.textfield}
                                            value={value.email || ''}
                                            error={Boolean(validationErrors.err_email)}
                                            helperText={validationErrors.err_email}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    type="primary"
                                    className={classes.signupButton}
                                    onClick={handleMailSend}
                                >
                                    {t("reset.sendMail")}
                                </Button>
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        <Link onClick={handleRedirectSignup} href="#" variant="body2">
                                            {t("reset.account")}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    </Container>
                </Grow>
            </div>
        </div>
    );
}