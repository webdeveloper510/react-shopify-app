import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { API } from '../../config/Api';
import './pages.scss';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import NoData from '../../assests/img/no-data.png';
import './pages.scss'

function InfluencerSales() {
    const [influSales, setInfluSales] = useState([]);
    const [influList, setInfluList] = useState([]);
    const [matchingFullnames, setMatchingFullnames] = useState([]);
    const [transferShow, setTransferShow] = useState(false);
    const [selectedTransferIndex, setSelectedTransferIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("Token");

    useEffect(() => {
        setLoading(true);
        axios.get(API.BASE_URL + 'influencer/list/', {
            headers: {
              Authorization: `Token ${token}`
            }
          })
          .then(function (response) {
            console.log("Influencer List", response);
            setInfluList(response.data.data)
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(() => setLoading(false));
        
    }, [])

    useEffect(() => {
        setLoading(true);

        axios.get(API.BASE_URL + 'influecercamsale/',{
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(function (response) {
            console.log("Influencer Sales", response);
            setInfluSales(response.data.sale_details)
        })
        .catch(function (error) {
            console.log(error)
        })
        .finally(() => setLoading(false));
        
    }, [])

    useEffect(() => {
        if (influList.length > 0 && influSales.length > 0) {
            const matchingFullnames = influSales.reduce((acc, sale) => {
                const influ = influList.find(influencer => influencer.id === sale.influencer);
                if (influ) {
                    acc.push(influ.fullname);
                }
                return acc;
            }, []);
            setMatchingFullnames(matchingFullnames);
        }
    }, [influList, influSales]);

    const handleTransferShow = (e, index, amount) => {
        console.log("Amount", amount)
        e.preventDefault();
        setSelectedTransferIndex(index);
        if(amount >= 50 ) {
            setTransferShow(true);
        }
        else {
            toast.warn("Amount should be more than 50", { autoClose: 1000 })
        }
        
    }

    const couponCross = () => {
        setTransferShow(false)
    }
    const handleTransferData = (e, account, amount, influencer, camp_detail, sales) => {
        setLoading(true);
        e.preventDefault();
        axios.post(API.BASE_URL + 'transfer_money/', {
            account_id: account,
            amount: amount,
            influencer: influencer,
            camp_id: camp_detail,
            sales: sales
        },{
            headers: {
              Authorization: `Token ${token}`
            }
          },)
          .then(function (response) {
            console.log("Influencer List", response);
            toast.success("Money transfer Successfully");
            axios.get(API.BASE_URL + 'influecercamsale/',{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(function (response) {
                console.log("Influencer Sales", response);
                setInfluSales(response.data.sale_details)
            })
            .catch(function (error) {
                console.log(error)
            })
        })
        .catch(function (error) {
            console.log(error);
            toast.error("Error transferring Amount")
        })
        .finally(() => setLoading(false));
    }

    console.log("matchingFullnames", matchingFullnames);
    console.log("selectedTransferIndex", selectedTransferIndex)

  return (
    <div className='p-4 page'>
        {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
        <div className="heading">
            <h2 className='mb-5'>Influencer Sales</h2>
        </div>
        {influSales?.length > 0 ? (
            <table className='w-100 campaign'>
                <tbody className='w-100'>
                    <tr className='headings'>
                        <th>Campaign Id</th>
                        <th>Influencer</th>
                        <th>Influencer Fee</th>
                        <th>Sales</th>
                        <th>Amount</th>
                        <th>Amount Paid</th>
                        <th>Transfer</th>
                    </tr>
                        {influSales.map((name, i) => {
                            return(
                                <>
                                <tr className='campaign-inputs'>
                                    <td>{name.campaing_id}</td>
                                    <td>{matchingFullnames[i]}</td>
                                    <td>{name.offer == 'commission' && "د.إ"}{name.influener_fee}{name.offer == 'percentage' && '%'}</td>
                                    <td>{name.sales}</td>
                                    <td>{name.amount.toFixed(2)}د.إ</td>
                                    <td>{name.amount_paid ? name.amount_paid : 0} د.إ</td>
                                    <td><button type='button' onClick={(e) => {handleTransferShow(e, i, name.amount)}}>Transfer</button></td>
                                </tr>
                                {transferShow && selectedTransferIndex === i && (
                                    <div className="transfer-form">
                                        <form action="">
                                            <button className='close' onClick={couponCross}>
                                                <FontAwesomeIcon icon={faClose} style={{ color: "#000", width: "25px", height: "25px"}} />
                                            </button>
                                            <h2 className='mb-4'>Transfer</h2>
                                            <div className="input-container">
                                                <label htmlFor="">Influencer</label>
                                                <input type="text" value={matchingFullnames[i]} disabled />
                                            </div>
                                            <div className="input-container">
                                                <label htmlFor="">Account Number</label>
                                                <input type="text" value={name?.account} disabled />
                                            </div>
                                            <div className="input-container">
                                                <label htmlFor="">Amount</label>
                                                <input type="number" value={name?.amount.toFixed(2)} disabled />
                                             </div>
                                             <button type='button' className='button-black mt-4' onClick={(e) => {handleTransferData(e, name?.account, name?.amount, name?.influencer, name.campaign_detail, name.sales)}}>Submit</button>
                                        </form>
                                    </div>
                                )}
                                </>
                            )
                        })}
                    
                </tbody>
            </table>
            ) :
            (
                <>
                    <h5 className='mt-4 text-center'>No Sales</h5>
                    <img src={NoData} alt='no-data' style={{width: '100%', maxHeight: 220, marginTop: '4rem', objectFit: 'contain'}} />
                    <h3 className='text-center'>No Data Found</h3>
                </>
            )
        }

        
    </div>
  )
}

export default InfluencerSales;