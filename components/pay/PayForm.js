import { Card, ConfigProvider, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useProductFilter } from '../products/useProductFilter';
import { CustomizeRenderEmpty } from '../common/customizeRenderEmpty';
import { useRequest } from '../../hooks/useRequest';

const PayForm = ({listConditions}) => {
	const { filtered } = useProductFilter();

	const columns = [
		{
			title: 'Id',
			dataIndex: 'idPaymenConditions',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Condicion de pago',
			width: '160px',
			dataIndex: 'note',
			responsive: ['md'],
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			align: 'center',
			key: 6,
			render: (product, index) => (
				<Space
					size="small"
					style={{ justifyContent: 'center', display: 'flex' }}
				>
					{/* <Button
						type="primary"
						onClick={() => {
							setLoading(true);
							router.push(`/dashboard/products/${product.idProduct}`);
						}}
					>
						<EyeTwoTone />
					</Button>
					<Button
						onClick={() => {
							setLoading(true);
							router.push(`/dashboard/products/update/${product.idProduct}`);
						}}
					>
						<EditOutlined />
					</Button>
					<Button
						type="primary"
						danger
						onClick={() => handleOpenDeleteModal(product)}
					>
						<DeleteOutlined />
					</Button> */}
				</Space>
			),
		},
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
