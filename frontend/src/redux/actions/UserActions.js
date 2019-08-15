import { getCurrentUser, login } from '../../util/APIUtils';
import { Layout, notification, Menu } from 'antd';
import { ACCESS_TOKEN } from '../../constants';

export const USER_LOGIN_OK = 'USER_LOGIN_OK';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_LOGIN_ERR = 'USER_GET_ERR';

export const actGetCurrentUser = () => (dispatch) => {
    getCurrentUser()
    .then(response => {
        dispatch({
            type: USER_LOGIN_OK,
            payload: {username: response.data.me.username}
        });
    }).catch(error => {
        dispatch({
            type: USER_LOGIN_ERR,
            payload: []
        });
        notification.error({
            message: 'Polling App',
            description: 'Your Username or Password is incorrect. Please try again!'
        });
    });
}

export const actLogin = (userData, history) => (dispatch) => {
    const loginRequest = Object.assign({}, userData);
    login(loginRequest)
    .then(response => {
        if (!response.data || !response.data.login) {
            // Failed Login
            dispatch({
                type: USER_LOGIN_ERR,
                payload: []
            });
            notification.success({
                message: 'Polling App',
                description: "You're successfully logged in.",
            });
        } else {
            console.log("Logined OK")
            localStorage.setItem(ACCESS_TOKEN, response.data.login.jwt);

            dispatch({
                type: USER_LOGIN_OK,
                payload: {username: response.data.login.username}
            });

            history.push('/');
        }
    }).catch(error => {
        dispatch({
            type: USER_LOGIN_ERR
        });
        notification.error({
            message: 'Polling App',
            description: 'Your Username or Password is incorrect. Please try again!'
        }); 
    });
};

export const actLogout = (history) => (dispatch) => {
    localStorage.removeItem(ACCESS_TOKEN);

    dispatch({
        type: USER_LOGOUT
    });

    history.push("/");
}
