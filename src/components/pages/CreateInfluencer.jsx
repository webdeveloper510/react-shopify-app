import React, { useState, useRef } from 'react';
import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getDataByProduct, getInfluencer, getProductList, payInfluencer } from '../../config/Api';
import { CheckPicker } from "rsuite"
import "rsuite/dist/rsuite.css";
import axios from 'axios';
import { API } from '../../config/Api';
import { toast } from 'react-toastify';
import { Button, Modal } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
// import { getInfluencerList,  } from '../../config/Api';

const CreateInfluencer = () => {
    const location = useLocation()
    const state = location.state;
  
    // Now, you can access the state properties
    const influencerId = state?.influencer_id;
    const name = state?.name;
    //-------Constants ------
    const { id } = useParams()
    const influencer_id = location.state !== null ? location?.state?.influencer_id : null;
    const adminFee = (location.state.cost * location.state.adminFee) / 100;;
    const cost = location.state.cost;
    const ids = location.state !== null ? location?.state?.id : null;
    const navigate = useNavigate();
    const today = new Date().toISOString().substr(0, 10);
    const token = localStorage.getItem("Token");
    const [open_modal, setOpenModal] = useState({ toggle: null, value: { name: null, cost: null }, id: null });
    const [is_paid, setIsPaid] = useState(false)
    //-------States----------
    const [paystat, setPaystat] = useState(false);
    const [form_data, setFormData] = useState({ campaign_name: '', influencer_visit: '', date: '', end_date: '', product: [], description: '', product_name: [], influencer_name: '', coupon: [] })
    const [influencer, setInfluencer] = useState(null)
    const [product_list, setProductList] = useState([])
    const [coupon_list, setCouponList] = useState({ coupons: [], product_id: [] })
    const [url_list, setUrlList] = useState([])
    const [selected_coupon_ids, setCoupon_ids] = useState([])
    const [selected_products, setSelectedProducts] = useState([])
    const [selected_coupons, setSelectedCoupon] = useState([])
    const [errors, setErrors] = useState({});

console.log('id=================>>>>>>',url_list)
console.log('Form is valid:', state);

    //-------Handlers--------


    const PaymentModal = ({ data, handler, setIsPaid }) => {
        const payRef = useRef(null)
        const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`)

        return (
            <Modal className="modal-card" show={data?.toggle} onHide={() => handler({ toggle: false, value: null, id: null })} centered backdrop="static">
                <Modal.Header>
                    <Modal.Title className='fs-5'>Payment </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {paystat == true ? (
                        <>
                            <div className='my-4'>
                                <Elements stripe={stripePromise}>
                                    <InputElement payRef={payRef} handler={handler} data={data} setIsPaid={setIsPaid} />
                                </Elements>
                            </div>
                        </>
                    ) : (
                        <>
                            <table className='coupon-table w-100  table-striped'>
                                <tr className='table-heading'>
                                    <th className='border rounded-4 rounded-bottom' colSpan={2}>Payment Details : -</th>
                                </tr>
                                <tr>
                                    <td>Influncer fee : </td>
                                    <td>{cost} AUD</td>
                                </tr>
                                <tr>
                                    <td>Admin Fee : </td>
                                    <td>{adminFee} AUD</td>
                                </tr>
                                <tr>
                                    <td>Total Pay : </td>
                                    <td>{cost + adminFee} AUD</td>
                                </tr>
                            </table>
                            <div className='text-center mt-4'>
                                <Button type="submit" variant="primary" onClick={() => setPaystat(true)}>
                                    Contine
                                </Button>
                            </div>
                        </>
                    )}


                </Modal.Body>
                {paystat == true ? (<Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => {
                            setPaystat(false);
                            handler({
                                toggle: false,
                                user_id: null,
                                amount: null,
                                influencer_id: null,
                                camp_id: null,
                                id: null
                            });
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        onClick={() => {
                            payRef.current.click();
                        }}
                    >
                        Pay
                    </Button>
                </Modal.Footer>) : (<>
                </>)}
            </Modal>
        )
    }


    const handlePay = (item) => {
        // e.preventDefault();
       
        if (handleValidation()) {
          // Proceed with form submission
          setOpenModal({ toggle: true, value: { influencerid_id__fee: cost, user_id: ids }, id: influencerId  })
          

        } else {
          console.log('Form validation failed');
        }
      };

    const InputElement = ({ payRef, handler, data, setIsPaid }) => {
        console.log('handler ------->>', data)
        const stripe = useStripe();
        const elements = useElements();

        const handleSubmit = async (event) => {
            event.preventDefault();
            if (elements == null) {
                return;
            }
            const token = await stripe.createToken(elements.getElement(CardElement))
            if (token.token) {
                payInfluencer({ token: token?.token?.id, user_id: ids, influencerid_id__fee: cost }).then(res => {
                    setIsPaid(data?.id)
                    console.log(data?.id)
                    toast.success('Payment Success', { autoClose: 1000 })
                    setPaystat(false);
                })
                createRequest(event)
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

    useEffect(() => {
        getProductList().then(res => {
            if (res?.success) {
                let data = []
                for (let i = 0; i < res?.success?.products?.length; i++) {
                    data.push({ value: res?.success?.products[i]?.id, label: res?.success?.products[i]?.title })
                }
                console.log(data)
                setProductList(data)
            }
        })
    }, [])

    useEffect(() => {

        if (id?.length != 0) {
            axios.get(API.BASE_URL + 'single/' + id + '/', {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
                .then(function (response) {
                    console.log("Single Market Data", response.data.data);
                    setFormData(response.data.data[0])
                })
        }


    }, [id])

    useEffect(() => {
        if (influencer_id !== null) {
            getInfluencer(influencer_id).then(res => {
                if (res?.data) {
                    setInfluencer(res?.data[0])
                }
            })
        }
    }, [influencer_id])

    const handlePrev = () => {
        navigate(-1)
    }

    const handleChange = (event) => {
        setFormData({ ...form_data, [event.target.name]: event.target.value })
    }

    const handleValidation = () => {
        const newErrors = {};
    
        // Validate Campaign name
        if (!form_data.campaign_name.trim()) {
          newErrors.campaign_name = 'Campaign name is required';
          toast.warn("Campaign name is required", { autoClose: 1000 });
        }else if(!form_data.influencer_visit.trim()) {
            newErrors.influencer_visit = 'Influencer Visit is required';
            toast.warn("Influencer Visit is required", { autoClose: 1000 });
          }else if(!form_data.date.trim()) {
            newErrors.date = 'Date is required';
            toast.warn("Date is required", { autoClose: 1000 });
          }else if(!form_data.end_date.trim()) {
            newErrors.end_date = 'End Date name is required';
            toast.warn("End Date name is required", { autoClose: 1000 });
          }else if (!form_data.product || form_data.product.length  === 0) {
            newErrors.product = 'Product is required';
            toast.warn("Product is required", { autoClose: 1000 });
        }else if(!form_data.description.trim()) {
            newErrors.description = 'Description is required';
            toast.warn("Description is required", { autoClose: 1000 });
          }else if(selected_coupons.length ===0) {
            newErrors.Coupon = 'Coupon is required';
            toast.warn("Coupon is required", { autoClose: 1000 });
          }

    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
      };

    const updateCampaign = (e) => {
        console.log("Product ID:", e);
        axios.put(API.BASE_URL + 'update/' + id + '/', {
            campaign_name: form_data.campaign_name,
            description: form_data.description,
            date: form_data.date,
            end_date: form_data.end_date,
        }, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
            .then(function (response) {
                console.log("EDITED MARKET", response)
                toast.success("Campaign Edited Successfully", { autoClose: 1000 });
                navigate('/market')
            })
            .catch(function (error) {
                console.log(error);
                if (error.response.data.campaign_name) {
                    toast.warn("Campaign Name may not be blank.", { autoClose: 1000 });
                }
                else if (error.response.data.influencer_visit) {
                    toast.warn("Influencer Visit may not be blank.", { autoClose: 1000 });
                }
                else if (error.response.data.date) {
                    toast.warn("Date may not be blank.", { autoClose: 1000 });
                }
                else if (error.response.data.offer) {
                    toast.warn("Offer may not be blank.", { autoClose: 1000 });
                }
                else if (error.response.data.product) {
                    toast.warn("Please selecta any Product.", { autoClose: 1000 });
                }
                else if (error.response.data.influencer_fee == "Influencer fee must be in positive.") {
                    toast.warn("Influencer fee must be in positive.", { autoClose: 1000 });
                }
                else if (error.response.data.influencer_fee) {
                    toast.warn("Please add a fee for Influencer.", { autoClose: 1000 });
                }
                else if (error.response.data.product_discount) {
                    toast.warn("Please select any value of Product Discount.", { autoClose: 1000 });
                }
                else if (error.response.data.error == "Product field may not be blank.") {
                    toast.warn("Product field may not be blank.", { autoClose: 1000 });
                }
                else if (error.response.data.error == "Coupon field may not be blank.") {
                    toast.warn("Coupon field may not be blank.", { autoClose: 1000 });
                }
                else if (error.response.data.coupon) {
                    toast.warn("Coupon may not be blank.", { autoClose: 1000 });
                }
                else if (error.response.data.error) {
                    toast.warn(`Campaign with ${error.response.data.error[0]} already exists`, { autoClose: 1000 });
                }
                else if (error.response.data.description) {
                    toast.warn("Description may not be blank.", { autoClose: 1000 });
                }
                else {
                    toast.warn("Request failed. Please try again later", { autoClose: 1000 });
                }
            })
    }

    console.log('------------->>>>>>>>>', coupon_list.coupons)


    const handleClick = (e) => {
        if (selected_coupons.length > 0) {
            let arr = selected_coupons
            let ids = selected_coupon_ids
            let isExist = null
            for (let i = 0; i < selected_coupons.length; i++) {
                if (selected_coupons[i] === e) {
                    isExist = i
                }
            }
            if (isExist !== null) {
                arr.splice(isExist, 1)
                ids.splice(isExist, 1)
            } else {
                arr.push(e)
                ids.push(e.coupon_id)
            }
            setSelectedCoupon([...arr])
            setCoupon_ids([...ids])
        } else {
            setSelectedCoupon([e])
            setCoupon_ids([e.coupon_id])
        }
    };

    const createRequest = async () => {
        try {
            // {amount: [], coupon_id: [],coupon_name: [], discout_type: [], product_name:''}
            let product_discount = [];
            for (let i = 0; i < selected_products.length; i++) {
                product_discount.push({
                    product_name: selected_products[i],
                    amount: [],
                    discout_type: [],
                    coupon_name: [],
                    coupon_id: []
                })
                for (let j = 0; j < selected_coupons.length; j++) {
                    if (selected_coupons[j].product_name === product_discount[i].product_name) {
                        product_discount[i].amount.push(selected_coupons[j].amount)
                        product_discount[i].coupon_name.push(selected_coupons[j].coupon_name)
                        product_discount[i].coupon_id.push(selected_coupons[j].coupon_id)
                        product_discount[i].discout_type.push(selected_coupons[j].discount_type)
                    }
                }
            }
            axios.post(API.BASE_URL + 'request/', {
                campaign_name: form_data.campaign_name,
                date: form_data.date,
                end_date: form_data.end_date,
                description: form_data.description,
                influencer_name: JSON.stringify(ids),
                influencer_visit: form_data.influencer_visit,
                product_discount: product_discount,
                product: form_data.product,
                product_name: coupon_list.product_titles,
                product_id: form_data.product,
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
                .then(function (response) {
                    toast.success(response.data.success, { autoClose: 1000 })
                    

                    navigate('/campaigns-influencer')
                })
                .catch(function (error) {
                    if (error.response.data.campaign_name) {
                        toast.warn("Campaign Name may not be blank.", { autoClose: 1000 });
                    }
                    else if (error.response.data.influencer_visit) {
                        toast.warn("Influencer Visit may not be blank.", { autoClose: 1000 });
                    }
                    else if (error.response.data.date) {
                        toast.warn("Date may not be blank.", { autoClose: 1000 });
                    }
                    else if (error.response.data.offer) {
                        toast.warn("Offer may not be blank.", { autoClose: 1000 });
                    }
                    else if (error.response.data.product) {
                        toast.warn("Please selecta any Product.", { autoClose: 1000 });
                    }
                    else if (error.response.data.influencer_fee == "Influencer fee must be in positive.") {
                        toast.warn("Influencer fee must be in positive.", { autoClose: 1000 });
                    }
                    else if (error.response.data.influencer_fee) {
                        toast.warn("Please add a fee for Influencer.", { autoClose: 1000 });
                    }
                    else if (error.response.data.product_discount) {
                        toast.warn("Please select any value of Product Discount.", { autoClose: 1000 });
                    }
                    else if (error.response.data.error == "Product field may not be blank.") {
                        toast.warn("Product field may not be blank.", { autoClose: 1000 });
                    }
                    else if (error.response.data.error == "Coupon field may not be blank.") {
                        toast.warn("Coupon field may not be blank.", { autoClose: 1000 });
                    }
                    else if (error.response.data.coupon) {
                        toast.warn("Coupon may not be blank.", { autoClose: 1000 });
                    }
                    else if (error.response.data.error) {
                        toast.warn(`Campaign with ${error.response.data.error[0]} already exists`, { autoClose: 1000 });
                    }
                    else if (error.response.data.description) {
                        toast.warn("Description may not be blank.", { autoClose: 1000 });
                    }
                    else {
                        toast.warn("Request failed. Please try again later", { autoClose: 1000 });
                    }
                })
        } catch (error) {
            console.error("Error:", error);

        }
    };


    const handleProductSelection = (e) => {
        setFormData({ ...form_data, product: e })
        let data = {
            products: e?.toString()
        }
        let arr = []
        for (let i = 0; i < product_list.length; i++) {
            for (let j = 0; j < e.length; j++) {
                if (e[j] === product_list[i]?.value) {
                    arr.push(product_list[i]?.label)
                }
            }
        }
        setSelectedProducts(arr)

        getDataByProduct(data).then(res => {
            if (res?.product_url) {
                setUrlList(res?.product_url)
            }
            if (res?.product_details) {
                console.log('=======<<<<<<<<<<<<',res)
                setCouponList({ coupons: res?.product_details?.coupon, product_titles: res?.title_list })
            }
        })
    }

    const showCoupons = (item) => {
        let doesExist = null;
        console.log("show coupons----------", selected_coupons, item)
        if (selected_coupons.length > 1) {
            for (let i = 0; i < selected_coupons.length; i++) {
                if (item.coupon_id === selected_coupons[i].coupon_id) {
                    doesExist = true
                    break;
                }
            }
            if (doesExist) {
                console.log(doesExist, selected_coupons)
                return (
                    <p
                        className={`d-flex flex-column mb-0 selected`}
                        onClick={() => handleClick(item)}
                    >
                        {item?.coupon_name} - {Math.abs(parseInt(item?.amount))}
                        {item?.discount_type !== 'fixed_amount' ? "%" : "د.إ"}
                    </p>
                )
            } else {
                return (
                    <p
                        className={`d-flex flex-column mb-0`}
                        onClick={() => handleClick(item)}
                    >
                        {item?.coupon_name} - {Math.abs(parseInt(item?.amount))}
                        {item?.discount_type !== 'fixed_amount' ? "%" : "د.إ"}
                    </p>
                )
            }
        } else {
            return (
                <p
                    className={`d-flex flex-column mb-0`}
                    onClick={() => handleClick(item)}
                >
                    {item?.coupon_name} - {Math.abs(parseInt(item?.amount))}
                    {item?.discount_type !== 'fixed_amount' ? "%" : "د.إ"}
                </p>
            )
        }
    }

    return (
        <>
            <div className="campaign-new p-4 page">
                <div className="campaign-new-container d-flex flex-column justify-content-start align-items-center">
                    <button onClick={() => handlePrev()} className="button button-black back justify-content-start w-100 my-4">
                        <FontAwesomeIcon icon={faChevronLeft} style={{ color: "#000", width: "15px", height: "15px", marginRight: 5 }} />
                        Back
                    </button>
                    <div className='w-100'>
                        {location.pathname === `/edit-campaign/${id}` ? (<h3>Edit Campaign for Marketplace</h3>) : <h3>Create Campaign for Influencer</h3>}
                        <form className='d-flex flex-wrap justify-content-between mt-5 w-100'>
                            <div className="input-container d-flex flex-column mb-4">
                                <label className="mb-3">Campaign name</label>
                                <input type="text" name="campaign_name" maxLength='30' onChange={handleChange} value={form_data?.campaign_name} />

                            </div>
                            {location.pathname === `/edit-campaign/${id}` ? ('') : (
                                <>
                                    <div className="input-container d-flex flex-column mb-4">
                                        <label className="mb-3">Influencer need to visit you</label>
                                        <div className="input d-flex align-items-center">
                                            <span className='d-flex align-items-center justify-content-center me-4'>
                                                <input type="radio" id="yes" name="influencer_visit" value={"yes"} checked={form_data?.influencer_visit == 'yes'} onChange={handleChange} />
                                                <label htmlFor="yes">Yes</label>
                                            </span>
                                            <span className='d-flex align-items-center justify-content-center'>
                                                <input type="radio" id="no" name="influencer_visit" value={"no"} checked={form_data?.influencer_visit == 'no'} onChange={handleChange} />
                                                <label htmlFor="no">No</label>
                                            </span>
                                        </div>
                                    </div>
                                </>)}
                            <div className="input-container d-flex flex-column mb-4">
                                <label className="mb-3">Campaign start date</label>
                                <input type="date" name="date" min={today} onChange={handleChange} value={form_data?.date} />
                            </div>
                            <div className="input-container d-flex flex-column mb-4">
                                <label className="mb-3">Campaign end date</label>
                                <input type="date" name="end_date" min={form_data?.date !== "" ? form_data?.date : today} onChange={handleChange} value={form_data?.end_date} />
                            </div>
                            {location.pathname === `/edit-campaign/${id}` ? ('') : (
                                <div className="w-full mb-4 col-md-6">
                                    <label className="mb-3">Product</label> <br />
                                    <CheckPicker style={{ height: '52px', width: '470px' }} data={product_list} onChange={(e) => handleProductSelection(e)} />
                                </div>
                            )}
                            <div className="input-container d-flex flex-column mb-4">
                                <label className="mb-3">Description</label>
                                <textarea
                                    name="description"
                                    id="description"
                                    cols="30"
                                    onChange={handleChange}
                                    value={form_data?.description}
                                    style={{ color: '#666' }}
                                ></textarea>
                            </div>
                            {location.pathname === `/edit-campaign/${id}` ? ('') : (
                                <>
                                    <div className="input-container d-flex flex-column mb-4 influen-list">
                                        <label className="mb-3">Influencer</label>
                                        <div className='selected-influencers'>
                                            <ul>
                                                <li
                                                    className='influencer-box d-flex align-items-center px-4'
                                                    key={influencer?.id}
                                                >
                                                    <img src={influencer?.image} alt="influencer" />
                                                    <p className="ms-2 d-flex flex-column">
                                                        <span className='text-dark'>{influencer?.fullname}</span>
                                                        <span>@{influencer?.username}</span>
                                                    </p>
                                                    <p className='ms-auto d-flex flex-column'>
                                                        <span className='text-dark'>Followers</span>
                                                        <strong>{(influencer?.follower / 1000000).toFixed(6)} M</strong>
                                                    </p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    {url_list?.length > 0 && (
                                        <div className="input-container d-flex flex-column mb-4">
                                            <label className="mb-3">Product URL</label>
                                            <div className='product-urls'>
                                                {url_list?.map((url, index) => (
                                                    <a key={index} href={url} target="_blank">
                                                        <FontAwesomeIcon icon={faSearch} style={{ color: "#5172fc", width: "15px", height: "15px", marginRight: 10 }} />
                                                        {url}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="input-container d-flex flex-column mb-4 prod-coupons w-100">
                                        <label className="mb-3">Product coupons</label>
                                        <ul className="coupons coupons-list flex-column">
                                            {coupon_list?.product_titles?.length > 0 ? coupon_list.product_titles.map((title, index) => {
                                                console.log(title)
                                                return (
                                                    <li key={index} className='d-flex flex-row align-items-center mb-2'>
                                                        <span>{title}:- </span>
                                                        <div className='d-flex align-items-center'>
                                                            {coupon_list?.coupons?.length > 0 ? coupon_list?.coupons?.map((item, i) => {
                                                                if (title === item?.product_name) {
                                                                    return (
                                                                        <div key={i} className={`d-flex flex-column justify-content-center align-items-center `}>
                                                                            {/* <span className='text-center' style={{ margin: '0 10px' }}>{influencer?.fullname}</span> */}
                                                                            <p
                                                                                className={`d-flex flex-column mb-0 ${selected_coupons?.includes(item) ? "selected" : ""}`}
                                                                                onClick={() => handleClick(item)}
                                                                            >
                                                                                {item?.coupon_name} - {Math.abs(parseInt(item?.amount))}
                                                                                {item?.discount_type !== 'fixed_amount' ? "%" : "د.إ"}
                                                                            </p>
                                                                        </div>
                                                                    )
                                                                }
                                                            }) : (
                                                                <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                    <p
                                                                        className={`d-flex flex-column mb-0 `}
                                                                    >
                                                                        No Coupon Available
                                                                    </p>
                                                                </div>
                                                            )
                                                            }
                                                        </div>
                                                    </li>
                                                )
                                            }) : <></>
                                            }
                                        </ul>
                                    </div>
                                </>

                            )}

                            <div className="buttons d-flex justify-content-center">
                                {id?.length > 0 ?
                                    <button className='button button-black' type="button" onClick={(e) => { updateCampaign(e) }}>Update Campaign</button>
                                    :
                                    <button className='button ms-4' type='button' onClick={(e) => handlePay(e)}>Send Request & Pay</button>
                                }
                            </div>
                        </form>
                    </div>
                    <PaymentModal data={open_modal} handler={(value) => { setOpenModal(value) }} setIsPaid={setIsPaid} />
                </div>
            </div>
        </>
    )
}

export default CreateInfluencer
