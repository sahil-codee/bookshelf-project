// src/store/index.js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers'; // Import the combined reducers

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
