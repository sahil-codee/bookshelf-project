// src/redux/actions/authActions.js
export const setUsername = (username) => {
  return {
    type: "SET_USERNAME",
    payload: username,
  };
};

export const setPassword = (password) => {
  return {
    type: "SET_PASSWORD",
    payload: password,
  };
};

export const setEmail = (email) => {
  return {
    type: "SET_EMAIL",
    payload: email,
  };
};

// Update the loginSuccess action creator to accept 'username'
export const loginSuccess = (username) => {
  return {
    type: "LOGIN_SUCCESS",
    payload: username, // Change 'userData' to 'username'
  };
};

export const loginFailure = (error) => {
  return {
    type: "LOGIN_FAILURE",
    payload: error,
  };
};

export const LOGOUT = "LOGOUT";

export const logout = () => {
  return {
    type: LOGOUT,
  };
};


export const setRegistrationEmail = (email) => ({
  type: "SET_REGISTRATION_EMAIL",
  payload: email,
});

export const setRegistrationUsername = (username) => ({
  type: "SET_REGISTRATION_USERNAME",
  payload: username,
});

export const setRegistrationPassword = (password) => ({
  type: "SET_REGISTRATION_PASSWORD",
  payload: password,
});

export const setReenterPassword = (reenterPassword) => ({
  type: "SET_REENTER_PASSWORD",
  payload: reenterPassword,
});

export const setRegistrationError = (error) => ({
  type: "SET_REGISTRATION_ERROR",
  payload: error,
});