import React, {useState, useEffect} from 'react';
import { Container } from 'react-bootstrap';
import { API } from '../../config/Api';
import axios from 'axios';
import NoData from '../../assests/img/no-data.png';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

function AdminTransfer() {
    const[transferData, setTransferData] = useState([]);
    const [transferShow, setTransferShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("Token");
    useEffect(() => {
        setLoading(true);
        axios.get(API.BASE_URL + 'admintransfer/',{
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(function (response) {
            console.log("Admin Transfer", response.data.sale_details);
            setTransferData(response.data.sale_details)
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(() => setLoading(false));
    }, [])

    const handleTransferShow = (e, i) => {
        console.log("bnji",i)
        e.preventDefault();
        setTransferShow(i);
    }

    const adminMoney = (e, account_id,admin,amount,camp_id,sales) => {
        setLoading(true)
        e.preventDefault();
        axios.post(API.BASE_URL + 'adminmoney/',{
            account_id: account_id,
            admin: admin,
            amount: amount,
            camp_id: camp_id,
            sales: sales
        },{
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(function (response) {
            console.log("Admin Transfer", response.data);
            toast.success("Money transfer Successfully", { autoClose: 1000 })
            axios.get(API.BASE_URL + 'admintransfer/',{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(function (response) {
                setTransferData(response.data.sale_details)
            })
            .catch(function (error) {
                console.log(error);
            })
            setTransferShow(false)
        })
        .catch(function (error) {
            console.log(error);
            toast.error("Error Transferring Money", { autoClose: 1000 })
        })
        .finally(() => setLoading(false));
    }

    const couponCross = () => {
        setTransferShow(false)
    }
  return (
    <div className='transfer p-4 page'>
        {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
      <Container>
        <div className="heaading my-5">
            <h2>Transfer</h2>
        </div>
        {transferData?.length > 0 ? (
            <table className='w-100 campaign'>
                <tbody className='w-100'>
                    <tr className='headings'>
                        <th>Campaign Name</th>
                        <th>Sales</th>
                        <th>Commission</th>
                        <th>Amount</th>
                        <th>Amount Paid</th>
                        <th>Transfer</th>
                    </tr>
                        {transferData?.map((name, i) => {
                            return(
                                <>
                                <tr className='campaign-inputs'>
                                    <td>{name.campaing_id}</td>
                                    <td>{name.sales}د.إ</td>
                                    <td>{name.admin_fee}%</td>
                                    <td>{name.amount}</td>
                                    <td>{name.amount_paid != null ? name.amount_paid : 0}د.إ</td>
                                    <td><button type='button' onClick={(e) => {handleTransferShow(e, i)}}>Transfer</button></td>
                                </tr>
                                {transferShow === i &&  (
                                    <div className="transfer-form">
                                        <form action="">
                                            <button className='close' onClick={couponCross}>
                                                <FontAwesomeIcon icon={faClose} style={{ color: "#000", width: "25px", height: "25px"}} />
                                            </button>
                                            <h2 className='mb-4'>Transfer</h2>
                                            <div className="input-container">
                                                <label htmlFor="">Name</label>
                                                <input type="text" value={name.admin_name} disabled />
                                            </div>
                                            <div className="input-container">
                                                <label htmlFor="">Account Number</label>
                                                <input type="text" value={name.account} disabled />
                                            </div>
                                            <div className="input-container">
                                                <label htmlFor="">Amount</label>
                                                <input type="number" value={name.amount} disabled />
                                             </div>
                                             <button type='button' className='button-black mt-4' onClick={(e) => {adminMoney(e,name.account, name.admin, name.amount, name.campaign_detail, name.sales)}}>Transfer</button>
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
                    <h5 className='mt-4 text-center'>No Transfer</h5>
                    <img src={NoData} alt='no-data' style={{width: '100%', maxHeight: 220, marginTop: '4rem', objectFit: 'contain'}} />
                    <h3 className='text-center'>No Data Found</h3>
                </>
            )
        }
      </Container>
    </div>
  )
}

export default AdminTransfer
