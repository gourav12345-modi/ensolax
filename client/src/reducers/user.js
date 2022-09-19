import {  GET_USER_INFO_FAIL, GET_USER_INFO_REQUEST, GET_USER_INFO_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_REQUEST, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS } from "../constants";

const userReducer = (state= {}, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
      return { registerLoading: true }
    case REGISTER_SUCCESS:
      return { registerLoading: false, registerMessage: action.payload }
    case REGISTER_FAIL:
      return { registerLoading: false, registerError: action.payload }
    case LOGIN_REQUEST:
      return { loginLoading: true }
    case LOGIN_SUCCESS:
      return { loginLoading: false, user: action.payload, loginMessage: 'User LoggedIn' }
    case LOGIN_FAIL:
      return { loginLoading: false, loginError: action.payload }
    case LOGOUT_REQUEST:
      return { ...state , logoutLoading: true }
    case LOGOUT_SUCCESS:
      return {logoutMessage:"You are Logged out"}
    case GET_USER_INFO_REQUEST:
      return { userInfoLoading: true}
    case GET_USER_INFO_SUCCESS:
      return { userInfoLoading: false, user: action.payload }
    case GET_USER_INFO_FAIL:
      return { userInfoLoading: false, userInfoError: action.payload }
    default:
      return state;
  }
}

export default userReducer ;