import { Button, Card, Col, Row, Select } from 'antd';
import DashboardLayout from '../../../components/shared/layout';
import { Form } from 'antd';
import { Input } from 'antd';
import Title from '../../../components/shared/title';
import { message } from 'antd';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import Loading from '../../../components/shared/loading';
import { useRequest } from '../../../hooks/useRequest';
import { useRouter } from 'next/router';
import useClients from '../../../components/clients/hooks/useClients';
import { useContext, useEffect, useState } from 'react';
import { GeneralContext } from '../../_app';

export default function AddClient() {
	const { loading, setLoading } = useLoadingContext();
	const { requestHandler } = useRequest();
	const regexpTlp = /^(0414|0424|0412|0416|0426)[-][0-9]{7}$/g;
	const regexpRif = /^([VEJPGvejpg]{1})-([0-9]{8})-([0-9]{1}$)/g;

	const [form] = Form.useForm();

	const IGTF = [
		{ label: 'Si', value: 'true' },
		{ label: 'No', value: 'false' },
	];

	const handleSelectChange = (event) => {
		console.log(event);
	};

	const onReset = () => {
		form.resetFields();
	};

	const router = useRouter();
	const { clients } = useClients();

		const getClientsRequest = async () => {
		setLoading(true);
		try {
			await listClients();
		} catch (error) {
			message.error('Ha ocurrido un error');
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const validator = (data) => {
		return {
			val: Object.values(
				clients.map((client) => {
					if (
						client.phone == data.phoneClient ||
						client.numberDocument == data.rif
					) {
						return true;
					}
				})
			).includes(true),
			prob: () => {
				let calc = Object.values(
					clients.map((client) => {
						if (
							client.phone == data.phoneClient &&
							client.numberDocument == data.rif
						) {
							return 1;
						} else if (client.phone == data.phoneClient) {
							return 2;
						} else if (client.numberDocument == data.rif) {
							return 3;
						}
					})
				);
				if (calc.includes(1) || (calc.includes(2) && calc.includes(3))) {
					return 'El número de teléfono y el RIF ya están en uso';
				} else if (calc.includes(2)) {
					return 'El número de telefono ya esta en uso';
				} else if (calc.includes(3)) {
					return 'El número de Rif ya esta en uso';
				}
			},
		};
	};

	const generalContext = useContext(GeneralContext);

	useEffect(() => {
		if (Object.keys(generalContext).length) {
			getClientsRequest();
		}
	}, [generalContext]);

	const handleSubmit = async (values) => {
		setLoading(true);
		if (createClient(values)) {
			setLoading(false);
		} else {
			form.resetFields();
			router.push('/dashboard/clients');
		}
	};

	const createClient = async (data, err) => {
		setLoading(true);
		await getClientsRequest();
		try {
			if (!validator(data).val) {
				const res = await requestHandler.post('/api/v2/client/add', {
					nameClient: data.fullNameClient,
					phone: data.phoneClient,
					numberDocument: data.rif,
					address: data.address,
					idStatusFK: 1,
					observacion: data.comments,
					description: data.description,
					dispatchaddress: data.dispatchaddress,
					isigtf: data.isigtf,
					idPaymenConditions: data.idPaymenConditions,
					limitcredit: data.limitcredit,
				});
				message.success('Cliente agregado');
				router.push('/dashboard/clients');
			} else {
				message.error(validator(data).prob());
			}
		} catch (error) {
			message.error('Error al agregar cliente');
		} finally {
			setLoading(false);
		}
	};
	return (
		<DashboardLayout>
			<div className="m-4 flex flex-col">
				<Title
					goBack={1}
					path={'/dashboard/clients'}
					title="Agregar Cliente"
				></Title>
				<Card className="mx-8 my-4 p-16 rounded-xl shadow-xl">
					<Form
						className="w-full"
						form={form}
						onFinish={handleSubmit}
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
									<Input type="text" />
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
										Agregar
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Card>
			</div>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
}
