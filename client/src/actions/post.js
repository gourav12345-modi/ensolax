import * as api from '../api'
import {
  enqueueSnackbar as enqueueSnackbarAction,
} from './snackBar';

import { CREATE_POST_FAIL, CREATE_POST_REQUEST, CREATE_POST_SUCCESS,UPDATE_POST_REQUEST, UPDATE_POST_SUCCESS, UPDATE_POST_FAIL, DELETE_POST_FAIL, DELETE_POST_REQUEST, DELETE_POST_SUCCESS, GET_POSTS_FAIL, GET_POSTS_REQUEST, GET_POSTS_SUCCESS } from '../constants';

const createPost = (postData, setPostData) => async (dispatch, state) => {
  dispatch({ type: CREATE_POST_REQUEST })
  try {
    const { data } = await api.createNewPost(postData);
    setPostData({
      description: '',
      selectedFile: []
    })
    data.author = {_id: state().userInfo.user.id, name: state().userInfo.user.name}
    dispatch({ type: CREATE_POST_SUCCESS, payload: data })
    dispatch(enqueueSnackbarAction( 'Post created succefully', 'success', ));
    
  } catch (error) {
    dispatch(enqueueSnackbarAction( error.response.data.message, 'error' ));
    dispatch({ type: CREATE_POST_FAIL, payload: error.response.data.message })
    console.log(error);
  }
}

const getAllPost = () => async (dispatch) => {
  dispatch({ type: GET_POSTS_REQUEST })
  try {
    const { data } = await api.getAllPost();
    dispatch({ type: GET_POSTS_SUCCESS, payload: data })
  } catch (error) {
    dispatch(enqueueSnackbarAction( error.response.data.message, 'warning' ))
    dispatch({ type: GET_POSTS_FAIL, payload: error.response.data.message })
    console.log(error);
  }
}

const updatePost = (formData, history, postId) => async (dispatch, state) => {
  dispatch({ type: UPDATE_POST_REQUEST })
  try {

    const { data } = await api.updatePost(formData, postId);
    data.author = {_id: state().userInfo.user.id, name: state().userInfo.user.name}
    dispatch({ type: UPDATE_POST_SUCCESS, payload: data })
    dispatch(enqueueSnackbarAction( 'Post updated succefully', 'success', ));
    history.push('/');
    
  } catch (error) {
    dispatch(enqueueSnackbarAction( error.response.data.message, 'error' ));
    dispatch({ type: UPDATE_POST_FAIL, payload: error.response.data.message })
    console.log(error);
  }
}

const deletePost = (postId) => async (dispatch) => {
  dispatch({ type: DELETE_POST_REQUEST })
  try {
    await api.deletePost(postId);
    dispatch({ type: DELETE_POST_SUCCESS, payload: {_id: postId} });
    dispatch(enqueueSnackbarAction( 'Post deleted', 'success' ));
  } catch (error) {
    dispatch(enqueueSnackbarAction( error.response.data.message, 'error' ));
    dispatch({ type: DELETE_POST_FAIL, payload: error.response.data.message })
    console.log(error);
  }
}

export {
  createPost,
  getAllPost,
  updatePost,
  deletePost
}