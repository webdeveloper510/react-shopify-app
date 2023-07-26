import React from 'react';
import './pages.scss'

function Thankyou() {
  return (
    <div className='thank-you w-100'>
        <section className="login-main-wrapper">
            <div className="main-container">
          <div className="login-process">
              <div className="login-main-container">
                  <div className="thankyou-wrapper">
                      <h1><img src="http://montco.happeningmag.com/wp-content/uploads/2014/11/thankyou.png" alt="thanks" /></h1>
                        <p>for contacting us, we will get in touch with you soon... </p>
                        <a href="index.html">Back to home</a>
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
