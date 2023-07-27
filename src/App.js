import React, {useEffect, useState, useContext} from 'react';
import Routing from './routes/Routes';
import GoToTop from './GoToTop';
import './App.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import UserContext from './components/context/UserContext';
import axios from 'axios';
import { API } from './config/Api';


import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {image, name} = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const token = localStorage.getItem('Token')
  const location = useLocation();
  const history = useNavigate();
  console.log('Current route:', location.pathname);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      console.log('///////////////////////////////');
      const url = window.location.href;
      console.log(url);
      const queryString = url.split('?')[1];
      const urlParams = new URLSearchParams(queryString);
      const token = urlParams.get('shop');
      console.log(token);
      localStorage.setItem('shop_url', token)
      console.log('///////////////////////////////');
    }, 4000)
  }, [])

  useEffect(() => {
    if(!localStorage.getItem("Session_Id")) {
      axios.get(API.BASE_URL + 'checksubscritpion/', {
        headers: {
          Authorization: `Token ${token}`
        }
      })
        .then(function (response) {
          console.log("Check Subscription", response);
          if (response.data.message === "please buy subscription") {
            history('/dashboard');
          }
          else {
            history('/overview');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    
  }, [history]);
  console.log("NAMEEEEE", name)
  console.log("Image", image)
  return (
    <div className="App">
      {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
      <Routing />
      <GoToTop />
      <ToastContainer autoclose={2000} />
    </div>
  );
}

export default App;