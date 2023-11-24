import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import NoData from '../../assests/img/no-data.png';
import './pages.scss';
import { influencerCampList } from '../../config/Api';
import CampTable from '../table/CampTable';

const CampaignList = () => {

  const [tabs, setTabs] = useState([{ name: "active", status: 2, list: [] }, { name: "pending", status: 0, list: [] }, { name: "declined", status: 4, list: [] }, { name: "expired", status: null, list: [] }])
  const [loading, setLoading] = useState(false)



  const fetchInfluencerCamp = async () => {
    try {
      influencerCampList().then(res => {
        let list = tabs;
        setLoading(false)
        if (res?.data) {
          for (let j = 0; j < res?.data?.length; j++) {
            if (res?.data[j]?.status === 2 && res?.data[j]?.expiry_status === true) {
              list[0]?.list?.push(res?.data[j])
            } else if (res?.data[j]?.status === 0 && res?.data[j]?.expiry_status === true) {
              list[1]?.list?.push(res?.data[j])
            } else if (res?.data[j]?.status === 4 && res?.data[j]?.expiry_status === true) {
              list[2]?.list?.push(res?.data[j])
            } else {
              list[3]?.list?.push(res?.data[j])
            }
          }
        }
        setTabs(list)
      })
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    setLoading(true)
    try {
      fetchInfluencerCamp();

    } catch (error) {
      console.error(error);
    }

  }, [])

  return (
    <>
      <div className="campaign-manage-container p-4 page">
        {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
        <h2 className='my-5'>Manage Campaign</h2>
        {tabs?.length > 0 ? (
          <Tab.Container id="left-tabs-example" defaultActiveKey="active">
            <Col sm={12}>
              <Nav variant="pills" className="flex-row mb-2 tab-header">
                {
                  tabs?.map((tab, index) => {
                    return (
                      <Nav.Item key={index}>
                        <Nav.Link className="text-capitalize" eventKey={tab?.name}>{tab?.name}</Nav.Link>
                      </Nav.Item>
                    )
                  })
                }
              </Nav>
            </Col>
            <Col sm={12}>
              {loading === false ? (
                <Tab.Content>
                  {
                    tabs?.map((tab, index) => {
                      return (
                        <Tab.Pane key={index} eventKey={tab?.name}>
                          {tab?.list?.length > 0 ? (
                            <>
                              <CampTable list={tab?.list} name={tab?.name} />
                            </>
                          )
                            :
                            (
                              <>
                                <img src={NoData} alt='no-data' style={{ width: '100%', maxHeight: 220, marginTop: '4rem', objectFit: 'contain' }} />
                                <h5 className='mt-4 text-center'>No Active Campaigns right now</h5>
                              </>
                            )}
                        </Tab.Pane>
                      )
                    })
                  }
                </Tab.Content>
              ) : (<> </>)}

            </Col>
          </Tab.Container>
        ) : (<></>)}


      </div>
    </>
  );
}

export default CampaignList;
