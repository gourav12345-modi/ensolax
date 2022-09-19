import axios from 'axios'
// const baseURL= 'http://localhost:1300/api'
// post Routes
export const getAllPost = () => axios.get('/api/post');
export const createNewPost = (postData) => {
  const formData = new FormData();
  formData.append('description', postData.description)
  postData.selectedFile.map((file) => {
    formData.append('selectedFile', file);
  })
  return axios.post('/api/post/', formData, {headers: {'Content-Type':'multipart/form-data'}});
}

export const updatePost = (formData, postId) => {
  return axios.patch(`/api/post/${postId}`, formData, {headers: {'Content-Type':'multipart/form-data'}});
}
export const deletePost = (postId) => axios.delete(`/api/post/${postId}`);

// user Routes
export const register = (formData) => axios.post(`/api/user/register`, formData);
export const login = (formData) => axios.post(`/api/user/login`, formData);
export const logout = () => axios.post(`/api/user/logout`);
export const getUserinfo = () => axios.get('/api/user/getUserInfo');