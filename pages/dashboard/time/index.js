import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { Button, ConfigProvider, Space, Table } from 'antd';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';
import { useProductFilter } from '../../../components/products/useProductFilter';
import {
	DeleteOutlined,
	EditOutlined,
	EyeTwoTone,
	PlusOutlined,
} from '@ant-design/icons';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';

const Time = () => {
	const { filtered } = useProductFilter();
	const columns = [
		{
			title: 'Id',
			dataIndex: 'idSucursal_reservation',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Día',
			width: '160px',
			dataIndex: 'nombre',
			responsive: ['md'],
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Fecha de inicio',
			width: '160px',
			dataIndex: 'Startsat',
			responsive: ['md'],
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Fecha final',
			width: '160px',
			dataIndex: 'Endsat',
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
					</Button>
				</Space>
			),
		},
	];

	const data1 = [
		{
			nameProduct: 'holiwi',
		},
		{
			nameProduct: 'holiwi2',
		},
	];

	const { requestHandler } = useRequest();
	const [days, setDays] = useState(data1);

	const getReports = async () => {
		const res = await requestHandler.get('/api/v2/mapas/list/reservation/1');
		if (!res.isLeft()) {
		const value = res.value._value.response;
		setDays(value);
		}
	};

	 useEffect(() => {
		getReports();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[]);
 
	return (
		<DashboardLayout>
			<div className="m-4 p-4">
				<Title title={'Dias y horarios laborales'}>
					<div className="flex gap-5">
						<Button className="bg-white" onClick={() => getReports()}>
							<PlusOutlined />
							Generar días año actual
						</Button>
						<Button className="bg-white">?</Button>
					</div>
				</Title>
				<ConfigProvider
					renderEmpty={
						filtered().length !== 0 || true ? CustomizeRenderEmpty : ''
					}
				>
					<Table columns={columns} dataSource={days} />
				</ConfigProvider>
			</div>
		</DashboardLayout>
	);
};

export default Time;
