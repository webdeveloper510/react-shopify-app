import './pages.scss';
import Verified from '../../assests/img/check.png'
import React, { useEffect, useRef, useState } from 'react';
import { getInfluencerList, payInfluencer } from '../../config/Api';
import { useNavigate } from 'react-router-dom';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { toast } from 'react-toastify';

const Influencers = () => {

    //-------Constants ------
    const navigate = useNavigate();

    //-------States----------
    const [loading, setLoading] = useState(false);
    const [paidId, setPaidId] = useState(false);
    const [influencer_list, setInfluencerList] = useState(null);
    const [is_paid, setIsPaid] = useState(false)
    const [disabled, setDisabled] = useState(null)

    //-------Handlers--------
    useEffect(() => {
        setLoading(true);
        getInfluencerList().then(res => {
            setLoading(false);
            let data = res?.data
            if (res?.data) {
                for (let i = 0; i < res?.data?.length; i++) {
                    if (res?.data[i]?.paid_status === true) {
                        setDisabled(res?.data[i]?.influencerid_id)
                        break;
                    }
                }
               
                setInfluencerList(res.data);
            }
        })
    }, [is_paid]);

    const handlePay = (item) => {
    // console.log("===============>>>>",  item )
            navigate(`/new-campaign/`, { state: { influencer_id: item?.influencerid_id, name: item?.fullname, cost: item?.influencerid_id__fee, id: item?.influencerid_id } })
        // } else {
        //     setOpenModal({ toggle: true, value: { influencer_id: item?.influencerid_id, id: item?.id  }, id: item?.influencerid_id })
        // }
    }

    const handlePrev = () => {
        navigate(-1)
    }

    // console.log('influencer_list =======>>>>>>>>>>>>>>', influencer_list)

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

                                                        <button className='btn btn-dark' onClick={() => { handlePay(item) }}>
                                                            Select
                                                        </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : <h2 className='my-4 text-center w-100'>No Influencers</h2>}

                    </div>
                </div>
            </div>
        </>
    )
}




export default Influencers