import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { API } from '../../config/Api';

function Subscription() {
    const token = localStorage.getItem("Token");
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
      setTimeout(() => {
      console.log("TOKEN APIIII")
      axios.post(API.BASE_URL + 'get/token/', {
          shop_name: localStorage.getItem('shop_url')
      })
      .then(function (response) {
          console.log("Shop Token in Subscription page", response);
          localStorage.setItem("Token", response.data.user_token);
      })
      .catch(function (error) {
          console.log(error);
      })
  }, 5500)

  }, [])
   
    const handleSubscription = (plan) => {
        setLoading(true);
        axios.post(API.BASE_URL + 'checkout_session/', {
            plan: plan
        }, {
            headers: {
                Authorization: `Token ${token}`
        }})
        .then(function (response) {
            console.log("BuySubscription", response);
            localStorage.setItem("Session_Id", response.data.id);
            window.open(response.data.session_url, '_blank');
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(() => setLoading(false));
    }

    useEffect(() => {
      setTimeout(() => {
      const checkSubscription = () => {
        if (localStorage.getItem("Session_Id") != null || localStorage.getItem("Session_Id") != '' || localStorage.getItem("Session_Id") != undefined) {
          axios.get(API.BASE_URL + 'checksubscritpion/', {
            headers: {
              Authorization: `Token ${token}`
            }
          })
            .then(function (response) {
              console.log("Check Subscription", response);
              if (response.data.message === "please buy subscription") {
                navigate('/dashboard');
              }
              else {
                navigate('/overview');
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          navigate('/overview');
        }
      };
  
      checkSubscription();
    }, 6000)
    }, [navigate]);
  return (
    <div className='subscription w-100'>
        {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-4 col-md-6 mb-3">
                    <div className="card py-4 px-lg-5 h-100">
                    <div className="card-body d-flex flex-column">
                        <div className="text-center">
                        <img src="https://drive.google.com/uc?export=view&id=1HswgEjS9kRoAKUDOMmDhnhUyyah7wBW9" className="img-fluid  mb-5" alt="Websearch" />
                        </div>

                        <div className="card-title mb-4 text-center fs-2">Monthly</div>
                        <div className="pricing">
                        <ul className="list-unstyled">
                            <li className="mb-3">
                            <i className="fas fa-check-circle icon-color"></i>
                            <span className="small ms-3">1 Member Only</span>
                            </li>
                            <li className="mb-3">
                            <i className="fas fa-check-circle icon-color"></i>
                            <span className="small ms-3">Available Storage 100GB</span>
                            </li>
                        </ul>


                        </div>
                        <div className="text-center mt-auto mb-4">
                        <span className="fw-bold fs-2 ">$7</span>/month
                        </div>
                        <div className="text-center"><button type="button" className="button button-black m-auto" onClick={() => {handleSubscription('price_1NY4xAGym3ZLfIjekcIg3I1E')}}>Choose Plan</button></div>

                    </div>
                    </div>

                </div>

                <div class="col-lg-4 col-md-6 mb-3">
                    <div class="card py-4 px-lg-5 h-100">
                    <div class="card-body d-flex flex-column">
                        <div class="text-center">
                        <img src="https://drive.google.com/uc?export=view&id=1HswgEjS9kRoAKUDOMmDhnhUyyah7wBW9" class="img-fluid  mb-5" alt="Websearch" />
                        </div>

                        <div class="card-title mb-4 text-center fs-2">6 Months</div>
                        <div class="pricing">
                        <ul class="list-unstyled">
                            <li class="mb-3">
                            <i class="fas fa-check-circle icon-color"></i>
                            <span class="small ms-3">2-3 Members</span>
                            </li>
                            <li class="mb-3">
                            <i class="fas fa-check-circle icon-color"></i>
                            <span class="small ms-3">Available Storage 500GB</span>
                            </li>
                            <li class="mb-3">
                            <i class="fas fa-check-circle icon-color"></i>
                            <span class="small ms-3">Free Hosting</span>
                            </li>
                        </ul>


                        </div>
                        <div class="text-center mt-auto mb-4">
                        <span class="fw-bold fs-2 ">$11</span>/month
                        </div>
                        <div class="text-center"><button type="button" class="button button-black m-auto" onClick={() => {handleSubscription('price_1NY4xlGym3ZLfIjeIDSrLJQQ')}}>Choose Plan</button></div>

                    </div>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6 mb-3">
                    <div class="card py-4 px-lg-5 h-100">
                    <div class="card-body d-flex flex-column">
                        <div class="text-center">
                        <img src="https://drive.google.com/uc?export=view&id=1HswgEjS9kRoAKUDOMmDhnhUyyah7wBW9" class="img-fluid  mb-5" alt="Websearch" />
                        </div>

                        <div class="card-title mb-4 text-center fs-2">Annual</div>
                        <div class="pricing">
                        <ul class="list-unstyled">
                            <li class="mb-3">
                            <i class="fas fa-check-circle icon-color"></i>
                            <span class="small ms-3">4-7 Members</span>
                            </li>
                            <li class="mb-3">
                            <i class="fas fa-check-circle icon-color"></i>
                            <span class="small ms-3">Available Storage 2TB</span>
                            </li>
                            <li class="mb-3">
                            <i class="fas fa-check-circle icon-color"></i>
                            <span class="small ms-3">Free Hosting</span>
                            </li>
                            <li class="mb-3">
                            <i class="fas fa-check-circle icon-color"></i>
                            <span class="small ms-3">Free Domains</span>
                            </li>
                        </ul>


                        </div>
                        <div class="text-center mt-auto mb-4">
                        <span class="fw-bold fs-2 ">$15</span>/month
                        </div>
                        <div class="text-center"><button type="button" class="button button-black m-auto" onClick={() => {handleSubscription('price_1NY4yRGym3ZLfIjeyWUZ1Ndi')}}>Choose Plan</button></div>

                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Subscription
