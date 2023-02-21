import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Input, Typography, Form, Button, Layout, message } from 'antd';
import Loading from '../components/shared/loading';
import { GeneralContext } from './_app';
import { useRequest } from '../hooks/useRequest';
import { useBusinessProvider } from '../hooks/useBusinessProvider';
import { ip } from '../util/environment';
import { PROFILES } from '../components/shared/profiles';

const { Content } = Layout;

export default function Login() {
	const router = useRouter();

	const { requestHandler } = useRequest();

	// display message
	const [messageApi, contextHolder] = message.useMessage();
	const handleLoginError = (error) => {
		messageApi.error(error);
	};

	const handleLoginSuccess = () => {
		messageApi.success('Inicio de sesión exitoso');
	};

	const [loading, setLoading] = useState(false);

	// business Context
	const businessContext = useBusinessProvider();

	const handleLoginRequest = async (data) => {
		return await requestHandler.post('/api/v1/validator/login', data);
	};

	const getUserBusiness = async (id) => {
		const res = await requestHandler.get(`/api/v2/user/branch/${id}`);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue().data;
		return value;
	};

	const onSubmit = async (values) => {
		setLoading(true);
		const res = await handleLoginRequest(values);
		if (res.isLeft()) {
			const error = res.value.getErrorValue();
			setLoading(false);
			switch (error.status) {
				case 400:
					return handleLoginError(error.data.error);
				case 404:
					return handleLoginError('Ha ocurrido un error');
				case 500:
					return handleLoginError(error.data.error);
				default:
					return handleLoginError('Ha ocurrido un error');
			}
		}
		if (!res.value.getValue()) {
			setLoading(false);
			return handleLoginError('Usuario o contraseña incorrectos');
		}
		const value = res.value.getValue().data[0];
		localStorage.setItem('accessToken', value.token);
		if (value.idProfileFk != PROFILES.MASTER) {
			const businessByUser = await getUserBusiness(value.idUser);
			if (businessByUser.length < 1) {
				handleLoginError('Acceso denegado');
				return;
			}
			const businessIdsList = value.branch.map((b) => b.idSucursal);
			const selectedBusinessIdx = businessIdsList.indexOf(
				businessByUser[0].idSucursalFk
			);

			localStorage.setItem(
				'selectedBusiness',
				JSON.stringify(value.branch[selectedBusinessIdx])
			);
		} else {
			localStorage.setItem(
				'selectedBusiness',
				JSON.stringify(value.branch[0])
			);
		}
		localStorage.setItem('userId', value.idUser);
		localStorage.setItem('userProfile', value.idProfileFk);
		localStorage.setItem('business', JSON.stringify(value.branch));
		businessContext.handleSetBusiness(value.branch);
		businessContext.handleSetSelectedBusiness(value.branch);
		setLoading(false);
		handleLoginSuccess();
		router.push('/dashboard/products');
	};

	const generalContext = useContext(GeneralContext);

	useEffect(() => {
		localStorage.setItem('apiURL', `${ip}:${generalContext.api_port}`);
	}, [generalContext.api_port]);

	return (
		<>
			{contextHolder}
			<Layout>
				<Content
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						height: '100vh',
						width: '100%',
						paddingInline: '1rem',
					}}
				>
					<div
						style={{
							backgroundColor: 'white',
							borderRadius: '1rem',
							paddingInline: '4rem',
						}}
					>
						<Typography>
							<h1
								style={{
									fontWeight: 'bold',
									fontSize: '4rem',
								}}
							>
								SiempreOL
							</h1>
							<h2
								style={{
									fontSize: '2rem',
									textAlign: 'center',
								}}
							>
								Iniciar Sesión
							</h2>
						</Typography>
						<Form
							name="login"
							autoComplete="off"
							labelCol={{ span: 8 }}
							onFinish={onSubmit}
						>
							<Form.Item
								label="Correo"
								name="mail"
								rules={[
									{
										required: true,
										message: 'Ingresa un correo',
									},
									{
										type: 'email',
										message: 'Ingresa un email valido',
									},
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								label="Contraseña"
								name="pin"
								rules={[
									{
										required: true,
										message: 'Ingresa una contraseña',
									},
								]}
							>
								<Input.Password />
							</Form.Item>
							<Form.Item wrapperCol={{ span: 8, offset: 8 }}>
								<Button type="primary" htmlType="submit" block>
									Aceptar
								</Button>
							</Form.Item>
						</Form>
					</div>
				</Content>
			</Layout>
			<Loading isLoading={loading} />
		</>
	);
}
