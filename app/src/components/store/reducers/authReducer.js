// src/redux/reducers/authReducer.js
const initialState = {
  username: "",
  password: "",
  email: "",
  error: null,
  registrationEmail: "",
  registrationUsername: "",
  registrationPassword: "",
  reenterPassword: "",
  registrationError: "",
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USERNAME":
      return {
        ...state,
        username: action.payload,
      };
    case "SET_PASSWORD":
      return {
        ...state,
        password: action.payload,
      };
    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        username: action.payload,
        error: null,
      };
    case "LOGOUT":
      // Clear the user-related fields in the state when logging out
      return {
        ...initialState,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_REGISTRATION_EMAIL":
      return {
        ...state,
        registrationEmail: action.payload,
      };
    case "SET_REGISTRATION_USERNAME":
      return {
        ...state,
        registrationUsername: action.payload,
      };
    case "SET_REGISTRATION_PASSWORD":
      return {
        ...state,
        registrationPassword: action.payload,
      };
    case "SET_REENTER_PASSWORD":
      return {
        ...state,
        reenterPassword: action.payload,
      };
    case "SET_REGISTRATION_ERROR":
      return {
        ...state,
        registrationError: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
