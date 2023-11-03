import React, { useState } from 'react';
import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getDataByProduct, getInfluencer, getProductList } from '../../config/Api';
import { CheckPicker } from "rsuite"
import "rsuite/dist/rsuite.css";

const CreateInfluencer = () => {

    //-------Constants ------
    const { id } = useParams()
    const location = useLocation()
    const influencer_id = location.state !== null ? location?.state?.influencer_id : null
    const navigate = useNavigate();
    const today = new Date().toISOString().substr(0, 10);


    //-------States----------
    const [form_data, setFormData] = useState({ campaign_name: '', influencer_visit: '', date: '', end_date: '', product: [], description: '', influencer_name: '', coupon: [] })
    const [influencer, setInfluencer] = useState(null)
    const [product_list, setProductList] = useState([])
    const [coupon_list, setCouponList] = useState({ coupons: [], product_titles: [] })
    const [url_list, setUrlList] = useState([])
    const [selected_coupons, setSelectedCoupon] = useState([])


    //-------Handlers--------

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

        if (id) {
            console.log(id)
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

    const updateCampaign = () => {
        console.log("update")
    }

    const createRequest = () => {

    }

    const handleProductSelection = (e) => {
        setFormData({ ...form_data, product: e })
        let data = {
            products: e?.toString()
        }
        getDataByProduct(data).then(res => {
            if (res?.product_url) {
                setUrlList(res?.product_url)
            }
            if (res?.product_details) {
                setCouponList({ coupons: res?.product_details?.coupon, product_titles: res?.title_list })
            }
        })
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
                        {location.pathname === "/edit-campaign" ? (<h3>Edit Campaign for Influencer</h3>) : <h3>Create Campaign for Influencer</h3>}
                        <form className='d-flex flex-wrap justify-content-between mt-5 w-100'>
                            <div className="input-container d-flex flex-column mb-4">
                                <label className="mb-3">Campaign name</label>
                                <input type="text" name="campaign_name" maxLength='30' onChange={handleChange} value={form_data?.campaign_name} />
                            </div>
                            <div className="input-container d-flex flex-column mb-4">
                                <label className="mb-3">Influencer need to visit you</label>
                                <div className="input d-flex align-items-center">
                                    <span className='d-flex align-items-center justify-content-center me-4'>
                                        <input type="radio" id="yes" name="influencer_visit" value={"yes"} checked={form_data?.influencer_visit} onChange={handleChange} />
                                        <label htmlFor="yes">Yes</label>
                                    </span>
                                    <span className='d-flex align-items-center justify-content-center'>
                                        <input type="radio" id="no" name="influencer_visit" value={"no"} checked={form_data?.influencer_visit} onChange={handleChange} />
                                        <label htmlFor="no">No</label>
                                    </span>
                                </div>

                            </div>
                            <div className="input-container d-flex flex-column mb-4">
                                <label className="mb-3">Campaign start date</label>
                                <input type="date" name="date" min={today} onChange={handleChange} value={form_data?.date} />
                            </div>
                            <div className="input-container d-flex flex-column mb-4">
                                <label className="mb-3">Campaign end date</label>
                                <input type="date" name="end_date" min={form_data?.date !== "" ? form_data?.date : today} onChange={handleChange} value={form_data?.end_date} />
                            </div>
                            <div className="w-full mb-4 col-md-6">
                                <label className="mb-3">Product</label> <br />
                                <CheckPicker style={{ height: '52px', width: '470px' }} data={product_list} onChange={(e) => handleProductSelection(e)} />
                            </div>
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
                                    {
                                        coupon_list?.product_titles?.length > 0 ? coupon_list.product_titles.map((title, index) => {
                                            console.log(title)
                                            return (
                                                <li key={index} className='d-flex flex-row align-items-center mb-2'>
                                                    <span>{title}:- </span>
                                                    <div className='d-flex align-items-center'>
                                                        {
                                                            coupon_list?.coupons?.length > 0 ? coupon_list?.coupons?.map((item, i) => {
                                                                if (title === item?.product_name) {
                                                                    return (
                                                                        <div key={i} className='d-flex flex-column justify-content-center align-items-center'>
                                                                            {/* <span className='text-center' style={{ margin: '0 10px' }}>{influencer?.fullname}</span> */}
                                                                            <p
                                                                                className={`d-flex flex-column mb-0 `}
                                                                            // onClick={handleClick}
                                                                            >
                                                                                {item?.coupon_name} - {Math.abs(parseInt(item?.amount))}
                                                                                {item?.discount_type !== 'fixed_amount' ? "%" : "د.إ"}
                                                                            </p>
                                                                        </div>
                                                                    )
                                                                }
                                                            }) : (
                                                                <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                    {/* <span className='text-center' style={{ margin: '0 10px' }}>{influencer?.fullname}</span> */}
                                                                    <p
                                                                        className={`d-flex flex-column mb-0 `}
                                                                    // onClick={handleClick}
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
                            <div className="buttons d-flex justify-content-center">
                                {id?.length > 0 ?
                                    <button className='button button-black' type="button" onClick={(e) => { updateCampaign(e) }}>Update Campaign</button>
                                    :
                                    <button className='button ms-4' type='button' onClick={(e) => createRequest(e)}>Send Request</button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateInfluencer


// import React from 'react'

// const CreateInfluencer = () => {
//     return (
//         <div>CreateInfluencer</div>
//     )
// }

// export default CreateInfluencer