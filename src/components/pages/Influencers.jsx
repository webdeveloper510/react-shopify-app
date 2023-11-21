import './pages.scss';
import Verified from '../../assests/img/check.png'
import React, { useEffect, useRef, useState } from 'react';
import { getInfluencerList, payInfluencer } from '../../config/Api';
import { useNavigate } from 'react-router-dom';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Modal } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';

const Influencers = () => {

    //-------Constants ------
    const navigate = useNavigate();

    //-------States----------
    const [loading, setLoading] = useState(false);
    const [paidId, setPaidId] = useState('');
    const [open_modal, setOpenModal] = useState({ toggle: null, value: { name: null, cost: null }, id: null });
    const [influencer_list, setInfluencerList] = useState(null);
    const [is_paid, setIsPaid] = useState(false)

    //-------Handlers--------
    useEffect(() => {
        setLoading(true);
        getInfluencerList().then(res => {
            setLoading(false);
            let data=res?.data
            if (res?.data) {
                setInfluencerList(res.data);
            }
        })
    }, []);

    const handlePay = (item) => {
        if (item.paid_status === true) {
        
            navigate(`/new-campaign/`, { state: { influencer_id: item?.influencerid_id, id: item?.id } })
        } else {
            setOpenModal({ toggle: true, value: { name: item?.fullname, cost: item?.influencerid_id__fee || "40" }, id: item?.influencerid_id })
        }
    }

    const handlePrev = () => {
        navigate(-1)
    }
console.log('influencer_list =======>>>>>>>>>>>>>>' , influencer_list)

    // -------- Return --------
    return (
        <>
            <div className="campaign-new p-4 page">
                {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
                <div className="campaign-new-container d-flex flex-column justify-content-start align-items-center">
                    <button onClick={() => handlePrev()} className="button button-black back justify-content-start w-100 my-4">
                        <FontAwesomeIcon icon={faChevronLeft} style={{ color: "#000", width: "15px", height: "15px", marginRight: 5 }} />
                        Back
                    </button>
                    <div className='w-100 influencer-list px-5'>
                        <h3>Influencer List</h3>
                        {influencer_list?.length > 0 ? (
                            <>
                                <div className='influencer-list-main'>
                                    {influencer_list?.map((item, index) => (
                                        <div key={index} className='influencer-list-container d-flex align-items-center justify-content-between'>
                                            <div className='d-flex align-items-center col-md-4'>
                                                <img src={item?.image} alt='profile-pic' />
                                                <div className='ms-4'>
                                                    <p className='d-flex align-items-center'>{item?.fullname} {item?.isverified === true ? <img src={Verified} alt='verified' style={{ width: 18, height: 'fit-content', marginLeft: 7 }} /> : ""}</p>
                                                    <span>@{item?.username}</span>
                                                    <p style={{ fontStyle: "italic" }} >{index % 2 == 0 ? "Story" : "Post"}</p>
                                                </div>
                                            </div>
                                            <p className='d-flex flex-column align-items-center col-md-3'><strong>{(item?.follower / 1000000).toFixed(2)} M </strong> <span>Followers</span> </p>
                                            <p className='d-flex flex-column align-items-center col-md-3'><strong>{(item?.engagements / 1000000).toFixed(2) + "M"}<span className='ms-1'>({item.engagement_rate.toFixed(2)}%)</span></strong> <span>Engagement</span> </p>
                                            <div className='d-flex flex-column align-items-end col-md-2'>
                                                <strong>AED {item?.influencerid_id__fee || "N/A"}</strong>

                                                {item?.influencerid_id__fee == null ? (
                                                    <>
                                                    </>
                                                ) : (
                                                    <>
                                                     {item.paid_status === true ? (
                                                        <>
                                                            <button className='btn btn-dark' onClick={() => { handlePay(item) }}>
                                                            {is_paid === item?.influencerid_id ? "Continue" : "Pay"}
                                                            </button>
                                                        </>
                                                        ) : (
                                                        <>
                                                        {item.paid_status === false && item.paid_status == true ? (
                                                            <>
                                                                <button className='btn btn-dark' onClick={() => { handlePay(item) }}>
                                                                {is_paid === item?.influencerid_id ? "Continue" : "Pay"}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                               
                                                         <button className='btn btn-dark' disabled>
                                                                    Pay
                                                                </button>
                                                            </>
                                                        )}
                                                        </>
                                                     )}
                                                    </>
                                                )}
                                               
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : <h2 className='my-4 text-center w-100'>No Influencers</h2>}

                    </div>
                </div>
            </div>
            <PaymentModal data={open_modal} handler={(value) => { setOpenModal(value) }} setIsPaid={setIsPaid} />
        </>
    )
}

const PaymentModal = ({ data, handler, setIsPaid }) => {
    const payRef = useRef(null)
    const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`)

    return (
        <Modal className="modal-card" show={data?.toggle} onHide={() => handler({ toggle: false, value: null, id: null })} centered backdrop="static">
            <Modal.Header>
                <Modal.Title className='fs-5'>Payment </Modal.Title>
            </Modal.Header>
            <Modal.Body >

                <div className='my-4'>
                    <Elements stripe={stripePromise}>
                        <InputElement payRef={payRef} handler={handler} data={data} setIsPaid={setIsPaid} />
                    </Elements>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => handler({ toggle: false, value: null, id: null })} >
                    Cancel
                </Button>
                <Button type="submit" variant="primary" onClick={() => payRef.current.click()}>
                    Pay
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

const InputElement = ({ payRef, handler, data, setIsPaid }) => {

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (elements == null) {
            return;
        }
        const token = await stripe.createToken(elements.getElement(CardElement))
        if (token.token) {
            payInfluencer({ token: token?.token?.id, influencerid_id: data.id, influencerid_id__fee: data?.value?.cost }).then(res => {
                setIsPaid(data?.id)
                console.log(data?.id)
                // setPaidId(data?.id)
                toast.success('Payment Success', { autoClose: 1000 })
            })
            handler({ toggle: false, value: null, id: null })
        } else if (token.error.code === "card_declined") {
            toast.error("Card Declined")
        } else {
            toast.error("Enter card details to continue")
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement options={{ hidePostalCode: true }} />

            <button type="submit" ref={payRef} style={{ display: "none" }} disabled={!stripe || !elements}>
                Pay
            </button>
        </form>
    )
}

export default Influencers