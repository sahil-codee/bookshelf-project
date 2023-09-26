// src/redux/actions/authActions.js
export const setUsername = (username) => {
    return {
      type: 'SET_USERNAME',
      payload: username,
    };
  };
  
  export const setPassword = (password) => {
    return {
      type: 'SET_PASSWORD',
      payload: password,
    };
  };
  
  export const setEmail = (email) => {
    return {
      type: 'SET_EMAIL',
      payload: email,
    };
  };
  
  export const loginSuccess = (userData) => {
    return {
      type: 'LOGIN_SUCCESS',
      payload: userData,
    };
  };
  
  export const loginFailure = (error) => {
    return {
      type: 'LOGIN_FAILURE',
      payload: error,
    };
  };
  