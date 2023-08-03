import React, {useState} from 'react';
import { Container } from 'react-bootstrap';
import { API } from '../../config/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { toast } from 'react-toastify';

function StripeDetails() {
    const [publishKey, setPublishKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [showPublishKey, setShowPublishKey] = useState(false);
    const [showsetSecretKey, setShowsetSecretKey]=useState(false)
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("Token");

    const sendCardDetails = (e) => {
        setLoading(true);
        e.preventDefault();
        axios.post(API.BASE_URL + 'detail/', {
            publishable_key: publishKey,
            secret_key: secretKey,
        }, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(function (response) {
            console.log("Payment", response);
        })
        .catch(function (error) {
            console.log(error);
            if(error.response.data.publishable_key) {
                toast.warn("Publish key should not be empty", { autoClose: 1000 })
            }
            else if(error.response.data.secret_key) {
                toast.warn("Secret key should not be empty", { autoClose: 1000 })
            }
        })
        .finally(() => setLoading(false));
    }
  return (
    <div className='payment p-4 page'>
        {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
      <Container>
        <div className="payment-container d-flex flex-column ">
            <div className="heading my-5">
                <h2>Stripe Details</h2>
            </div>
            <div className="payment-details d-flex flex-column justify-content-center align-items-center m-auto">
                <h3 className='w-100 mb-4 fw-bold'>Enter the Details</h3>
                <form action="">
                    <div className="input-container d-flex align-items-center mb-5">
                        <label className='me-3' style={{minWidth: 100}}>Publish Key</label>
                        <input type={showPublishKey ? 'text' : 'password'} className='text-dark' value={publishKey} onChange={(e) => {setPublishKey(e.target.value)}} />
                        <FontAwesomeIcon
                            icon={showPublishKey ? faEyeSlash : faEye}
                            style={{
                                color: "#1b1b1b",
                                width: "20px",
                                height: "20px",
                            }}
                            onClick={() => setShowPublishKey(!showPublishKey)}
                        />
                    </div>
                    <div className="input-container d-flex align-items-center">
                        <label className='me-3' style={{minWidth: 100}}>Secret Key</label>
                        <input type={showsetSecretKey ? 'text' : 'password'} className='text-dark' value={secretKey} onChange={(e) => {setSecretKey(e.target.value)}} />
                        <FontAwesomeIcon
                            icon={showsetSecretKey ? faEyeSlash : faEye}
                            style={{
                                color: "#1b1b1b",
                                width: "20px",
                                height: "20px",
                            }}
                            onClick={() => setShowsetSecretKey(!showsetSecretKey)}
                        />
                    </div>

                    <button type='button' className="button-black button m-auto mt-5" onClick={(e) => {sendCardDetails(e)}}>Publish</button>
                </form>
            </div>
        </div>
      </Container>
    </div>
  )
}

export default StripeDetails
