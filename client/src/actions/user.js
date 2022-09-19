import { getUserinfo, login, logout, register } from "../api"
import {
  enqueueSnackbar as enqueueSnackbarAction,
} from './snackBar';
import { GET_USER_INFO_FAIL, GET_USER_INFO_REQUEST, GET_USER_INFO_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS } from "../constants";

const registerUser = (formData, history) => async (dispatch) => {
  try{
    dispatch({type: REGISTER_REQUEST });
    const { data } = await register(formData);
    dispatch({type: REGISTER_SUCCESS, payload: data.message});
    dispatch(enqueueSnackbarAction( 'You have registered.', 'success' ));
    history.push('/login');
  } catch(error) {
    dispatch({type: REGISTER_FAIL, payload: error.response.data.message});
  }
}

const loginUser = (formData, history) => async (dispatch) => {
  try{
    dispatch({type: LOGIN_REQUEST});
    const { data } = await login(formData);
    dispatch({type: LOGIN_SUCCESS, payload: data})
    dispatch(enqueueSnackbarAction( `Logged In as ${data.name}`, 'success' ));
    history.push('/')
  } catch(error) {
    
      dispatch({type: LOGIN_FAIL , payload: error.response.data.message})
  }
}


const logoutUser = () => async (dispatch) => {
  try{
    await logout();
    dispatch({type: LOGOUT_SUCCESS});
  } catch(error) {
    dispatch(enqueueSnackbarAction( error.response.data.message,'warning' ))
    dispatch({type: LOGOUT_FAIL, payload : error.response.data.message});
  }
}

const getUserInformation = () => async (dispatch) => {
  try{
    dispatch({type: GET_USER_INFO_REQUEST});
    const {data} = await getUserinfo();
    dispatch({type: GET_USER_INFO_SUCCESS, payload: data})
  } catch(error) {
    dispatch({type: GET_USER_INFO_FAIL})
  }
}

export { registerUser, loginUser, logoutUser, getUserInformation}


