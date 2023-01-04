import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import DashboardLayout from '../../../components/layout';

const Business = () => {
	const externalData = [
		{
			label: `Innova`,
			key: '1',
		},
		{
			label: `Distramar Foods`,
			key: '2',
		},
		{
			label: `Delikart`,
			key: '3',
		},
	];

	const [business, setBusiness] = useState([]);

	useEffect(() => {
		setBusiness(externalData);
	}, []);

	const onChange = (key) => {
		console.log(key);
	};

	return (
		<DashboardLayout>
			<main
				style={{
					margin: '1rem',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<Tabs
					style={{ width: '100%' }}
					defaultActiveKey="1"
					onChange={onChange}
					items={business}
				></Tabs>
			</main>
		</DashboardLayout>
	);
};
export default Business;
