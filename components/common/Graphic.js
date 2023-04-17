import React from 'react';
import Chart from 'chart.js/auto';
import { useContext, useEffect, useRef, useState } from 'react';
import { Card } from 'antd';


const Graphic = () => {
	const chartRef = useRef();
	const chartInstanceRef = useRef(null);
	const data = [65, 59, 80, 81, 56, 55, 40];

	useEffect(() => {
		const myChartRef = chartRef.current.getContext('2d');
	
		if (chartInstanceRef.current) {
		  chartInstanceRef.current.destroy();
		}

		const gradient = myChartRef.createLinearGradient(0, 0, 0, 300);
		gradient.addColorStop(0, 'rgba(255, 99, 132, 0.2)');
		gradient.addColorStop(1, 'rgba(255, 99, 132, 0)');
	
		const chartInstance = new Chart(myChartRef, {
		  type: 'line',
		  data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [
			  {
						label: 'My First dataset',
						backgroundColor: gradient,
						borderColor: 'rgb(255, 99, 132)',
						data: data,
						tension: 0.5,
						fill: true
			  },
				],
		  },
		});
	
		chartInstanceRef.current = chartInstance;
	  }, [data]);


	return (
		<Card style={{width: '60%', padding: '50px'}}>
			<table>
				<thead>
					<tr>
						<th>Month</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody>
					{data.map((value, index) => (
						<tr key={index}>
							<td>{`Month ${index + 1}`}</td>
							<td>{value}</td>
						</tr>
					))}
				</tbody>
			</table>
			<canvas ref={chartRef} />
		</Card>
	);
};

export default Graphic;
