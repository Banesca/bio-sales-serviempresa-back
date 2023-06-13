import { Card } from 'antd';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const Graphic = ({ borderColor, backgroundColor }) => {
	const data = {
		labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
		datasets: [
			{
				label: 'Ventas',
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: backgroundColor,
				borderColor: borderColor,
				borderWidth: 1,
			},
		],
	};

	const options = {
		scales: {
			y: {
				type: 'linear',
				beginAtZero: true,
			},
		},
	};
	return (
		<Card className="w-[45%] shadow-md">
			<Bar data={data} options={options} />
		</Card>
	);
};

export default Graphic;
