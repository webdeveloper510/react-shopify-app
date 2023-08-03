import React, { useRef, useEffect, useState } from 'react';
import { Chart, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, LineController, ArcElement, PieController } from 'chart.js';
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

  const [chartPieData, setChartPieData] = useState({
    labels: [],
    datasets: [],
  });

  const [chartCouponData, setChartCouponData] = useState({
    labels: [],
    datasets: [],
  });


  useEffect(() => {
    setLoading(true);
    axios.get(API.BASE_URL + 'analytics/', {
        headers: {
          Authorization: `Token 43272d3b1eb9b1f7beed87ee636d1079483a41ad`,
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
                'red',
                'blue',
              ],
            },
            {
              label: 'Order Data',
              data: analyticsData.order,
              tension: 0.2,
              backgroundColor: [
                'teal',
                'blue',
                'purple',
                'red',
                'green'
              ],
            },
          ],
        };

        setChartSalesData(updatedSalesData);
      })
      .catch(function (error) {
        console.log(error);
      });

      axios.get(API.BASE_URL + 'sale_coup/', {
        headers: {
          Authorization: `Token 43272d3b1eb9b1f7beed87ee636d1079483a41ad`,
        },
      })
      .then(function (response) {
        console.log("SALE COUP", response)
        const campaignSalesData = response.data.campaign_sales;
        const labels = [];
        const data = [];
    
        for (const campaignId in campaignSalesData) {
          if (campaignSalesData.hasOwnProperty(campaignId)) {
            const [salesAmount, campaignName] = campaignSalesData[campaignId];
            labels.push(campaignName);
            data.push(salesAmount);
            console.log("LABELS", labels)
          }
        }

        const labelCount = Object.keys(campaignSalesData).length;
        const colors = [
          'red',
          'teal',
          'blue',
          'purple',
        ];
    
        const updatedPieData = {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: colors.slice(0, labelCount),
            },
          ],
        };
    
        setChartPieData(updatedPieData);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get(API.BASE_URL + 'couponorder/', {
        headers: {
          Authorization: `Token 43272d3b1eb9b1f7beed87ee636d1079483a41ad`,
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
                'red',
                'blue',
                'green',
                'yellow',
                'orange',
                'teak',
                'purple',
                'brown',
                'yellowgreen',
                'tomato'
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
            <div className="chart">
              <h3 className="text-left w-100 d-flex ps-5 mb-4">Campaign Sales</h3>
              <Chart 
              ref={chartPieRef} 
              type="pie" 
              data={chartPieData} 
              options={{
                responsive: true,
              }} />
            </div>

            <div className="chart my-5">
              <h3 className='text-left w-100 d-flex ps-5 mb-4'>Sales Data</h3>
              <Line ref={chartSalesRef} type="line" data={chartSalesData} options={options}></Line>
            </div>

            <div className="chart my-5">
              <h3 className='text-left w-100 d-flex ps-5 mb-4'>Coupon Order</h3>
              <Line ref={chartCouponRef} type="line" data={chartCouponData} options={options}></Line>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sales;