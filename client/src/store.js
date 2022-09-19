import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import postReducer from './reducers/post';
import userReducer from './reducers/user';
import snackbarReducer from './reducers/snackbar';

const initialState = {}

const reducer = combineReducers({
  userInfo: userReducer,
  post: postReducer, 
  snackbar: snackbarReducer,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__||compose;

const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;
