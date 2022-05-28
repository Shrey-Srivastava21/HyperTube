import React, { useEffect } from 'react';
import { auth } from '../_actions/user_actions';
import { useSelector, useDispatch } from "react-redux";

export default function foo(ComposedClass, reload = null) {
    function AuthenticationCheck(props) {

        let user = useSelector(state => state.user);
        const dispatch = useDispatch();

        useEffect(() => {

            dispatch(auth()).then(async response => {
                if (await !response.payload.isAuth) {
                    if (reload) {
                        props.history.push('/login')
                    }
                } else {
                        if (reload === false) {
                            props.history.push('/landing')
                        }
                }
            })

        }, [dispatch, props.history])

        return (
            <ComposedClass {...props} user={user} />
        )
    }
    return AuthenticationCheck
}


