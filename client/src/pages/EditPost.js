import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import { updatePost } from '../actions/post';
import Card from '@material-ui/core/Card';
import { useParams } from 'react-router-dom';
import Navigation from '../components/NavigationBar';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { useSelector, useDispatch } from 'react-redux';
import { createPost } from '../actions/post';
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100vw',
    width: '600px',
    backgroundColor: theme.palette.grey[100],
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '20px'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  textFilled: {
    width: '100%',
    height: '100%',
    resize: 'vertical', 
    border: '0px',
    outline: 'none'
  },
  uploadImage: {
    height: '250px'
  },
  addButton: {
    background: theme.palette.primary.light
  }
}));

function EditPost(props) {
  const { id } = useParams();
  const  { posts } = useSelector(state => state.post)
  const dispatch = useDispatch();
  const [postData, setPostData] = useState({
        description: '',
        selectedFile: []
  });

  const hiddenFileInput = React.useRef(null);
  const classes = useStyles();
  useEffect(() => {
      let post = {
        description: '',
        selectedFile: []
      }
      if(posts.length !== 0) {
        post = posts.filter((currentPost) => currentPost._id === id )
        if(post[0]){
          const imagesFile = [];
          post[0].images.map((imageUrl) => {
            imagesFile.push(axios({
                   url: `http://localhost:1300/uploads/${imageUrl}`,
                  method: 'GET',
                  responseType: 'blob', // important
              }).then((res) => {
                const arr = imageUrl.split("-");
                const s =  new File([res.data], `dsflj${arr[arr.length - 1]}`);
                return s;
              }))
          })

        
          Promise.all(imagesFile).then((value) => {
             setPostData({...post[0], selectedFile: value});
          })
        }
      }
  }, [])

  const handleChange = (event) => {
    setPostData({...postData, selectedFile: [...postData.selectedFile,event.target.files[0]]});
  };
  const handleImageUpload = (event) => {
    hiddenFileInput.current.click();
  }
  const handlePostUpdate = (e) => {
    e.preventDefault();
      const formData = new FormData();
      formData.append('description', postData.description)
      postData.selectedFile.map((file) => {
        formData.append('selectedFile', file);
      })
       dispatch(updatePost(formData, props.history, postData._id))
  }
  const handleRemoveImage = (e, file) => {
    const newSelectedFile = postData.selectedFile.filter((currentFile) => currentFile!==file);
    setPostData({...postData, selectedFile: newSelectedFile});
  }
  return (
    
      <div className="editPost">
         <Navigation />
          <Card className={classes.root} >
            <CardContent>
            <textarea placeholder="Share...." className={classes.textFilled} style={{minHeight:'100px'}} value={postData.description} onChange={(e) => {setPostData({...postData, description: e.target.value})}}/>
            <div style={{height:0, overflow: 'hidden'}}>
            <input type="file"
            ref={hiddenFileInput}
            onChange={handleChange}
						accept="image/*"
						multiple
					/>
            </div>
            <Carousel>
            {
           
             postData.selectedFile && postData.selectedFile.map((file, index) => (
               
              <div style={{position: 'relative', background:'gainboro', width: 'fit-Content', margin: 'auto'}} key={index}>
              {
                (file instanceof File) ?(
                  <img src={URL.createObjectURL(file)} className={classes.uploadImage} alt="ok" />
                ): (
                  <img  src={`http://localhost:1300/uploads/${file}`} className={classes.uploadImage} alt="ok "/> 
                )
              }
             <IconButton aria-label="post" style={{position: 'absolute', top: '0', right:'0', color: 'gray'}} onClick={(e)=>{handleRemoveImage(e,file)} }>
             <HighlightOffIcon />
             </IconButton>
            </div>
             ))
            }
             </Carousel>
            </CardContent>
           
            <CardActions>
              
              <IconButton aria-label="addImage" style={{color: 'rgb(211 21 188)'}} onClick={handleImageUpload}>
              <ImageIcon />
        </IconButton>
              <IconButton aria-label="post" style={{color: 'blue'}} onClick={handlePostUpdate} >
              <SendIcon/>
        </IconButton>
            </CardActions>
          </Card>
        </div>
  )
}

export default EditPost;
