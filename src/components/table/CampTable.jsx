import { faChevronLeft, faChevronRight, faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Delete from '../../assests/img/delete.svg';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const CampTable = ({ list, name }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = list?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(list?.length / ITEMS_PER_PAGE);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const navigate = useNavigate()
  const [delete_modal, setDeleteModal] = useState({ toggle: false, value: null })
  const [view_modal, setViewModal] = useState({ toggle: false, value: null })


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

  const productsListing = (list) => {
    let text = "";
    for (let i = 0; i < list?.length; i++) {
      if (list[i]?.product_name !== null) {
        text = text + list[i]?.product_name + ",\n"
      }
    }
    return text !== "" && text !== null ? text : "None"
  }

  const couponListing = (list, field) => {
    let coupontext = "";
    let fixed = 0;
    let percentage = 0;
    for (let i = 0; i < list?.length; i++) {
      if (list[i]?.product_name !== null) {
        for (let j = 0; j < list[i]?.coupon_name?.length; j++) {
          coupontext = coupontext + list[i]?.coupon_name[j] + ",\n"
          if (list[i]?.discount_type[j] === "percentage") {
            percentage = percentage + Number(list[i]?.amount[j])
          } else if (list[i]?.discount_type[j] === "fixed_amount") {
            fixed = fixed + Number(list[i]?.amount[j])
          }
        }
      }
    }
    if (field === "coupons") {
      return coupontext !== null && coupontext !== "" ? coupontext : "None"
    } else {
      return <>{fixed !== 0 ? fixed + "د.إ" : ""} {fixed !== 0 && percentage !== 0 ? "and" : fixed === 0 && percentage === 0 ? "none" : ""} {percentage !== 0 ? percentage + "%" : ""}</>
    }
  }

  const editCamp = (id) => {
    navigate(`/edit-campaign/${id}`)
  }

  const headRows = () => {
    if (name === "active") {
      return (
        <tr className='headings'>
          <th>Campaign Name</th>
          <th>Influencer</th>
          <th>Action</th>
        </tr>
      )
    } else if (name === "pending") {
      return (
        <tr className='headings'>
          <th>Campaign Name</th>
          <th>Products</th>
          <th>Coupons</th>
          <th>Discount</th>
          <th>Actions</th>
        </tr>
      )
    } else if (name === "declined") {
      return (
        <tr className='headings'>
          <th>Campaign Name</th>
          <th>Influencer</th>
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
    if (name === "active") {
      return (
        <>
          {
            currentItems?.length > 0 && currentItems?.map((item, index) => {
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
    } else if (name === "pending") {
      return (
        <>
          {
            currentItems?.length > 0 && currentItems?.map((item, index) => {
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
    } else if (name === "declined") {
      return (
        <>
          {
            currentItems?.length > 0 && currentItems?.map((item, index) => {
              return (
                <tr key={index} className='campaign-inputs'>
                  <td>{item?.campaign_name}</td>
                  <td>{item?.influencer_name}</td>
                </tr>
              )
            })
          }
        </>
      )
    } else {
      return (
        <>
          {
            currentItems?.length > 0 && currentItems?.map((item, index) => {
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
      <table className='w-100 campaign'>
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
  const deleteCampaign = (id) => {
    console.log(id)
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
        <button onClick={() => { deleteCampaign(data?.value) }} className='btn btn-danger w-25 me-4'>Confirm</button>
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