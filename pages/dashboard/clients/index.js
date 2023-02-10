import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import {
	Col,
	Collapse,
	Input,
	Row,
	Button,
	Space,
	Modal,
	Table,
	Form,
} from 'antd';
import { useContext, useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import { useRouter } from 'next/router';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import Loading from '../../../components/shared/loading';
import { Typography } from 'antd';

export default function ClientsPage() {
	const columns = [
		{
			title: 'Razón social',
			dataIndex: 'nameClient',
			key: 0,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Dirección',
			dataIndex: 'address',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Teléfono',
			dataIndex: 'phoneClient',
			key: 3,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			key: 4,
			render: (_, index) => (
				<Space size="middle">
					<Button
						type="primary"
						onClick={() => router.push(`clients/${_.idClient}`)}
					>
						<EyeTwoTone />
					</Button>
					<Button type="primary" danger>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];

	const router = useRouter();

	const [loading, setLoading] = useState(true);
	// Modal
	const [isModalOpen, setIsModalOpen] = useState(false);

	// clients
	const [clients, setClients] = useState([]);
	const [query, setQuery] = useState({
		nameClient: '',
		phone: '',
		address: '',
	});

	const handleSeeModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const { requestHandler } = useRequest();
	const generalContext = useContext(GeneralContext);

	const getClientsRequest = async () => {
		setLoading(true);
		const res = await requestHandler.get('/api/v2/client/list');
		if (res.isLeft()) {
			setLoading(false);
			return;
		}
		setClients(res.value.getValue().response);
		setLoading(false);
	};

	useEffect(() => {
		if (generalContext) {
			getClientsRequest();
		}
	}, [generalContext]);

	const [form] = Form.useForm();

	const onReset = () => {
		setQuery({
			fullNameClient: '',
			phoneClient: '',
			address: '',
		});
		form.resetFields();
	};

	const clientsList = useMemo(() => {
		let list = clients;
		for (const [key, value] of Object.entries(query)) {
			console.log([key, value]);
			if (value) {
				list = list.filter((c) =>
					c[key]?.toLowerCase().includes(query[key].toLowerCase())
				);
			}
		}
		return list;
	}, [query, clients]);

	const handleSearch = (values) => {
		setQuery({
			nameClient: values.fullNameClient || '',
			phone: values.phoneClient || '',
			address: values.address || '',
		});
	};

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Row style={{ alignItems: 'center' }}>
					<Col offset={6} span={12}>
						<Typography>
							<h1
								style={{
									textAlign: 'center',
									fontSize: '2rem',
								}}
							>
								Clientes
							</h1>
						</Typography>
					</Col>
				</Row>
				<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
					<Collapse.Panel header="Filtros">
						<Row style={{ justifyContent: 'center' }}>
							<Form
								labelCol={{ span: 8 }}
								style={{ width: '800px' }}
								form={form}
								onFinish={handleSearch}
							>
								<Row>
									<Col span={12}>
										<Form.Item
											name="fullNameClient"
											label="Razon social"
										>
											<Input type="text" />
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											name="phoneClient"
											label="Teléfono"
										>
											<Input type="text" />
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item
											name="address"
											label="Dirección"
										>
											<Input type="text" />
										</Form.Item>
									</Col>
									{/* <Col span={12}>
										<Form.Item name="rif" label="Rif">
											<Input type="text" />
										</Form.Item>
									</Col> */}
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item
											wrapperCol={{
												span: 12,
												offset: 8,
											}}
										>
											<Button onClick={onReset} block>
												Limpiar
											</Button>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											wrapperCol={{
												span: 12,
												offset: 8,
											}}
										>
											<Button
												htmlType="submit"
												type="primary"
												block
											>
												Buscar
											</Button>
										</Form.Item>
									</Col>
								</Row>
							</Form>
						</Row>
					</Collapse.Panel>
				</Collapse>
				<Table columns={columns} dataSource={clientsList} />
			</div>
			<Modal
				title={'Detail'}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleSeeModal}
			>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Modal>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
}
