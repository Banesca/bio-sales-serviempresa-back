import { Card, ConfigProvider, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useProductFilter } from '../products/useProductFilter';
import { CustomizeRenderEmpty } from '../common/customizeRenderEmpty';
import { useRequest } from '../../hooks/useRequest';

const PayForm = ({listConditions}) => {
	const { filtered } = useProductFilter();

	const columns = [
		{
			title: 'Condición de pago',
			width: '160px',
			dataIndex: 'note',
			responsive: ['md'],
			key: 2,
			render: (text) => <p>{text}</p>,
		}
	];

	return (
		<div>
			<ConfigProvider
				renderEmpty={
					filtered().length !== 0 || true ? CustomizeRenderEmpty : ''
				}
			>
				<Table columns={columns} dataSource={listConditions} />
			</ConfigProvider>
		</div>
	);
};

export default PayForm;
