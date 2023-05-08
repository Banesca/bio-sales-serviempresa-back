import React from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';

const index = () => {
	return (
		<DashboardLayout>
			<div className="m-4 p-4">
				<Title title={'Camiones'}></Title>
			</div>
		</DashboardLayout>
	);
};

export default index;
