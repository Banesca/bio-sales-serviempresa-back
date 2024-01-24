import { Button, Col, Row, Select, InputNumber } from 'antd';
import DashboardLayout from '../../../../components/shared/layout';
import { Form } from 'antd';
import { Input } from 'antd';
import Title from '../../../../components/shared/title';
import { message } from 'antd';
import { useLoadingContext } from '../../../../hooks/useLoadingProvider';
import Loading from '../../../../components/shared/loading';
import { useRequest } from '../../../../hooks/useRequest';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useClients from '../../../../components/clients/hooks/useClients';
import { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function EditClient() {
	const { loading, setLoading } = useLoadingContext();
	const { requestHandler } = useRequest();
	const regexpTlp = /^(0414|0424|0412|0416|0426)[-][0-9]{7}$/g;
	const regexpRif = /^([VEJPGvejpg]{1})-([0-9]{8})-([0-9]{1}$)/g;
	const [form] = Form.useForm();
	const [client, setClient] = useState({});
	const router = useRouter();
	const { id } = router.query;
	const { clients } = useClients();
	const [click, setClick] = useState(false);
	const [isIgtf, setIsIgtf] = useState(client?.isigtf);
	const [isExpiredDate, setIsExpiredDate] = useState(client?.expirationDay);
	const [startDate, setStartDate] = useState(new Date());
	const [minDate, setMinDate] = useState(new Date(), 1);


	const onReset = () => {
		form.resetFields();
		setClient({
			fullNameClient: '',
			phoneClient: '',
			address: '',
			rif: '',
			comments: '',
			dispatchaddress: '',
			limitcredit: '',
		});
		click ? setClick(false) : setClick(true);
	};
	useEffect(() => {
		click ? onReset() : '';
	}, [click]);

	const IGTF = [
		{ label: 'Si', value: 'true' },
		{ label: 'No', value: 'false' },
	];

	const getClientRequest = async () => {
		setLoading(true);
		try {
			const res = await requestHandler.get(`/api/v2/client/get/${id}`);
			const value = res.value.getValue();
			setClient(value.data);
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	};

	const handleSelectChange = (value) => {
		setIsIgtf(value);
	};

	const handleDateChange = (date,dateString) => {
		console.log
		setIsExpiredDate(dateString)
	};

	useEffect(() =>{
		console.log(client)
	},[isExpiredDate])

	const validator = (data) => {
		return {
			val: Object.values(
				clients.map((client) => {
					if (client.phone == data.phoneClient) {
						return true;
					}
				})
			).includes(true),
			prob: () => {
				let calc = Object.values(
					clients.map((client) => {
						if (client.phone == data.phoneClient) {
							return 2;
						}
					})
				);
				if (calc.includes(2)) {
					return 'El número de telefono ya esta en uso';
				}
			},
		};
	};

	const handleSubmit = async (values) => {
		setLoading(true);
		if (updateClient(values)) {
			setLoading(false);
		} else {
			form.resetFields();
			router.push('/dashboard/clients');
		}
	};

	const updateClient = async (data) => {
		setLoading(true);

		await getClientRequest();
		try {
			if (!validator(data).val) {
				const res = await requestHandler.put('/api/v2/client/update', {
					nameClient: data.fullNameClient,
					phone: data.phoneClient,
					mail: null,
					numberDocument: data.rif,
					address: data.address,
					idStatusFK: 1,
					observacion: data.comments,
					idClient: client.idClient,
					limitcredit: data.limitcredit,
					dispatchaddress: data.dispatchaddress,
					isigtf: isIgtf,
					expirationDay:isExpiredDate	
				});
				message.success('Cliente actualizado');
				router.push('/dashboard/clients');
			} else {
				message.error(validator(data).prob());
			}
		} catch (error) {
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
				<div
					style={{
						maxWidth: '100%',
						margin: '1rem 2rem',
						backgroundColor: 'white',
						boxShadow: '4px 4px 8px rgba(180, 180, 180, 0.479)',
						padding: '60px',
						borderRadius: '20px',
					}}
				>
					<Form
						style={{ width: '100%' }}
						form={form}
						onFinish={handleSubmit}
						initialValues={{
							fullNameClient: client?.nameClient,
							phoneClient: client?.phone,
							address: client?.address,
							rif: client?.numberDocument,
							comments: client?.observacion,
							dispatchaddress: client?.dispatchaddress,
							limitcredit: client?.limitcredit,
							isigtf: client?.isigtf,
							expirationDay: client?.expirationDay,
						}}
						layout="vertical"
						autoComplete="off"
					>
						<Row>
							<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
								<Form.Item
									label="Razón Social"
									style={{ marginRight: 6 }}
									rules={[
										{
											required: true,
											message: 'Razón social es requerido',
										},
									]}
									name="fullNameClient"
								>
									<Input type="text" />
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
								<Form.Item
									label="Teléfono"
									style={{ marginLeft: 6 }}
									rules={[
										{
											required: true,
											message: 'Ingresa un numero de teléfono',
										},
										{
											pattern: regexpTlp,
											message: 'Ingresa un numero de teléfono valido',
										},
									]}
									name="phoneClient"
								>
									<Input type="tel" placeholder="Ej: 0414-1234567" />
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
								<Form.Item
									label="Dirección"
									style={{ marginRight: 6 }}
									rules={[
										{
											required: true,
											message: 'Ingresa la dirección del cliente',
										},
									]}
									name="address"
								>
									<Input type="text" />
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
								<Form.Item
									label="Dirección de despacho"
									style={{ marginRight: 6 }}
									rules={[
										{
											required: true,
											message: 'Ingresa la dirección del cliente',
										},
									]}
									name="dispatchaddress"
								>
									<Input type="text" />
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
								<Form.Item
									label="Límite de crédito disponible"
									style={{ marginRight: 6 }}
									rules={[
										{
											required: true,
											message: 'Ingresa el limite de credito',
										},
									]}
									name="limitcredit"
								>
									<InputNumber
										style={{ width: '100%' }}
										formatter={(value) =>
											`$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
										}
										parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
									/>
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
								<Form.Item
									label="RIF"
									style={{ marginLeft: 6 }}
									rules={[
										{
											required: true,
											message: 'Ingresa el RIF del cliente',
										},
										{
											pattern: regexpRif,
											message: 'Ingresa un RIF valido',
										},
									]}
									name="rif"
								>
									<Input type="text" placeholder="Ej: J-12345678-10" />
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
								<Form.Item label="IGTF" style={{ marginLeft: 6 }} name="isigtf">
									<Select options={IGTF} onChange={handleSelectChange} />
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
								<Form.Item label="Fecha De Expiracion" style={{ marginLeft: 6 }}  name='expirationDay'>
								<DatePicker className='bootstrap-datepicker'
							selected={startDate}
							dateFormat="dd/MM/yyyy"
							onChange={(date) => setStartDate(date)}

							minDate={minDate}
						/>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<Form.Item label="Descripcion " name="description">
									<Input.TextArea
										type="text"
										rows={4}
										placeholder="Descripcion"
									></Input.TextArea>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<Form.Item label="Condiciones comerciales " name="conditionPay">
									<Input.TextArea
										type="text"
										rows={4}
										placeholder="Condiciones comerciales"
									></Input.TextArea>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<Form.Item label="Observación" name="comments">
									<Input.TextArea type="text" rows={4}></Input.TextArea>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={12}>
								<Form.Item style={{ marginRight: 50 }}>
									<Button type="warning" block onClick={onReset}>
										Limpiar
									</Button>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item style={{ marginLeft: 50 }}>
									<Button htmlType="submit" type="success" block>
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
