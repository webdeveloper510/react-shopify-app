import React, {useEffect} from 'react';
import axios from 'axios';
import { API } from '../../config/Api';
import { useNavigate } from 'react-router-dom';
import './pages.scss';

function Thankyou() {
  const session_id = localStorage.getItem("Session_Id")
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(API.BASE_URL + `success/?session_id=${session_id}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
      .then(function (response) {
        console.log("Success", response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [token]);
  return (
    <div className='thank-you w-100'>
        <section className="login-main-wrapper">
            <div className="main-container">
          <div className="login-process">
              <div className="login-main-container">
                  <div className="thankyou-wrapper">
                      <h1><img src="http://montco.happeningmag.com/wp-content/uploads/2014/11/thankyou.png" alt="thanks" /></h1>
                        <p>for contacting us, we will get in touch with you soon... </p>
                        <a href="https://admin.shopify.com/store/marketplacee-app/apps/marketplace-54">Back to home</a>
                        <div className="clr"></div>
                    </div>
                    <div className="clr"></div>
                </div>
            </div>
            <div className="clr"></div>
            </div>
        </section>
    </div>
  )
}

export default Thankyou
