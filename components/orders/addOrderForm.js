import { useContext, useEffect, useState } from 'react';
import { Switch, Select, Input, Col, Form, Row, message, Button } from 'antd';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';
import { GeneralContext } from '../../pages/_app';
import Loading from '../shared/loading';
import { useRequest } from '../../hooks/useRequest';
import { useRouter } from 'next/router';

const AddOrderForm = (props) => {
	const [loading, setLoading] = useState(false);

	const [order, setOrder] = useState();
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
	}, [generalContext, selectedBusiness]);

	const [form] = Form.useForm();
	
	const createClient = async (data) => {
		const res = await requestHandler.post(`/api/v2/client/add`, {
			nameClient: data.fullNameClient,
			phone: data.phoneClient,
			numberDocument: data.rif,
			address: data.address,
			idStatusFK: 1,
			observacion: data.comments
		})
		console.log(res)
	}

	const onSubmit = async (values) => {
		setLoading(true);
		const data = {
			address: isNewClient ? values.address : null,
			comments: values.comments,
			deliveryEnLocal: false,
			deliveryEnTienda: false,
			deliveryExterno: false,
			fullNameClient: isNewClient
				? values.fullNameClient
				: values.selectClient,
			idBranchFk: selectedBusiness.idSucursal,
			idEnvironmentFk: 0, // No estoy seguro de que es environment
			idTableFk: 0,
			idUserOpenFk: Number(localStorage.getItem('userId')),
			moso: null,
			phoneClient: isNewClient ? values.phoneClient : null,
		};
		if (isNewClient) {
			await createClient(values)
		}
		console.log(data);
		await props.handleRequest(data);
		setLoading(false);
	};

	const onReset = () => {
		form.resetFields();
	};

	return (
		<>
			<h1
				style={{
					color: 'white',
					fontSize: '2rem',
					textAlign: 'center',
				}}
			>
				Agregar Pedido
			</h1>
			<div
				style={{
					maxWidth: '850px',
					margin: '4rem auto',
					padding: '0 2rem',
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
									checked={isNewClient}
									onChange={() =>
										setIsNewClient(!isNewClient)
									}
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
												<Select.Option
													value={c.nameClient}
													key={i}
												>
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
												message:
													'Razón social es requerido',
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
												message:
													'Ingresa un numero de teléfono',
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
												message:
													'Ingresa la dirección del cliente',
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
												message:
													'Ingresa el rif del cliente',
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
								<Input.TextArea
									type="text"
									rows={4}
								></Input.TextArea>
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
								<Button block onClick={onReset}>
									Limpiar
								</Button>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item wrapperCol={{ span: 12, offset: 12 }}>
								<Button htmlType="submit" type="primary" block>
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
