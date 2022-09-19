import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import EditPost from './pages/EditPost';
import { useDispatch } from 'react-redux';
import { getUserInformation } from './actions/user';
import { useEffect } from 'react';
import { getAllPost } from './actions/post';
import useNotifier from './components/useNotifier';

function App() {
  useNotifier();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserInformation());
    dispatch(getAllPost())
  }, []);

  return (
   
      <div className="App">
        <Router>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/user/:id' component={UserProfile} />
            <Route path='/editPost/:id' component={EditPost} />
          </Switch>
        </Router>
      </div>

  );
}

export default App;
