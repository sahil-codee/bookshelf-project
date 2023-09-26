// src/redux/reducers/authReducer.js
const initialState = {
    user: null,
    error: null,
    username: '',
    password: '',
    email: '', // Add the email field
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USERNAME':
        return {
          ...state,
          username: action.payload,
        };
      case 'SET_PASSWORD':
        return {
          ...state,
          password: action.payload,
        };
      case 'SET_EMAIL':
        return {
          ...state,
          email: action.payload,
        };
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          user: action.payload,
          error: null,
        };
      case 'LOGIN_FAILURE':
        return {
          ...state,
          user: null,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;
  