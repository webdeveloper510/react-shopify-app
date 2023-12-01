import { faChevronLeft, faChevronRight, faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import Delete from '../../assests/img/delete.svg';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Toast } from 'react-bootstrap';
import axios from 'axios';
import { getInfluencerList, payInfluencer } from '../../config/Api';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { API } from '../../config/Api';

const CampTable = ({ list, additionalProp, name }) => {
  console.log('list -->>', list)
  console.log('additionalProp -->>', additionalProp);
  const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);

  const token = localStorage.getItem("Token");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [paystat, setPaystat] = useState(false);
  const currentItems = list;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const totalPages = Math.ceil(list?.length / ITEMS_PER_PAGE);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const navigate = useNavigate()
  const [is_paid, setIsPaid] = useState(false)
  const [loading, setLoading] = useState(false);
  const [commission, setCommission] = useState();
  const [delete_modal, setDeleteModal] = useState({ toggle: false, value: null })
  const [view_modal, setViewModal] = useState({ toggle: false, value: null })
  const [open_modal, setOpenModal] = useState({ toggle: null, user_id: null, influencer_id: null, camp_id: null, id: null, amount: null , coupom_amount : null , coupon : null});
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const calculateCommission = () => {
    const commissionAmount = (list.commission * list.influencer_fee) / 100;
    setCommission(commissionAmount);
  };
  console.log(commission)

  // console.log("currentItems ======>>>>>>>", currentItems)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleReject = (e) => {
    // console.log(token)
    axios.post(API.BASE_URL + 'marketplacedecline/' + e.camp_id + '/' + e.id + '/', {
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
      .then(function (response) {
        // console.log("Single Market Data", response.data.data)

        toast.success(response.message, { autoClose: 1000 });
      })
      .catch(function (error) {
        console.log(error);
      })

    // console.log(e);
  }

  const productsListing = (list) => {
    let text = "";
    for (let i = 0; i < list?.length; i++) {
      if (list[i]?.product_name !== null) {
        if (list?.length > 1 && i !== list?.length - 1) {
          text = text + list[i]?.product_name + ",\n"
        } else {
          text = text + list[i]?.product_name
        }
      }
    }
    return text !== "" && text !== null ? text : "None"
  }

  const PaymentModal = ({ data, handler, setIsPaid }) => {
    console.log("--------------->>>>>>>", data)
    const payRef = useRef(null)
    const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`)
    // handleAccept(data);
    return (
      <Modal className="modal-card" show={data?.toggle} onHide={() => handler({ toggle: false, user_id: null, amount: null, influencer_id: null, camp_id: null, id: null })} centered backdrop="static">
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
                <td>{data?.amount} AUD</td>
              </tr>
              <tr>
                <td>Admin Fee : </td>
                <td>{data?.admin_fee} AUD</td>
              </tr>
              <tr>
                <td>Total Pay : </td>
                <td>{data?.admin_fee + data?.amount} AUD</td>
              </tr>
            </table>
            <div className='text-center mt-4'> 
            <Button type="submit" variant="primary" onClick={() => setPaystat(true)}>
            Contine
          </Button>
            </div>
            </>
          ) }
            
           
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
        </Modal.Footer> ) : (<>
        </>) }
      </Modal>
    )
  }


  const couponListing = (list, field) => {
    let coupontext = "";
    let fixed = 0;
    let percentage = 0;
    for (let i = 0; i < list?.length; i++) {
      if (list[i]?.product_name !== null) {
        for (let j = 0; j < list[i]?.coupon_name?.length; j++) {
          if (list[i]?.coupon_name.length > 0 && j !== list[i].coupon_name.length - 1 ) {
            coupontext = coupontext + list[i]?.coupon_name[j] + ",\n"
          } else {
            coupontext = coupontext + list[i]?.coupon_name[j] 
          }
          if (list[i]?.discount_type[j] === "percentage") {
            percentage = percentage + Number(list[i]?.amount[j])
          } else if (list[i]?.discount_type[j] === "fixed_amount") {
            fixed = fixed + Number(list[i]?.amount[j])
          }
        }
        if(i !== list?.length-1 && coupontext !== ""){
          coupontext = coupontext+",\n"
        }
      }
    }
    if (field === "coupons") {
      // return "text"
      return coupontext !== null && coupontext !== "" ? coupontext : "None"
    } else {
      return <>{fixed !== 0 ? fixed + "د.إ" : ""} {fixed !== 0 && percentage !== 0 ? "and" : fixed === 0 && percentage === 0 ? "none" : ""} {percentage !== 0 ? percentage + "%" : ""}</>
    }
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
        payInfluencer({ token: token?.token?.id, campaignid_id: data.user_id, influencerid_id: data.user_influencer, user_id: data.influencer_id,coupom_amount: data.coupom_amount ,   coupon: data.coupon, influencerid_id__fee: data?.amount }).then(res => {
          setIsPaid(data?.id)
          console.log(data?.id)
          toast.success('Payment Success', { autoClose: 1000 })
          handlerAccepts({camp_id: data.camp_id, campaignid_id: data.user_id, id: data.influencer_id ,coupom_amount: data.coupom_amount , coupon: data.coupon, influencerid_id__fee: data?.amount})
        })
        console.log('<<<<<<====>>>>>',handler)

        setPaystat(false);
        handler({ toggle: false,})
      } else if (token.error.code === "card_declined") {
        toast.error("Card Declined")
      } else {
        toast.error("Enter card details to continue")
      }
    };
    
    const handlerAccepts = (data) => {
      let newData={
        coupon: data?.coupon,
        coupon_amount: data?.coupom_amount,
      }
      console.log("<<<<<<<<<<<<<<<<<<<<<<<",data)
      axios.post(API.BASE_URL + 'marketplaceaccept/' + data.camp_id + '/' + data.id + '/',newData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("Token")}`
          }
        })
        .then(function (response) {
          // console.log("Single Market Data", response.data.data)
          toast.success(response.message, { autoClose: 1000 });
          handler({ value: null, id: null, user_id: null, coupom_amount : null , coupon : null, camp_id: null, amount: null })
        })
        .catch(function (error) {
          console.log(error);
        })
  
    }
  
  
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
    calculateCommission();
  }, [list]);

  const editCamp = (id) => {
    navigate(`/edit-campaign/${id}`)
  }
  // console.log("================>>>>>>>>>",couponListing)

  const headRows = () => {
    if (additionalProp == "active") {

      return (
        <tr className='headings'>
          <th>Campaign Name</th>
          <th>Influencer</th>
          <th>Action</th>
        </tr>
      )
    } else if (additionalProp == "pending") {
      return (
        <tr className='headings'>
          <th>Campaign Name</th>
          <th>Products</th>
          <th>Coupons</th>
          <th>Discount</th>
          <th>Actions</th>
        </tr>
      )
    } else if (additionalProp == "declined") {
      return (
        <tr className='headings'>
          <th>Campaign Name</th>
          <th>Products</th>
          <th>Coupons</th>
          <th>Discount </th>
        </tr>
      )
    } else if (additionalProp == "awaiting") {
      return (
        <tr className='headings'>
          <th>Campaign Name</th>
          <th>Products</th>
          <th>Coupons</th>
          <th>Admin Fee</th>
          <th>Commission</th>
          <th>Influencer Fee</th>
          <th>Action</th>
        </tr>
      )
    } else {
      return (
        <tr className='headings'>
          <th>Campaign Name</th>
          <th>Products</th>
          <th>Coupons</th>
          <th>Discount</th>
        </tr>
      )
    }
  }

  const contentRows = () => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItemsToDisplay = currentItems.slice(indexOfFirstItem, indexOfLastItem);
    if (additionalProp == "active") {
      return (
        <>
          {currentItemsToDisplay?.length > 0 && currentItemsToDisplay?.map((item, index) => {
              return (
                <tr key={index} className='campaign-inputs'>
                  <td>{item?.campaign_name}</td>
                  <td>{item?.influencer_name}</td>
                  <td>
                    <button
                      onClick={() => {
                        setViewModal({ toggle: true, value: item })
                      }}
                      style={{ marginRight: 15 }}
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{ color: "#fff", width: "15px", height: "15px" }}
                      />
                    </button>
                  </td>
                </tr>
              )
            })
          }
        </>
      )
    } else if (additionalProp == "pending") {
      return (
        <>
          {currentItemsToDisplay?.length > 0 && currentItemsToDisplay?.map((item, index) => {
              console.log(item.product)
              return (
                <tr key={index} className='campaign-inputs'>
                  <td>{item?.campaign_name}</td>
                  <td>
                    {productsListing(item?.product)}
                  </td>
                  <td>
                    {/* { item?.product.split(",").join("") } */}
                    {couponListing(item?.product, "coupons")}
                  </td>
                  <td>
                    {couponListing(item?.product, "discount")}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        editCamp(item?.campaignid_id)
                      }}
                      style={{ marginRight: 15 }}
                    >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{ color: "#fff", width: "15px", height: "15px" }}
                      />
                    </button>
                    <button onClick={() => { setDeleteModal({ toggle: true, value: item?.campaignid_id }) }}>
                      <img src={Delete} alt='delete-icon' />
                    </button>
                  </td>
                </tr>
              )
            })
          }
        </>
      )
    } else if (additionalProp == "declined") {
      return (
        <>
          {currentItemsToDisplay?.length > 0 && currentItemsToDisplay?.map((item, index) => {
              return (
                <tr key={index} className='campaign-inputs'>
                  <td>{item?.campaign_name}</td>
                  <td>{productsListing(item?.product)}</td>
                  <td> {couponListing(item?.product, "coupons")}</td>
                  <td>{couponListing(item?.product, "discount")}</td>
                </tr>
              )
            })
          }
        </>
      )
    } else if (additionalProp == "awaiting") {
      return (
        <>
          {currentItemsToDisplay?.length > 0 && currentItemsToDisplay?.map((item, index) => {
              return (
                <tr key={index} className='campaign-inputs'>
                  <td>{item?.campaign_name}</td>
                  <td>{productsListing(item?.product)}</td>
                  <td>
                    {couponListing(item?.product, "coupons")}
                  </td>
                  <td>
                    {item?.admin_fee}
                  </td>
                  <td>
                    {item?.commission}%
                  </td>
                  <td>{item?.influencer_fee || "null"}</td>
                  <td>
                    {item?.influencer_fee !== null ? (
                      <>
                        <button className='bg-black text-white me-3' onClick={() => {
                            setOpenModal({
                              toggle: true,
                              influencer_id: item?.user_influencer,
                              camp_id: item?.campaignid_id,
                              user_id: item?.vendor_campaign,
                              admin_fee: item?.admin_fee,
                              amount: item?.influencer_fee,
                              id: item?.influencer_id,
                              coupon: item?.product[0].coupon_name,
                              coupom_amount:item?.product[0].amount,
                            })
                          }}>
                          Pay
                        </button>
                        <button className='bg-black text-white' onClick={() => { handleReject({ camp_id: item?.campaignid_id, id: item?.influencer_id }) }}>
                          Reject
                        </button>
                      </>
                    ) : (
                      <>
                      </>
                    )}

                    <PaymentModal data={open_modal} handler={(value) => { setOpenModal(value) }} setIsPaid={setIsPaid} />
                  </td>
                </tr>
              )
            })
          }
        </>
      )
    }
    else {
      return (
        <>
          {currentItemsToDisplay?.length > 0 && currentItemsToDisplay?.map((item, index) => {
              return (
                <tr key={index} className='campaign-inputs'>
                  <td>{item?.campaign_name}</td>
                  <td>{productsListing(item?.product)}</td>
                  <td>
                    {couponListing(item?.product, "coupons")}
                  </td>
                  <td>
                    {couponListing(item?.product, "discount")}
                  </td>
                </tr>
              )
            })
          }
        </>
      )
    }
  }

  return (
    <>
    
      <table className='w-100 campaign table-striped'>
        <thead className='w-100'>
          {headRows()}
        </thead>
        <tbody className='w-100'>
          {contentRows()}
        </tbody>
      </table>
      <div className="table-pagination d-flex justify-content-center align-items-center mt-4">
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className='page-btn' style={{ marginRight: 10 }}>
          <FontAwesomeIcon icon={faChevronLeft} style={{ color: "#fff", width: "15px", height: "15px" }} />
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={currentPage === pageNumber ? 'active page-num' : 'page-num'}
            style={{ margin: '0 5px' }}
          >
            {pageNumber}
          </button>
        ))}
        <button onClick={handleNextPage} className='page-btn' disabled={currentPage === totalPages} style={{ marginLeft: 10 }}>
          <FontAwesomeIcon icon={faChevronRight} style={{ color: "#fff", width: "15px", height: "15px" }} />
        </button>
      </div>
      <DeleteModal data={delete_modal} handler={() => { setDeleteModal({ toggle: false, value: null }) }} />
      <ViewModal data={view_modal} handler={() => { setViewModal({ toggle: false, value: null }) }} productsListing={(value) => productsListing(value)} couponListing={(value, type) => couponListing(value, type)} />
    </>
  )
}


const DeleteModal = ({ data, handler }) => {
  const token = localStorage.getItem("Token");
  const handleDelete = (id) => {
    // e.preventDefault();
    // setLoading(true);
    axios.delete('https://api.myrefera.com/campaign/delete/' + id + "/", {
      headers: {
        Authorization: `Token ${token}`
      }
    })
      .then(function (response) {
        toast.success("Campaign Deleted Successfully", { autoClose: 1000 })
        handler();
      })
      .catch(function (error) {
        console.log(error);
        toast.warn("Unable to Delete the Coupon", { autoClose: 1000 })
      })
  }
  return (
    <Modal show={data.toggle} backdrop={"static"} centered onHide={() => handler()}>
      <Modal.Header closeButton>
        <h4 className='fw-bold'>Delete Campaign</h4>
      </Modal.Header>
      <Modal.Body>
        Are you sure to delete this campaign?
      </Modal.Body>
      <Modal.Footer>
        <button onClick={() => handleDelete(data?.value)} className='btn btn-danger w-25 me-4'>Confirm</button>
        <button onClick={() => handler()} className='btn w-25 btn-primary'>Cancel</button>
      </Modal.Footer>
    </Modal>
  )
}

const ViewModal = ({ data, handler, productsListing, couponListing }) => {
  return (
    <Modal show={data.toggle} backdrop={"static"} centered onHide={() => handler()}>
      <Modal.Header closeButton>
        <h4 className='fw-bold'>Campaign Info</h4>
      </Modal.Header>
      <Modal.Body>
        <ul style={{ listStyleType: "none" }}>
          <li className="my-2">Campaign Name: <span className="fw-bold text-capitalize">{data?.value?.campaign_name}</span></li>
          <li className="my-2">Product Name: <span className="fw-bold text-capitalize">{productsListing(data?.value?.product)}</span></li>
          <li className="my-2">Date: <span className="fw-bold text-capitalize">{data?.value?.date}</span></li>
          <li className="my-2">End Date: <span className="fw-bold text-capitalize">{data?.value?.end_date}</span></li>
          <li className="my-2">Influencer: <span className="fw-bold text-capitalize">{data?.value?.influencer_name}</span></li>
          <li className="my-2">Influencer Fee: <span className="fw-bold text-capitalize">{data?.value?.influencer_fee}</span></li>
          <li className="my-2">Influencer Visit: <span className="fw-bold text-capitalize">{data?.value?.influencer_visit}</span></li>
          <li className="my-2">Coupon: <span className="fw-bold text-capitalize">{couponListing(data?.value?.product, "coupons")}</span></li>
          <li className="my-2">Discount: <span className="fw-bold text-capitalize">{couponListing(data?.value?.product, "discount")}</span></li>
          <li className="my-2">Description: <span className="fw-bold text-capitalize">{data?.value?.description}</span></li>
        </ul>


      </Modal.Body>
    </Modal>
  )
}

export default CampTable