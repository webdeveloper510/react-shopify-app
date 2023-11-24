import React, {useState,useEffect, useContext} from 'react';
import MenuBar from '../navbar/Navbar';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import axios from 'axios';
import { API } from '../../config/Api';
import UserContext from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Delete from '../../assests/img/delete.svg';
import { toast } from 'react-toastify';
import SideBar from '../sidebar/Sidebar';
import './pages.scss';
import NoData from '../../assests/img/no-data.png';
import { useNavigate } from 'react-router-dom';
import CampaignTable from '../table/CampTable';

const CampaignMarket = () => {
    const [productNames, setProductNames] = useState([]);
    const [draftProds, setDraftProds] = useState([]);
    const token = localStorage.getItem('Token');
    const [getMarketInfo, setGetMarketInfo] = useState([]);
    const [getMarket, setGetMarket] = useState(false);
    const [prodOffer, setProdOffer] = useState('');
    const [campExpiredList, setCampExpiredList] = useState([]);
    const [marketActive, setMarketActive] = useState([]);
    const [loading, setLoading] = useState(false);
    const [campName, setCampName] = useState('');
    const [prodDiscount, setProdDiscount] = useState('');
    const [influenceVisit, setInfluenceVisit] = useState('');
    const [getId, setGetId] = useState('');
    const [getDeleteConfirm, setDeleteConfirm] = useState(false);
    const [campActive, setCampActive] = useState([]);
    const [campDecline, setCampDecline] = useState([]);
    const [campApproval, setCampApproval] = useState([]);
    const [campApproval12, setCampApproval12] = useState([]);
    const [active, setActive] = useState([]);
    const [pending, setPending] = useState([]);
    const [expire, setExpire] = useState([]);
    const [awaiting, setAwaiting] = useState([]);
    const [decline, setDecline] = useState([]);
    const {testing, setTesting, marketData,  marketDraftId, setMarketDraftId, marketDraftList, setMarketDraftList, marketList, setMarketList, marketId, setMarketId, declineInflu, showButtons} = useContext(UserContext);
    const navigate = useNavigate()
    
    const fetchMarketList = async () => {
        try {
            axios.get(API.BASE_URL + 'market/list/',{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(function (response) {
                console.log("MARKET LIST", response.data)
                setMarketList(response.data.data);
                setMarketId(response.data.product_id);
            })
            .catch(function (error) {
                console.log(error);
            })
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    const fetchMarkdraftList = async () => {
        try {
            axios.get(API.BASE_URL + 'markdraft/list/',{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(function (response) {
                console.log("MARKET DRAFT LIST", response.data)
                setMarketDraftList(response.data.data);
                setMarketDraftId(response.data.product_id);
            })
            .catch(function (error) {
                console.log(error);
            })
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchProductList = async () => {
        try {
            axios.get(API.BASE_URL + 'product/list/',{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(function (response) {
                setProductNames(response.data.success.products);
            })
            .catch(function (error) {
                console.log(error);
            })
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchMarketcampaignexp = async () => {
        try {
            axios.get(API.BASE_URL + 'marketcampaignexp/',{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(function (response) {
                console.log("Market Expired List",response.data);
                setCampExpiredList(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // const fetchMarketapproval = async () => {
    //     try {
    //         axios.get(API.BASE_URL + 'marketapproval/',{
    //             headers: {
    //                 Authorization: `Token ${token}`
    //             }
    //         })
    //         .then(function (response) {
    //             console.log("Market Approval List",response.data);
    //             setCampActive(response.data.data);
    //             setCampApproval(response.data.data);
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         })
    //     } catch (error) {
    //         console.error("Error:", error);
    //     }
    // };
    
    const fetchMarket_decline = async () => {
        try {
            axios.get(API.BASE_URL + 'market_decline/',{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(function (response) {
                console.log("Market Decline List",response.data);
                setCampDecline(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const fetchMarketList12 = async () => {
        
        try {
            const response = await axios.get(API.BASE_URL + 'marketcampaign/',{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            const actives = Object.values(response.data.data).filter(data => data.expiry_status == true);
            const Expire = Object.values(response.data.data).filter(data => data.expiry_status == false);
            const activeCampaigns = Object.values(actives).filter(data => data.status == '2');
            const awaitingCampaigns = Object.values(actives).filter(data => data.status == '1');
            const inactiveCampaigns = Object.values(actives).filter(data => data.status == '0');
            const declineCampaigns = Object.values(actives).filter(data => data.status == '4');
            setCampApproval12(activeCampaigns);
            setActive(activeCampaigns);
            setPending(inactiveCampaigns);
            setExpire(Expire);
            setAwaiting(awaitingCampaigns);
            setDecline(declineCampaigns);
           } catch (error) {
            console.error('Error fetching data:', error);
    } };

    const fetchMarket_approval = async () => {
        try {
            axios.get(API.BASE_URL + 'market_approval/',{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(function (response) {
                console.log("Market Active List",response.data);
                setMarketActive(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
        } catch (error) {
            console.error("Error:", error);
        }
    };



    useEffect(() => {
        setLoading(true)
        fetchMarketList12().then(()=> {
            setLoading(false)
        });
        fetchMarketList();
        fetchProductList();

    }, [token])


    const handleCampName = (event) => {
        setCampName(event.target.value);
    }

    const handleProdDiscount = (event) => {
        setProdDiscount(event.target.value);
    }

    const handleProdOffer = (event) => {
        setProdOffer(event.target.value);
    }

    const handleInfluenceVisit = (event) => {
        setInfluenceVisit(event.target.value);
    }

    useEffect(() => {
        const names = [];
        marketId?.forEach((ids) => {
            const productNamesArr = [];
            ids.forEach((id) => {
            const product = productNames.find((p) => p.id === id);
            if (product) {
                productNamesArr.push(product.title);
            }
            });
            names.push(productNamesArr);
        });
        setTesting(names);
        
        const draftNames = [];
        marketDraftId?.forEach((ids) => {
            const productNamesArr = [];
            ids.forEach((id) => {
                const product = productNames.find((p) => p.id === id);
                if (product) {
                    productNamesArr.push(product.title);
                }
            });
            draftNames.push(productNamesArr);
        });
        setDraftProds(draftNames);

    }, [productNames, marketId, marketDraftId])

    function deleteConfirm(value) {
        console.log(value);
        setGetId(value);
        setDeleteConfirm(true);
    }

    function deleteCampaign(value) {
        console.log(value)
        setLoading(true);
        axios.delete(API.BASE_URL + 'delete/' + value + '/',{
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(function (response) {
            toast.success("Campaign Deleted!", { autoClose: 1000 });
            setMarketList(marketList.filter(campaign => campaign.campaignid_id !== value));
            setMarketDraftList(marketDraftList.filter(campaign => campaign.campaignid_id !== value));
            setDeleteConfirm(false)
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(() => setLoading(false));
    }

    const getSingleMarket = (value, event) => {
        console.log("VLSE", value)
        event.preventDefault();
        setLoading(true);
        axios.get(API.BASE_URL +  'single/' + value + '/', {
            headers: {
                Authorization: `Token ${token}`
        }})
        .then(function (response) {
            console.log("Single Market Data" ,response.data.data)
            setGetMarketInfo(response.data.data[0])
            // setGetMarket(true);
            setCampName(response.data.data.campaign_name)
            setProdOffer(response.data.data.offer)
            setProdDiscount(response.data.data.product_discount)
            setInfluenceVisit(response.data.data.description)
            navigate(`/create-campaign/${response.data.data[0].campaignid_id}`)
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(() => setLoading(false));
    }

    const couponCross = () => {
        setGetMarket(false)
        setDeleteConfirm(false)
    }

    const handleVendorAccept = (value, idValue, coupon, amount) => {
        setLoading(true);
        axios.post(API.BASE_URL + 'marketplaceaccept/' + value + '/' + idValue + '/',{
            coupon: coupon[0],
            amount: amount ? parseInt(amount[0].slice(1)) : '',
        },{
            headers: { 
                Authorization: `Token ${token}` 
            }
        })
        .then(function (response) {
            console.log("Accepted" ,response)
            toast.success("Campaign Accepted!", { autoClose: 1000 });
            axios.get(API.BASE_URL + 'marketapproval/',{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(function (response) {
                console.log("Market Approval List",response.data);
                setCampApproval(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
            
        })
        .catch(function (error) {
            console.log(error);
            toast.warn("Cannot Accept right now. Please try again later", { autoClose: 1000 })
        })
        .finally(() => setLoading(false));
    }

    const handleVendorDecline = (value, idValue, coupon, amount) => {
        setLoading(true);
        axios.post(API.BASE_URL + 'vendor/decline/' + value + '/' + idValue + '/',{
            coupon: coupon[0],
            amount: parseInt(amount[0].slice(1)),
        },{
            headers: { 
                Authorization: `Token ${token}` 
            }
        })
        .then(function (response) {
            console.log("Decline" ,response)
            toast.success("Campaign Declined!", { autoClose: 1000 });
            axios.get(API.BASE_URL + 'marketapproval/',{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(function (response) {
                console.log("Market Approval List",response.data);
                setCampApproval(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
        })
        .catch(function (error) {
            console.log(error);
            toast.warn("Cannot Decline right now. Please try again later", { autoClose: 1000 })
        })
        .finally(() => setLoading(false));
    }

    const showMarketCampaign = (event, value) => {
        event.preventDefault();
        setLoading(true);
          axios.get(API.BASE_URL +  'single/' + value + '/', {
              headers: {
                  Authorization: `Token ${token}`
          }})
          .then(function (response) {
              console.log("Single Market Data" ,response.data.data)
              setGetMarket(true);
              setGetMarketInfo(response.data.data[0])
              setCampName(response.data.data.campaign_name)
              setProdOffer(response.data.data.offer)
              setProdDiscount(response.data.data.product_discount)
              setInfluenceVisit(response.data.data.description)
          })
          .catch(function (error) {
              console.log(error);
          })
          .finally(() => setLoading(false));
    }

    console.log("Testing in Market", testing)
    console.log("productNames", productNames)

  return (
    <>
        <div className="campaign-market p-4 page">
            {/* <MenuBar /> */}
            {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}

            <div className="campaign-market-container d-flex flex-column w-100">
                <h2 className='my-5'>Campaign Marketplace</h2>

            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Col sm={12}>
                <Nav variant="pills" className="flex-row mb-4 tab-header">
                    <Nav.Item>
                        <Nav.Link eventKey="first">Active</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="second">Pending</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="four">Awaiting</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="five">Declined</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="six">Expired</Nav.Link>
                    </Nav.Item>
                </Nav>
                </Col>
                <Col sm={12}>
                <Tab.Content>
                    <Tab.Pane eventKey="first">
                        { active?.length > 0 ? (
                            <CampaignTable 
                                list={active}
                                additionalProp="active"
                            />
                            ) : loading== false ?
                            (
                                <>
                                    <img src={NoData} alt='no-data' style={{width: '100%', maxHeight: 220, marginTop: '4rem', objectFit: 'contain'}} />
                                    <h3 className='mt-4 text-center'>No Active Campaign</h3>
                                    
                                </>
                            ) :( <></>)
                        }
                    </Tab.Pane>

                    <Tab.Pane eventKey="second">
                        {pending?.length > 0 ? (
                            <CampaignTable 
                                list={pending}
                                additionalProp="pending"
                            />
                            ) : (
                                <>
                                    <img src={NoData} alt='no-data' style={{width: '100%', maxHeight: 220, marginTop: '4rem', objectFit: 'contain'}} />
                                    <h3 className='mt-4 text-center'>No Pending Campaign</h3>
                            
                                </>
                            )
                        }
                    </Tab.Pane>

                    <Tab.Pane eventKey="four">
                        {awaiting?.length > 0 ? (
                            <CampaignTable 
                            list={awaiting}
                            additionalProp="awaiting"
                        />
                            ) :
                            (
                                <>
                                    <img src={NoData} alt='no-data' style={{width: '100%', maxHeight: 220, marginTop: '4rem', objectFit: 'contain'}} />
                                    <h3 className='mt-4 text-center'>No Approved Campaign</h3>
                                    
                                </>
                            )
                        }
                    </Tab.Pane>

                    <Tab.Pane eventKey="five">
                        {decline?.length > 0 ? (
                            <CampaignTable 
                                list={decline}
                                additionalProp="decline"

                            />
                            ) :
                            (
                                <>
                                    <img src={NoData} alt='no-data' style={{width: '100%', maxHeight: 220, marginTop: '4rem', objectFit: 'contain'}} />
                                    <h3 className='mt-4 text-center'>No Declined Campaign</h3>
                                    
                                </>
                            )
                        }
                    </Tab.Pane>

                    <Tab.Pane eventKey="six">
                        {expire?.length > 0 ? (
                            <CampaignTable 
                                list={expire}
                                additionalProp="expire"
                            />
                            ) :
                            (
                                <>
                                    <img src={NoData} alt='no-data' style={{width: '100%', maxHeight: 220, marginTop: '4rem', objectFit: 'contain'}} />
                                    <h3 className='mt-4 text-center'>No Expired Campaign</h3>
                                    
                                </>
                            )
                        }
                    </Tab.Pane>

                </Tab.Content>
                </Col>
            </Tab.Container>


            </div>
        </div>
    </>
  );
}

export default CampaignMarket;