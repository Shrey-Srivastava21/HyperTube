import { useState, useEffect } from 'react';
import * as API from "../../../_actions/user_actions";
import {store} from "react-notifications-component";
import { useTranslation } from 'react-i18next';


export default function ForgotPassword(props) {
    const [mounted, setMounted] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
      function activeAccount() {
           API.activeAccount(props.match.params.tokenConf)
                .then((res=> {
                    // console.log("res status is : ",res)
                    if (res.status === 200) {
                        store.addNotification({
                            message: t('login.activated'),
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
                    }
                    else{
                        console.log("res status is : ")
                        store.addNotification({
                            message: t('login.tokenFail'),
                            insert: "top",
                            type: 'fail',
                            container: "top-right",
                            animationIn: ["animated", "fadeIn"],
                            animationOut: ["animated", "fadeOut"],
                            dismiss: {
                                duration: 5000,
                                onScreen: true
                            }
                        });
                    }
                }))
                .catch((
                    error=>{console.log(error)}
                    ))
                   
            props.history.push('/login')
        }
        if (!mounted && props && props.match.params && props.match.params.tokenConf){
            // console.log("r1")
            activeAccount();
            setMounted(true);
        }
    }, [props, mounted, t]);

    return null;
}