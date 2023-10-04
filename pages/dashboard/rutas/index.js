import {
	Button,
	Card,
	Col,
	ConfigProvider,
	Form,
	Modal,
	Row,
	Select,
	Space,
	Table,
	Meta,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';
import { useProductFilter } from '../../../components/products/useProductFilter';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { useRequest } from '../../../hooks/useRequest';
import { ip } from '/util/environment.js';
import { FileImageOutlined } from '@ant-design/icons';

const Rutas = () => {
	const { requestHandler } = useRequest();
	const [users, setUsers] = useState([]);
	const [reportProduct, setReportProduct] = useState([]);
	const { filtered } = useProductFilter();
	

	const columns = [
		{
			title: 'Ruta Inicial',
			dataIndex: 'name',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Ruta Final',
			dataIndex: 'description',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
	];
	
	useEffect(() => {
		getUsers();
	}, []);

	const getUsers = async () => {
		const res = await requestHandler.get('/api/v2/user/only/enable');
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.data.filter((b) => b.idProfileFk == 4);
			setUsers(value);
		}
		console.log(res)
	};

	const handleOnChange = async (value) => {
		const res = await requestHandler.get(
			`/api/v2/ordersbypassingh/get/${value}`
		);
		console.log(res)
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.response;
			setReportProduct(value);
		}
	};

	return (
		<DashboardLayout>
			<div className="m-4 p-4">
				<Title title={'Rutas del despachador'}></Title>
				<Row>
					<Col span={12}>
						<Form.Item
							label="Despachador"
							rules={[
								{
									required: true,
									message: 'Elige un despachador',
								},
							]}
							name="selectClient"
						>
							<Select onSelect={(value, event) => handleOnChange(value, event)}>
								{users &&
									users.map((c) => (
										<Select.Option value={c.idUser} key={c.idUser}>
											{c.fullname}
										</Select.Option>
									))}
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<div className="flex flex-col gap-5">
					<ConfigProvider
						renderEmpty={
							filtered().length !== 0 || true ? CustomizeRenderEmpty : ''
						}
					>
					<Table columns={columns} dataSource={reportProduct} /> 
					</ConfigProvider>
				
				</div>
			</div>
		</DashboardLayout>
	);
};

export default Rutas;
