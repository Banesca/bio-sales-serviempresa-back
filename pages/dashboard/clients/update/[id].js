import { Button, Col, Row } from 'antd';
import DashboardLayout from '../../../../components/shared/layout';
import { Form } from 'antd';
import { Input } from 'antd';
import Title from '../../../../components/shared/title';
import { message } from 'antd';
import { useLoadingContext } from '../../../../hooks/useLoadingProvider';
import Loading from '../../../../components/shared/loading';
import { useRequest } from '../../../../hooks/useRequest';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { GeneralContext } from '../../../_app';
import useClients from '../../../../components/clients/hooks/useClients';

export default function EditClient() {
	const { loading, setLoading } = useLoadingContext();
	const { requestHandler } = useRequest()

	const regexpTlp = /^(0414|0424|0412|0416|0426)[-][0-9]{7}$/g
	const regexpRif = /^([VEJPGvejpg]{1})-([0-9]{8})-([0-9]{1}$)/g

	const [form] = Form.useForm();
	const [client, setClient] = useState({});

	const onReset = () => {
		form.resetFields();
		console.log(client);
	};

	const router = useRouter();
	const { id } = router.query;
	
	const getClientRequest = async () => {
		setLoading(true);
		const res = await requestHandler.get(`/api/v2/client/get/${id}`);
		if (res.isLeft()) {
			setLoading(false);
			return console.log('error')
		}
		const value = res.value.getValue();
		if (!value.data) {
			setLoading(false);
			return message.error('Cliente no encontrado');
		}
		setClient(value.data);
		setLoading(false);
	};
	

	// Clients list request 
	
	const { clients, listClients } = useClients();
	
	const getClientsRequest = async () => {
		setLoading(true);
		try {
			await listClients();
		} catch (error) {
			message.error('Ha ocurrido un error');
		} finally {
			setLoading(false);
		}
	};
	
	
	// validator
	
	const validator = (data) => {
		console.log(clients);
		console.log(data);
		return {
			val : Object.values(clients.map(client => {
				if(client.phone == data.phoneClient || client.numberDocument == data.rif) {
					return true;
				}
			})).includes(true),
			prob: () => {
				let calc = Object.values(clients.map(client => {
					if(client.phone == data.phoneClient && client.numberDocument == data.rif) {
						return 1;
					} else if (client.phone == data.phoneClient) {
						return 2;
					} else if (client.numberDocument == data.rif) {
						return 3;
					}
				}
				));
				if(calc.includes(1) || calc.includes(2) && calc.includes(3)) {
					return 'El número de teléfono y el Rif ya están en uso';
				} else if (calc.includes(2)) {
					return 'El número de telefono ya esta en uso';
				} else if (calc.includes(3)) {
					return 'El número de Rif ya esta en uso';
				}
			}
		}
	}
	
	const generalContext = useContext(GeneralContext);
	
		
	useEffect(() => {
		if (Object.keys(generalContext).length) {
			getClientsRequest();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext]);
	
	// Validator end
	


	const handleSubmit = async (values) => {
		setLoading(true);
		if(createClient(values)) {
			setLoading(false);
		} else {
			form.resetFields()
			router.push('/dashboard/clients');
		}
	};


	const createClient = async (data) => {
		setLoading(true);
		await getClientsRequest();
		try {
			if(!(validator(data).val)) {
				const res = await requestHandler.put('/api/v2/client/update', {
					nameClient: data.fullNameClient,
					phone: data.phoneClient,
					mail: null,
					numberDocument: data.rif,
					address: data.address,
					idStatusFK: 1,
					observacion: data.comments,
					idClient: client.idClient
				});
				message.success('Cliente agregado');
				router.push('/dashboard/clients');
			} else {
				console.log(validator(data).prob());
				message.error(validator(data).prob());
			}


		} catch (error) {
			console.log(data);
			message.error('Error al actualizar cliente');
		} finally {
			setLoading(false);
		}
	};
	
	if (Object.entries(client).length === 0) {
		getClientRequest();
		return <Loading isLoading={true} />;
	}
	


	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Title
					goBack={1}
					path={'/dashboard/clients'}
					title="Actualizar Cliente"
				></Title>
				<div style={{
					maxWidth: '900px',
					margin: '1rem 2rem',
					backgroundColor: 'white',
					boxShadow: '4px 4px 8px rgba(180, 180, 180, 0.479)',
					padding: '60px',
					borderRadius: '20px'
				}}>
					<Form
						style={{ width: '100%' }}
						form={form}
						onFinish={handleSubmit}
						initialValues={{
							fullNameClient: client?.nameClient,
							phoneClient: client?.phone,
							address: client?.address,
							rif: client?.numberDocument,
							comments: client?.observacion
						}}
					>
						<Row>
							<Col
								xs={{ span: 24 }}
								sm={{ span: 24 }}
								md={{ span: 12 }}
							>
								<Form.Item
									label="Razón Social"
									style={{
										padding: '0 .5rem',
									}}
									labelCol={{
										md: { span: 10 },
										sm: { span: 6 },
									}}
									wrapperCol={{
										md: { span: 14 },
										sm: { span: 18 },
									}}
									rules={[
										{
											required: true,
											message:
												'Razón social es requerido',
										},
									]}
									name="fullNameClient"
									value={{fullNameClient: client.nameClient}}
								>
									<Input type="text"  />
								</Form.Item>
							</Col>
							<Col
								xs={{ span: 24 }}
								sm={{ span: 24 }}
								md={{ span: 12 }}
							>
								<Form.Item
									label="Teléfono"
									style={{
										padding: '0 .5rem',
									}}
									rules={[
										{
											required: true,
											message:
												'Ingresa un numero de teléfono',
										},
										{
											pattern: regexpTlp,
											message:
												'Ingresa un numero de telefono valido'
										}
									]}
									labelCol={{
										md: { span: 10 },
										sm: { span: 6 },
									}}
									wrapperCol={{
										md: { span: 14 },
										sm: { span: 18 },
									}}
									name="phoneClient"
								>
									<Input type="tel" />
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col
								xs={{ span: 24 }}
								sm={{ span: 24 }}
								md={{ span: 12 }}
							>
								<Form.Item
									labelCol={{
										md: { span: 10 },
										sm: { span: 6 },
									}}
									wrapperCol={{
										md: { span: 14 },
										sm: { span: 18 },
									}}
									label="Dirección"
									style={{
										padding: '0 .5rem',
									}}
									rules={[
										{
											required: true,
											message:
												'Ingresa la dirección del cliente',
										},
									]}
									name="address"
								>
									<Input type="text" />
								</Form.Item>
							</Col>
							<Col
								xs={{ span: 24 }}
								sm={{ span: 24 }}
								md={{ span: 12 }}
							>
								<Form.Item
									label="Rif"
									labelCol={{
										md: { span: 10 },
										sm: { span: 6 },
									}}
									wrapperCol={{
										md: { span: 14 },
										sm: { span: 18 },
									}}
									style={{
										padding: '0 .5rem',
									}}
									rules={[
										{
											required: true,
											message:
												'Ingresa el rif del cliente',
										},
										{
											pattern: regexpRif,
											message: 
												'Ingresa un rif valido'
										}
									]}
									name="rif"
								>
									<Input type="text" placeholder='Formate aceptado: j-12345678-1' />
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<Form.Item
									labelCol={{
										md: { span: 5 },
										sm: { span: 6 },
									}}
									wrapperCol={{
										md: { span: 19 },
										sm: { span: 18 },
									}}
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
							<Col
								sm={{ span: 10, offset: 0 }}
								xs={{ span: 10, offset: 0 }}
								lg={{ span: 7, offset: 5 }}
								md={{ span: 7, offset: 5 }}
							>
								<Form.Item>
									<Button type='warning' block onClick={onReset} >
										Limpiar
									</Button>
								</Form.Item>
							</Col>
							<Col
								sm={{ span: 10, offset: 4 }}
								xs={{ span: 10, offset: 4 }}
								lg={{ span: 7, offset: 5 }}
								md={{ span: 7, offset: 5 }}
							>
								<Form.Item>
									<Button
										htmlType="submit"
										type="success"
										block
									>
										Actualizar
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</div>
			</div>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
}
