import { CREATE_POST_FAIL, CREATE_POST_REQUEST, CREATE_POST_SUCCESS,UPDATE_POST_REQUEST, UPDATE_POST_SUCCESS, UPDATE_POST_FAIL, DELETE_POST_FAIL, DELETE_POST_REQUEST, DELETE_POST_SUCCESS, GET_POSTS_FAIL, GET_POSTS_REQUEST, GET_POSTS_SUCCESS } from "../constants";

const postReducer = (state = {posts:[]}, action) => {
  switch(action.type) {
    case GET_POSTS_REQUEST:
      return { allPostRequestLoading: true }
    case GET_POSTS_SUCCESS:
      return { allPostRequestLoading: false, posts: action.payload }
    case GET_POSTS_FAIL:
      return { allPostRequestLoading: false, allPostRequestError: action.payload }
    case CREATE_POST_REQUEST:
      return { ...state, createPostLoading: true }
    case CREATE_POST_SUCCESS:
      return {...state, createPostLoading: false, posts: [action.payload, ...state.posts]}
    case CREATE_POST_FAIL:
      return {...state, createPostError: action.payload }
    case UPDATE_POST_REQUEST:
      return { ...state, updatePostLoading: true }
    case UPDATE_POST_SUCCESS:
      const newUpdatedPost = [];
      state.posts.map((post) => {
        if(post._id !== action.payload._id)newUpdatedPost.push(post);
        else newUpdatedPost.push(action.payload);
      })
      return {...state, updatePostLoading: false, posts: newUpdatedPost}
    case UPDATE_POST_FAIL:
      return {...state, updatePostError: action.payload }
    case DELETE_POST_REQUEST:
      return {...state, deletePostLoading: true }
    case DELETE_POST_SUCCESS:
      const newPost = state.posts.filter(post => post._id !== action.payload._id )
      return {...state, deletePostLoading: false, posts: newPost}
    case DELETE_POST_FAIL:
      return {...state, deletePostLoading: false, deletePostError: action.payload }
    default:
      return state;
  }
}

export default postReducer;