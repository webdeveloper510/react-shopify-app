import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faClose, faCheck, faXmark, faEye, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Delete from '../../assests/img/delete.svg';

const CampaignTable = ({
  campList,
  getSingleMarket,
  deleteConfirm,
  getDeleteConfirm,
  getMarket,
  couponCross,
  getMarketInfo,
  handleProdDiscount,
  prodDiscount,
  handleInfluenceVisit,
  influenceVisit,
  editCampaign,
  deleteCampaign,
  getId,
  showMarket,
  handleCampName,
  campName,
  handleProdOffer,
  handleVendorAccept,
  handleVendorDecline,
  showButtons = true,
  approved = true,
  approvedButtons = true,
  declineInflu = true,
  showEdit = true,
  marketData = false,
  campEdit = false
}) => {
  const [usernameMap, setUsernameMap] = useState({});
  const token = localStorage.getItem('Token');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = campList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(campList.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePreviousPage = () => {
      if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      }
  };

  const handleNextPage = () => {
      if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      }
  };
  useEffect(() => {
    axios
      .get("https://api.myrefera.com/campaign/influencer/list/", {
        headers: {
            Authorization: `Token ${token}`
    }})
      .then((response) => {
        const influencerData = response.data.data;
        console.log("NKJNKNKNKNKJNJK", response)

        const map = {};
        influencerData.forEach((influencer) => {
          map[influencer.id] = influencer.username;
        });

        setUsernameMap(map);
        console.log("setUsernameMap", usernameMap)
      })
      .catch((error) => {
        console.error("Error fetching influencer data:", error);
      });
  }, [token]);

  const getUsernameForCampaign = (campaignId) => {
    const username = usernameMap[campaignId];
    return username ? username : "N/A";
  };
  return (
    <>
    <table className='w-100 campaign'>
      <tbody className='w-100'>
        <tr className='headings'>
          <th>Campaign Name</th>
          {marketData == false && (!approvedButtons && (<th>Products</th>))}
          {approved && (<th>Influencer</th>) || marketData == true && (<th>Influencer</th>)}
          
          {!approvedButtons && (
            <>
            <th>Coupons</th>
            <th>Discount</th>
            </>
          )}
          {declineInflu && (
            <th>Actions</th>
          )|| marketData == true &&(
            <th>Actions</th>
          ) || declineInflu == false && campEdit == true &&(
            <th>Actions</th>
          )}
        </tr>
        {currentItems?.map((name, i) => {
          const username = getUsernameForCampaign(name.influencer_name);
          return (
            <>
                <tr key={i} className='campaign-inputs'>
                <td>{name?.campaign_name}</td>
                {!approvedButtons && marketData == false && (
                  <td className='category'>
                    {name.product?.map((name) =>
                    name.product_name
                    ).filter(Boolean).join(", ")}
                  </td>
                )}
                {approvedButtons && (
                  <td>{name.infl_name ? name.infl_name : name.username ? name.username: username }</td>
                ) || marketData == true && (
                  <td>{name.infl_name ? name.infl_name : name.username ? name.username: username}</td>
                )}
                {!approved && marketData == false && (
                  <td>
                    {name.product?.map((name) =>
                    name.coupon_name != null ? name.coupon_name : 'No coupons selected'
                    ).filter(Boolean).join(", ")}
                  </td>
                ) || marketData == true && (
                  <td>{name.coupon_name?.map((name) =>
                    name != null ? name : 'No coupons selected'
                    )}</td>
                )}
                {!approvedButtons && marketData == false && (
                <td>
                  {name.product?.map((product, index) => (
                    <>
                      {product.discount_type && Array.isArray(product.discount_type) ? (
                        product.discount_type.map((discount, i) => (
                          <>
                            {Math.abs(product.amount[i])}
                            {discount === 'percentage' ? '%' : 'Dhs'}
                            {i < product.discount_type.length - 1 ? ' , ' : ''}
                          </>
                        ))
                      ) : (
                        product.amount && Array.isArray(product.amount) && (
                          product.amount.map((amount, i) => (
                            <>
                              {Math.abs(amount)}
                              {i < product.amount.length - 1 ? ' , ' : ''}
                            </>
                          ))
                        )
                      )}
                    </>
                  ))}
                </td>
              
                ) || marketData == true && (
                  <td>{name.amount?.map((name) =>
                    name != null ? name : 'No coupons selected'
                    )}</td>)}
                {declineInflu && (
                  showButtons == true ? (
                    <td>
                      {showEdit && (
                        <button
                        onClick={(event) => {
                            getSingleMarket(name.campaignid_id, event);
                        }}
                        style={{ marginRight: 15 }}
                        >
                        <FontAwesomeIcon
                            icon={faPenToSquare}
                            style={{ color: "#fff", width: "15px", height: "15px" }}
                        />
                        </button>
                      )}
                      <button onClick={() => { deleteConfirm(name.campaignid_id) }}>
                        <img src={Delete} alt='delete-icon' />
                      </button>
                  </td>
                  ):
                  (
                  <td>
                      <button
                      type="button"
                      style={{ marginRight: 15 }}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Accept"
                      onClick={() => {handleVendorAccept(name.campaignid_id, name.influencer_name ?name.influencer_name : name.username, name.coupon_name, name.amount)}}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{
                          color: "#fff",
                          width: "15px",
                          height: "15px",
                        }}
                      />
                    </button>
                    <button
                      type="button"
                      data-toggle="tooltip"
                      data-placement="top"
                      style={{ marginRight: 15 }}
                      title="Decline"
                      onClick={() => {handleVendorDecline(name.campaignid_id, name.influencer_name ?name.influencer_name : name.username, name.coupon_name, name.amount)}}
                    >
                      <FontAwesomeIcon
                        icon={faXmark}
                        style={{
                          color: "#fff",
                          width: "15px",
                          height: "15px",
                        }}
                      />
                    </button>
                  </td>
                  
                  )
                  
                )}
                {declineInflu == false && campEdit == true && (
                  <td>
                  <button
                  onClick={(event) => {
                      showMarket(event, name.campaignid_id);
                  }}
                  style={{ marginRight: 15 }}
                  >
                  <FontAwesomeIcon
                      icon={faEye}
                      style={{ color: "#fff", width: "15px", height: "15px" }}
                  />
                  </button>
                </td>
                )}
                </tr>
                {getDeleteConfirm && 
                    <div className="get-coupon">
                        <div className="get-coupon-contianer">
                            <button className='close' onClick={couponCross}>
                                <FontAwesomeIcon icon={faClose} style={{ color: "$blackColor", width: "25px", height: "25px"}} />
                            </button>
                            <div className="confirm">
                                <h4 className='mb-4 text-center'>Delete Campaign?</h4>
                                <div className="buttons d-flex justify-content-center align-items-center">
                                    <button onClick={() => { deleteCampaign(getId)}} className='btn btn-danger w-25 me-4'>Confirm</button>
                                    <button onClick={couponCross} className='btn w-25 btn-primary'>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {getMarket && 
                    <div className="get-coupon">
                        <div className="get-coupon-contianer">
                        <h3>Campaign Info</h3>
                        <button className='close' onClick={couponCross}>
                            <FontAwesomeIcon icon={faClose} style={{ color: "000", width: "25px", height: "25px"}} />
                        </button>
                        <div className="get-coupon-info"></div>
                        <form action="">
                            <div className="input-container">
                                <label>Campaign Name: <strong className="ms-2">{getMarketInfo?.campaign_name}</strong></label>
                            </div>
                            <div className="input-container">
                                <label>Product Name: <strong className="ms-2">{getMarketInfo?.product_name}</strong></label>
                            </div>
                            <div className="input-container">
                                <label>Date: <strong className="ms-2">{getMarketInfo?.date}</strong></label>
                            </div>
                            <div className="input-container">
                                <label>End Date: <strong className="ms-2">{getMarketInfo?.end_data}</strong></label>
                            </div>
                            <div className="input-container">
                              <label htmlFor="">Influencer: <strong className="ms-2">{name.username ? name.username : username}</strong></label>
                            </div>
                            <div className="input-container">
                                <label>Influencer Fee: <strong className="ms-2">{getMarketInfo?.influencer_fee}{getMarketInfo?.offer == 'percentage' ? "%" : "د.إ"}</strong></label>
                            </div>
                            <div className="input-container">
                                <label>Influencer Visit: <strong className="ms-2">{getMarketInfo?.influencer_visit}</strong></label>
                            </div>
                            <div className="input-container">
                                <label>Coupon: <strong className="ms-2">{getMarketInfo?.product?.map((coupon) => coupon.coupon_name)}</strong></label>
                            </div>
                            <div className="input-container">
                            <label>
                              Discount:{' '}
                              <strong className="ms-2">
                                {getMarketInfo?.product?.map((coupon) => (
                                  <span>
                                    {Math.abs(coupon.amount)}
                                  </span>
                                ))}
                              </strong>
                            </label>
                            </div>
                            <div className="input-container">
                                <label>Description: <strong className="ms-2">{getMarketInfo?.description}</strong></label>
                            </div>
                        </form>
                        </div>
                    </div>
                }
            </>
          );
        })}
      </tbody>
    </table>
    <div className="table-pagination d-flex justify-content-center align-items-center mt-4">
    <button onClick={handlePreviousPage} disabled={currentPage === 1} className='page-btn' style={{marginRight: 10}}>
        <FontAwesomeIcon icon={faChevronLeft} style={{ color: "#fff", width: "15px", height: "15px"}} />
    </button>
    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
    <button
        key={pageNumber}
        onClick={() => paginate(pageNumber)}
        className={currentPage === pageNumber ? 'active page-num' : 'page-num'}
        style={{margin: '0 5px'}}
    >
        {pageNumber}
        </button>
    ))}
    <button onClick={handleNextPage} className='page-btn' disabled={currentPage === totalPages} style={{marginLeft: 10}}>
        <FontAwesomeIcon icon={faChevronLeft} style={{ transform: 'rotate(180deg)', color: "#fff", width: "15px", height: "15px"}} />
    </button>
  </div>
  </>
  );
};

export default CampaignTable;