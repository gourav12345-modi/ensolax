import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Navigation from '../components/NavigationBar'
import Post from '../components/Post'
import { TextareaAutosize } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { createPost } from '../actions/post';
const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '100%',
    backgroundColor: theme.palette.grey[100]
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

function Home(props) {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.userInfo)
  const {posts} = useSelector(state => state.post)
  const [postData, setPostData] = useState({
    description: '',
    selectedFile: []
  })
  const [currentSliderFile, setCurrentSliderFile] = useState(0)
  const hiddenFileInput = React.useRef(null);
  const classes = useStyles();

  const handleChange = (event) => {
    if(!event.target.files[0]) return ;
    const newUpdateImages = [...postData.selectedFile,event.target.files[0]];
    setCurrentSliderFile(newUpdateImages.length-1)
    setPostData({...postData, selectedFile: newUpdateImages});
  };
  const handleImageUpload = (event) => {
    hiddenFileInput.current.click();
  }
  const handlePostSubmit = (e) => {
    e.preventDefault();
    dispatch(createPost(postData, setPostData))
  }

  const handleRemoveImage = (e, file) => {
    const newSelectedFile = postData.selectedFile.filter((currentFile, index, array) => {
      if(currentFile === file ) {
        console.log(index, array.length)
        if(index === array.length-1 && array.length>=2)
        setCurrentSliderFile(array.length-2)
        else  {
          if(index === 0) setCurrentSliderFile(array.length-2);
          else setCurrentSliderFile(index-1)
        }
      } 
     
     return currentFile!==file
    });
    setPostData({...postData, selectedFile: newSelectedFile});
  }
  return (
    <div className="home">
      <Navigation />
      <div className="container" style={{ maxWidth: '700px', marginLeft: 'auto', marginRight:'auto', marginTop: '20px', }}>
        {
          user? (
            <div className="addPost" style={{ display: 'flex' }}>
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
            <Carousel selectedItem={currentSliderFile}  infiniteLoop={true}   >
            {
            
             postData.selectedFile && postData.selectedFile.map((file, index) => (
              <div style={{position: 'relative', background:'gainboro', width: 'fit-Content', margin: 'auto'}} key={index}>
             <img  src={URL.createObjectURL(file)} className={classes.uploadImage} alt="ok "/> 
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
              <IconButton aria-label="post" style={{color: 'blue'}} onClick={handlePostSubmit} >
              <SendIcon/>
        </IconButton>
            </CardActions>
          </Card>
        </div>
          ):(
            <div className="comment" >
               <Card className={classes.root} style={{height:'150px'}}>
               <Typography variant="h6" color="textSecondary" component="h2" >
                 Welcome to ensolax here you can see some funny , amazing stuffs . if you want to post something please 
           <Link to='/login'>Login</Link>
          
           </Typography>
               </Card>
            </div>
          )
        }
        <div className="posts" style={{ paddingTop: '30px', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' , alignItems: 'flex-start'}}>
          {
        
           posts && posts.map((postData) => (
              <Post postData={postData} id={postData._id} key={postData._id} history={props.history} />
           ))
          }
        </div>
      </div>
    </div>
  )
}

export default Home
