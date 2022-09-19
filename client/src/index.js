import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store';
import '@fontsource/roboto';
import './index.css';
import App from './App';
import { SnackbarProvider } from 'notistack';


ReactDOM.render(
  <Provider store={store} >
     <SnackbarProvider>
         <App />
    </SnackbarProvider>
  </Provider>,
  document.getElementById('root')
);


