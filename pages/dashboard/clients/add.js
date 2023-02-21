import { Button, Col, Row } from 'antd';
import DashboardLayout from '../../../components/shared/layout';
import { Form } from 'antd';
import { Input } from 'antd';
import Title from '../../../components/shared/title';
import Card from '../../../components/shared/card';
import { message } from 'antd';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import Loading from '../../../components/shared/loading';
import { useRequest } from '../../../hooks/useRequest';

export default function AddClient() {
	const { loading, setLoading } = useLoadingContext();
    const { requestHandler } = useRequest()

	const [form] = Form.useForm();

	const onReset = () => {
		form.resetFields();
	};

	const handleSubmit = async (values) => {
		await createClient(values);
        form.resetFields()
	};

	const createClient = async (data) => {
		setLoading(true);
		try {
			const res = await requestHandler.post(`/api/v2/client/add`, {
				nameClient: data.fullNameClient,
				phone: data.phoneClient,
				numberDocument: data.rif,
				address: data.address,
				idStatusFK: 1,
				observacion: data.comments,
			});
			message.success('Cliente agregado');
		} catch (error) {
			message.error('Error al agregar cliente');
		} finally {
			setLoading(false);
		}
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
				<Title
					goBack={false}
					path={'/dashboard/clients'}
					title="Agregar Cliente"
				></Title>
				<Card>
					<Form
						style={{ width: '100%' }}
						form={form}
						onFinish={handleSubmit}
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
									<Input type="number" />
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
									]}
									name="rif"
								>
									<Input type="text" />
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
									<Button block onClick={onReset}>
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
										type="primary"
										block
									>
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
