import { useContext, useEffect, useState } from 'react';
import { Switch, Select, Input, Col, Form, Row, message, Button } from 'antd';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';
import { GeneralContext } from '../../pages/_app';
import Loading from '../shared/loading';
import { useRequest } from '../../hooks/useRequest';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined, LeftOutlined } from '@ant-design/icons';

const AddOrderForm = (props) => {
	const [loading, setLoading] = useState(false);

	const [clients, setClients] = useState([]);

	const [isNewClient, setIsNewClient] = useState(false);

	const generalContext = useContext(GeneralContext);
	const { selectedBusiness } = useBusinessProvider();
	const { requestHandler } = useRequest();

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
		if (generalContext && selectedBusiness) {
			getClientsRequest();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness]);

	const [form] = Form.useForm();

	const createClient = async (data) => {
		const res = await requestHandler.post('/api/v2/client/add', {
			nameClient: data.fullNameClient,
			phone: data.phoneClient,
			numberDocument: data.rif,
			address: data.address,
			idStatusFK: 1,
			observacion: data.comments,
		});
	};

	const onSubmit = async (values) => {
		setLoading(true);
		const data = {
			address: isNewClient
				? values.address
				: clients[values.selectClient]?.address,
			comments: values.comments,
			deliveryEnLocal: false,
			deliveryEnTienda: false,
			deliveryExterno: false,
			fullNameClient: isNewClient
				? values.fullNameClient
				: clients[values.selectClient]?.nameClient,
			idBranchFk: selectedBusiness.idSucursal,
			idEnvironmentFk: 0, // No estoy seguro de que es environment
			idTableFk: 0,
			idUserOpenFk: Number(localStorage.getItem('userId')),
			moso: null,
			phoneClient: isNewClient
				? values.phoneClient
				: clients[values.selectClient]?.phone,
		};
		if (isNewClient) {
			await createClient(values);
		}
		await props.handleRequest(data);
		setLoading(false);
	};

	const onReset = () => {
		form.resetFields();
	};

	const router = useRouter();

	const handleReturn = () => {
		router.push('/dashboard/orders');
		setLoading(true);
	};

	return (
		<>
			<section
				style={{
					textAlign: 'center',
					fontSize: '2.5rem',
					margin: '1rem',
					display: 'flex',
					width: '100%',
					backgroundColor: 'white !important',
				}}
			>
				<Button
					style={{ marginRight: '50%', height: '42px', borderRadius: '20px' }}
					onClick={handleReturn}
				>
					<LeftOutlined style={{ fontSize: '1.5rem', marginRight: '50%' }} />
				</Button>
				<h2
					style={{ fontSize: '2rem', marginTop: '-5px', marginLeft: '-180px' }}
				>
					Agregar pedido
				</h2>
			</section>
			<div
				style={{
					maxWidth: '800px',
					padding: '0 2rem',
					margin: '1rem auto',
					backgroundColor: 'white',
					boxShadow: '4px 4px 8px rgba(180, 180, 180, 0.479)',
					padding: '60px',
					borderRadius: '20px',
				}}
			>
				<Form
					style={{ width: '100%' }}
					name="addOrder"
					labelCol={{ span: 8 }}
					onFinish={onSubmit}
					autoComplete="off"
					form={form}
				>
					<Row>
						<Col span={12}>
							<Form.Item label="Nuevo Cliente">
								<Switch
									className='bg-gray-300'
									checked={isNewClient}
									onChange={() => setIsNewClient(!isNewClient)}
								/>
							</Form.Item>
						</Col>
						{!isNewClient && (
							<Col span={12}>
								<Form.Item
									label="Cliente"
									rules={[
										{
											required: !isNewClient,
											message: 'Elige un cliente',
										},
									]}
									name="selectClient"
								>
									<Select showSearch>
										{clients &&
											clients.map((c, i) => (
												<Select.Option values={c} key={i}>
													{c.nameClient}
												</Select.Option>
											))}
									</Select>
								</Form.Item>
							</Col>
						)}
					</Row>
					{isNewClient && (
						<>
							<Row>
								<Col span={12}>
									<Form.Item
										label="Razón Social"
										rules={[
											{
												required: isNewClient,
												message: 'Razón social es requerido',
											},
										]}
										name="fullNameClient"
									>
										<Input type="text" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label="Teléfono"
										rules={[
											{
												required: isNewClient,
												message: 'Ingresa un numero de teléfono',
											},
										]}
										name="phoneClient"
									>
										<Input type="number" />
									</Form.Item>
								</Col>
							</Row>
							<Row>
								<Col span={12}>
									<Form.Item
										labelCol={{ span: 8 }}
										label="Dirección"
										rules={[
											{
												required: isNewClient,
												message: 'Ingresa la dirección del cliente',
											},
										]}
										name="address"
									>
										<Input type="text" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										labelCol={{ span: 8 }}
										label="Rif"
										rules={[
											{
												required: isNewClient,
												message: 'Ingresa el rif del cliente',
											},
										]}
										name="rif"
									>
										<Input type="text" />
									</Form.Item>
								</Col>
							</Row>
						</>
					)}
					<Row>
						<Col span={24}>
							<Form.Item
								labelCol={{ span: 4 }}
								label="Observación"
								name="comments"
							>
								<Input.TextArea type="text" rows={4}></Input.TextArea>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<Form.Item
								wrapperCol={{
									span: 12,
									offset: 8,
								}}
							>
								<Button type="warning" block onClick={onReset}>
									Limpiar
								</Button>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item wrapperCol={{ span: 12, offset: 12 }}>
								<Button htmlType="submit" type="success" block>
									Agregar
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
			<Loading isLoading={loading} />
		</>
	);
};

export default AddOrderForm;
