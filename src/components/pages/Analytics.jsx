import React, {useState, useEffect} from 'react';
import MenuBar from '../navbar/Navbar';
import './pages.scss';
import SideBar from '../sidebar/Sidebar';
import axios from 'axios';
import { API } from '../../config/Api';
import { BarChart } from './BarChart';
import {CanvasJSChart} from 'canvasjs-react-charts'

import AnalyticsGraph from '../../assests/img/analytics-graph.png';
import ArrowUp from '../../assests/img/arrow-up.png';
// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Analytics() {
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("Token");
    const [graphData, setGraphData] = useState([])
    useEffect(() => {
        setLoading(true);
            axios.get(API.BASE_URL + 'sale_record/',  {
                headers: { 
                    Authorization: `Token ${token}` 
                }
            }) 
            .then(function (response) {
                console.log("Sales Details", response);
                setGraphData(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
        
        .finally(() => setLoading(false));
    }, [token])
    console.log("graphData", graphData)
    const options = {
        title: {
            text: ""
        },
        data: [
        {
            // Change type to "doughnut", "line", "splineArea", etc.
            type: "column",
            dataPoints: [
                { label: "Last Seven Days",  y: graphData.seven_days  },
                { label: "Last Thirty Days", y: graphData.thirty_days  },
                {label: "Year", y: graphData.year}
            ]
        }
        ]
    }
  return (
    <>
    {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p>Processing...</p></div>}
    <div className="analytics page p-4 d-flex flex-column">
        <div className="analytics-container d-flex justify-content-between mt-4 col-12">
            <div className="analytics-status bg-light p-4 col-12">
                <h3 className='fw-bold'>Analytics</h3>
                <p className='mb-5'>Status</p>
                <div className="graph">
                <CanvasJSChart className='canvas-graph' options = {options} />
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Analytics