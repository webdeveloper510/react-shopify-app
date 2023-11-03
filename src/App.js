import React, { useEffect, useState } from 'react';
import Routing from './routes/Routes';
import GoToTop from './GoToTop';
import { getToken, verifySubscription } from './config/Api';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import { useNavigate } from 'react-router-dom';

function App() {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const url = window.location.href;
    const queryString = url.split('?')[1];
    const urlParams = new URLSearchParams(queryString);
    const searchString = (urlParams.get('shop')).split("#");
    const token = searchString[0]
    localStorage.setItem('shop_url', token)
    setLoading(true)
    getToken({ shop_name: token }).then(res => {
      if (res?.user_token) {
        localStorage.setItem("Token", res?.user_token)
        verifySubscription(res?.user_token).then(resp => {
          setLoading(false)
          if (resp?.message === "Subscription already buyed") {
            navigate("/overview")
          } else {
            navigate("/dashboard")
          }
        })
      } else {
        navigate("/dashboard")
        setLoading(false)
      }
    })
  }, [])

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