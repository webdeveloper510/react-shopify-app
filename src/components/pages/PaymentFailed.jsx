import React from 'react';
import './pages.scss';
import Error from '../../assests/img/error.png'; 

function PaymentFailed() {
  return (
    <div className='payment-failed w-100'>
        <div className="container">
            <div className="ui middle aligned center aligned grid">
                <div className="ui eight wide column">
                <form className="ui large form">   
                    <div className="ui icon negative message">
                        <img src={Error} alt="error" />
                        <div className="content text-center">
                        <div className="header">
                            Oops! Something went wrong.
                        </div>
                        <p>While trying to reserve money from your account</p>
                        </div>
                        
                    </div>
                
                    <a href="https://admin.shopify.com/store/marketplacee-app/apps/marketplace-54" className="button button-black m-auto mt-3">Try again</a>
                
                </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PaymentFailed
