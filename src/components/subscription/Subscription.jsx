import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { API, verifySubscription } from '../../config/Api';


const plan_list = [
  {
    duration: "Monthly",
    member_count: "1 Member Only",
    storage: "100GB",
    extra_benefits: [],
    cost_per_month: process.env.REACT_APP_MONTHLY_PLAN_VALUE,
    plan_id: process.env.REACT_APP_MONTHLY_PLAN_ID
  },
  {
    duration: "6 Months",
    member_count: "2-3 Members",
    storage: "500GB",
    extra_benefits: ["Free Hosting"],
    cost_per_month: process.env.REACT_APP_HALFYEAR_PLAN_VALUE,
    plan_id: process.env.REACT_APP_HALFYEAR_PLAN_ID
  },
  {
    duration: "ANNUAL",
    member_count: "4-7 Members",
    storage: "2TB",
    extra_benefits: ["Free Hosting", "Free Domains"],
    cost_per_month: process.env.REACT_APP_ANNUAL_PLAN_VALUE,
    plan_id: process.env.REACT_APP_ANNUAL_PLAN_ID
  },
]

const Subscription = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const handleSubscription = (plan) => {
    setLoading(true);
    axios.post(API.BASE_URL + 'checkout_session/', {
      plan: plan
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
      .then(function (response) {
        localStorage.setItem("Session_Id", response.data.id);
        window.open(response.data.session_url, '_blank');
      })
      .catch(function (error) {
      })
      .finally(() => setLoading(false));
  }

  // useEffect(() => {
  //   setLoading(true)
  //   let session_id = localStorage.getItem("session_id");
  //   if (session_id === undefined || null || "null") {
  //     verifySubscription().then((res) => {
  //       setLoading(false)
  //       if (res.message === "Subscription already buyed") {
  //         navigate('/overview');
  //       }
  //     })
  //   } else {
  //     setLoading(false)
  //     navigate('/overview');
  //   }
  // }, [navigate]);

  return (
    <div className='subscription w-100'>
      {loading ? (
        <div className='d-flex loader-container flex-column'>
          <div className='loader'>
            <span></span>
          </div>
          <p className='text-white'>Processing...</p>
        </div>
      ) : (
        <div className="container mt-5">
          <div className="row">
            {
              plan_list?.length > 0 && plan_list?.map((item, index) => {
                return (
                  <div key={index} className="col-lg-4 col-md-6 mb-3">
                    <div className="card py-4 px-lg-5 h-100">
                      <div className="card-body d-flex flex-column">
                        <div className="text-center">
                          <img src="https://drive.google.com/uc?export=view&id=1HswgEjS9kRoAKUDOMmDhnhUyyah7wBW9" className="img-fluid  mb-5" alt="Websearch" />
                        </div>
                        <div className="card-title mb-4 text-center fs-2">{item?.duration}</div>
                        <div className="pricing">
                          <ul className="list-unstyled">
                            <li className="mb-3">
                              <i className="fas fa-check-circle icon-color"></i>
                              <span className="small ms-3">{item?.member_count}</span>
                            </li>
                            <li className="mb-3">
                              <i className="fas fa-check-circle icon-color"></i>
                              <span className="small ms-3">Available Storage {item?.storage}</span>
                            </li>
                            {
                              item?.extra_benefits?.length > 0 && item?.extra_benefits?.map((feature, i) => {
                                return (
                                  <li key={i} class="mb-3">
                                    <i class="fas fa-check-circle icon-color"></i>
                                    <span class="small ms-3">{feature}</span>
                                  </li>
                                )
                              })
                            }
                          </ul>
                        </div>
                        <div className="text-center mt-auto mb-4">
                          <span className="fw-bold fs-2 ">${item?.cost_per_month}</span>/month
                        </div>
                        <div className="text-center"><button type="button" className="button button-black m-auto" onClick={() => { handleSubscription(item.plan_id) }}>Choose Plan</button></div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      )}

    </div>
  )
}

export default Subscription
