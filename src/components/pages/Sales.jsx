import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, LineController, ArcElement, PieController } from 'chart.js';
import { Chart } from 'react-google-charts';
import axios from 'axios';
import { API } from '../../config/Api';

import './pages.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, LineController, ArcElement, PieController);

function Sales() {
  const token = localStorage.getItem("Token");
  const chartSalesRef = useRef(null);
  const chartPieRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const chartCouponRef = useRef(null);
  const [chartSalesData, setChartSalesData] = useState({
    labels: [],
    datasets: [],
  });

  const [chartPieData, setChartPieData] = useState([]);

  const [chartCouponData, setChartCouponData] = useState({
    labels: [],
    datasets: [],
  });


  useEffect(() => {
    setLoading(true);
    axios.get(API.BASE_URL + 'analytics/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(function (response) {
        console.log("Sales Data", response)
        const analyticsData = response.data;
        const updatedSalesData = {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ],
          datasets: [
            {
              label: 'Sales Data',
              data: analyticsData.sales_data,
              tension: 0.2,
              backgroundColor: [
                '#FF9B9B',
                '#CBFFA9',
              ],
            },
            {
              label: 'Order Data',
              data: analyticsData.order,
              tension: 0.2,
              backgroundColor: [
                '#FF9B9B',
                '#CBFFA9',
                '#FFFEC4',
                '#78C1F3',
                '#FFD6A5'
              ],
            },
          ],
        };

        setChartSalesData(updatedSalesData);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios.get(API.BASE_URL + 'sale_coup/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then(function (response) {
      console.log("SALE COUP", response);
      const campaignSalesData = response.data.campaign_sales;
      const labels = [];
      const data = [];
  
      for (const campaignId in campaignSalesData) {
        if (campaignSalesData.hasOwnProperty(campaignId)) {
          const [salesAmount, campaignName] = campaignSalesData[campaignId];
          labels.push(campaignName);
          data.push(salesAmount);
        }
      }
  
      const labelCount = Object.keys(campaignSalesData).length;
      const colors = [
        '#FF9B9B',
        '#CD6688',
        '#FFFEC4',
        '#7A316F',
        '#FFD6A5',
        '#9BE8D8',
        '#E966A0',
        '#967E76',
        '#C2DEDC',
        '#ECE5C7'
      ];
  
      const updatedPieData = [
        ['Label', 'Value'],
        ...labels.map((label, index) => [label, data[index]]),
      ];
  
      setChartPieData(updatedPieData);
    })
    .catch(function (error) {
      console.log(error);
    })
  })

  useEffect(() => {
    setLoading(true);
    axios.get(API.BASE_URL + 'couponorder/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(function (response) {
        console.log("Sales Dataaaaaa", response)
        const analyticsData = response.data;
        const sales = analyticsData.map(item => item.count);
        const campaignNames = analyticsData.map(item => item.coupon_name);

        const updatedCouponData = {
          labels: campaignNames,
          datasets: [
            {
              label: 'Sales Data',
              data: sales,
              tension: 0.2,
              backgroundColor: [
                '#FF9B9B',
                '#7A316F',
                '#9575DE',
                '#E966A0',
                '#FFD6A5',
                '#9BE8D8',
                '#D7C0AE',
                '#967E76',
                '#C2DEDC',
                '#ECE5C7'
              ],
            },
          ],
        };

        setChartCouponData(updatedCouponData);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const options = {
    plugins: {
      legend: true
    },
  }

  return (
    <>
      <div className="sales p-4 page">
      {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
        <div className="sales-container">
          <h2 className="my-5">Sales overview</h2>
          <div className="earnings-list d-flex flex-column justify-content-center align-items-center">
              <h3 className="text-left w-100 d-flex ps-5 mb-4">Campaign Sales</h3>
            <div className="chart">
            <Chart
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={chartPieData}
              options={{
                responsive: true,
                is3D: true,
                width: '100%',
                height: 500,
                colors: [
                  '#FF9B9B',
                  '#CD6688',
                  '#FFFEC4',
                  '#7A316F',
                  '#FFD6A5',
                  '#9BE8D8',
                  '#E966A0',
                  '#967E76',
                  '#C2DEDC',
                  '#ECE5C7'
                ]
              }}
            />
            </div>

            <h3 className='text-left w-100 d-flex ps-5 mt-0 mb-4'>Sales Data</h3>
            <div className="chart mb-5">
              <Line ref={chartSalesRef} type="line" data={chartSalesData} options={options}></Line>
            </div>

            <h3 className='text-left w-100 d-flex ps-5 mt-5 mb-4'>Coupon Order</h3>
            <div className="chart mb-5">
              <Line ref={chartCouponRef} type="line" data={chartCouponData} options={options}></Line>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sales;