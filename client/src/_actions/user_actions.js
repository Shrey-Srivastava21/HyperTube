import axios from 'axios';

import {
    LOGIN_USER,
    REGISTER_USER,
    UPDATE_USER,
    AUTH_USER,
    LOGOUT_USER,
} from './types';
import { USER_SERVER } from '../components/Config.js';
const headers = { 'Content-Type': 'application/json' };

export function registerUser(dataToSubmit){
    console.log(dataToSubmit);
    const request = axios.post(`${USER_SERVER}/register`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}
export function updateUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/update`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: UPDATE_USER,
        payload: request
    }
}

export function resetPasswordProfile(password, password_confirm){
    
    return axios.post(`${USER_SERVER}/updatePassword`,
        {password, password_confirm },
        { headers: headers }
    )
}

export function confirmation(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/confirmation`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}
export function sendResetMail(email){
    return axios.post(`${USER_SERVER}/forgotPassword`,{email},
    { headers: headers }
    )
}
export function resetPassword(tokenConf, password, password_confirm){
    
    return axios.post(`${USER_SERVER}/reset/${tokenConf}`,
        {tokenConf, password, password_confirm},
        { headers: headers }
    )
}

export function activeAccount(tokenConf){
    return axios.get(`${USER_SERVER}/confirmation/${tokenConf}`,
    { headers: headers } 
    )
}


export function loginUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/login`,dataToSubmit)
                .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){
    const request = axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

