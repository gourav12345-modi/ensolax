import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Carousel } from 'react-responsive-carousel';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Menu, MenuItem, Button } from '@material-ui/core';
import MessageIcon from '@material-ui/icons/Message';
import '../css/card.css';
import { deletePost } from '../actions/post';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    margin:'20px',
    marginBottom:'30px',
    backgroundColor: theme.palette.grey[100]
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
    cursor: 'pointer',
  },
}));

export default function Post({postData, history}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    e.stopPropagation()
    setAnchorEl(null);
  };

  const editHandler = (e) => {
    handleClose(e);
    history.push(`/editPost/${postData._id}`)
  }

  const handleDelete = (e) => {
    handleClose(e);
    dispatch(deletePost(postData._id));
  }

  return (
    <React.Fragment>
    
    <Card className={classes.root} >
      <CardHeader
        avatar={
          <Link to={`/user/${postData.author._id}`}>
          <Avatar aria-label="recipe" className={classes.avatar}>
            {postData.author.name.charAt(0)}
          </Avatar>
          </Link>
          
        }
        action={
          <IconButton aria-label="settings" onClick={handleClick}>

            <MoreVertIcon />
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={editHandler}>Edit</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
              <MenuItem onClick={handleClose}>Close</MenuItem>
            </Menu>
          </IconButton>
        }
        title={postData.author.name}
        subheader={"September 14, 2016"}
        className={'Hello'}
      />
      <CardContent>
       {
         postData.description && ( <Typography variant="body2" color="textSecondary" component="p" style={{textAlign:'left'}}>
         {postData.description}
       </Typography>)
       }
      </CardContent>
      <Carousel>
      {
        postData.images && postData.images.map((image) => (
          <CardMedia
            id={image}
            className={classes.media}
            image={`http://localhost:1300/uploads/${image}`}
            title="Paella dish"
            key={`http://localhost:1300/uploads/${image}`}
          />
        ))
      }
      
      </Carousel>
     
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton aria-label="comment">
          <MessageIcon />
        </IconButton>
        
      </CardActions>
     
    </Card>
    </React.Fragment>
  );
}
