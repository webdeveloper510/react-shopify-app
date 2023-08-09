import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../../config/Api';
import { Chart } from 'react-google-charts';
import './pages.scss';

function Sales() {
  const token = localStorage.getItem("Token");
  const [loading, setLoading] = useState(false);
  const [chartPieData, setChartPieData] = useState([]);
  const [chartSalesData, setChartSalesData] = useState([]);
  const [chartCouponData, setChartCouponData] = useState([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    setLoading(true);
    axios.get(API.BASE_URL + 'analytics/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then(function (response) {
      console.log("Sales Data", response);
      const analyticsData = response.data;

      const salesData = analyticsData.sales_data;
      const orderData = analyticsData.order;

      const chartSalesFormattedData = [
        ['Month', 'Sales Data', 'Order Data'],
        ...months.map((month, index) => [month, salesData[index], orderData[index]]),
      ];

      setChartSalesData(chartSalesFormattedData);
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
        Authorization: `Token ${token}`,
      },
    })
    .then(function (response) {
      console.log("Coupon Data", response);
      const couponData = response.data;

      const chartCouponFormattedData = [
        ['Coupon Name', 'Count'],
        ...couponData.map(item => [item.coupon_name, item.count]),
      ];

      setChartCouponData(chartCouponFormattedData);
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

      const updatedPieData = [
        ['Label', 'Value'],
        ...labels.map((label, index) => [label, data[index]]),
      ];

      setChartPieData(updatedPieData);
    })
    .catch(function (error) {
      console.log(error);
    });
  }, []);

  return (
    <>
      <div className="sales p-4 page">
        {/* Loading indicator */}
        {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
        <div className="sales-container">
          <h2 className="my-5">Sales overview</h2>
          <div className="earnings-list d-flex flex-column justify-content-center align-items-center">
            {/* Campaign Sales Pie Chart */}
            <h3 className="text-left w-100 d-flex ps-5 mb-4">Campaign Sales</h3>
            <div className="chart">
            <Chart
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={chartPieData}
                options={{
                  responsive: true,
                  is3D: true,
                }}

                width={"100%"}
                height={"500px"}
              />
            
            </div>

            {/* Sales Data Line Chart */}
            <h3 className='text-left w-100 d-flex ps-5 mt-5 mb-4'>Sales Data</h3>
            <div className="chart mb-5">

            <Chart
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={chartSalesData}
                options={{
                  responsive: true,
                  curveType: "function",
                  intervals: { style: "line" },
                  legend: "none",
                }}
                width={"100%"}
                height={"400px"}
              />
            </div>

            {/* Coupon Order Line Chart */}
            <h3 className='text-left w-100 d-flex ps-5 mt-5 mb-4'>Coupon Order</h3>
            <div className="chart mb-5">
            <Chart
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={chartCouponData}
                options={{
                  responsive: true,
                  curveType: "function",
                  intervals: { style: "line" },
                  legend: "none",
                }}
                width={"100%"}
                height={"500px"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sales;
