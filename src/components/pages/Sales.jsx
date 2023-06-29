import React, { useRef, useEffect, useState } from 'react';
import { Chart, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, LineController, ArcElement, PieController } from 'chart.js';
import axios from 'axios';
import { API } from '../../config/Api';

import './pages.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, LineController, ArcElement, PieController);


function createGradient(ctx, area) {
  const colors = [
    'teal',
    'blue',
    'purple',
    'red',
    'green'
  ];

  const colorStart = colors[Math.floor(Math.random() * colors.length)];
  let colorMid = colors[Math.floor(Math.random() * colors.length)];
  while (colorMid === colorStart) {
    colorMid = colors[Math.floor(Math.random() * colors.length)];
  }
  let colorEnd = colors[Math.floor(Math.random() * colors.length)];
  while (colorEnd === colorStart || colorEnd === colorMid) {
    colorEnd = colors[Math.floor(Math.random() * colors.length)];
  }

  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(0.5, colorMid);
  gradient.addColorStop(1, colorEnd);

  return gradient;
}

function Sales() {
  const token = localStorage.getItem("Token");
  const chartSalesRef = useRef(null);
  const chartPieRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [chartSalesData, setChartSalesData] = useState({
    labels: [],
    datasets: [],
  });

  const [chartPieData, setChartPieData] = useState({
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
              backgroundColor: createGradient(chartSalesRef.current?.ctx, chartSalesRef.current?.chartArea),
            },
            {
              label: 'Order Data',
              data: analyticsData.order,
              tension: 0.2,
              backgroundColor: createGradient(chartSalesRef.current?.ctx, chartSalesRef.current?.chartArea),
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
          Authorization: `Token ${token}`,
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
              <h4 className="text-left w-100 d-flex ps-5 mb-4">Campaign Sales</h4>
              <Chart 
              ref={chartPieRef} 
              type="pie" 
              data={chartPieData} 
              options={{
                responsive: true,
              }} />
            </div>

            <div className="chart my-5">
              <h4 className='text-left w-100 d-flex ps-5 mb-4'>Sales Data</h4>
              <Line ref={chartSalesRef} type="line" data={chartSalesData} options={options}></Line>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sales;

