import {
    USER_LOGIN_OK,USER_LOGOUT,USER_LOGIN_ERR
  } from '../actions/UserActions'
  

const initialState = {
    currentUser: null, // {username, ...}
    isAuthenticated: false,
    isLoading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case USER_LOGIN_OK:
            return {
                currentUser: action.payload,
                isAuthenticated: true,
                isLoading: false
            };
        case USER_LOGIN_ERR:
            return {
                currentUser: null,
                isAuthenticated: false,
                isLoading: false
            };
        case USER_LOGOUT:
            return {
                currentUser: null,
                isAuthenticated: false,
                isLoading: false
            };
        default:
            return state;
    }
  }

  
