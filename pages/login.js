import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Input, Form, Button, Layout, message } from 'antd';

import { login, setBusiness } from '../services/auth';
import logoImage from '../public/assets/logo.svg';
import Loading from '../components/loading';
import { GeneralContext } from './_app';
import { ipBackOffice } from '../util/environment';

const { Content } = Layout;

export default function Login() {
	const router = useRouter();

	const [messageApi, contextHolder] = message.useMessage();
	const [loading, setLoading] = useState(false);

	const handleLoginError = (error) => {
		messageApi.error(error);
	};

	const handleLoginSuccess = () => {
		messageApi.success('Inicio de sesión exitoso');
	};

	const onSubmit = async (values) => {
		setLoading(true);
		// Login endpoint
		const res = await login(localStorage.getItem('apiURL'), values);
		console.log(res);
		if (res.isLeft()) {
			const error = res.value.getErrorValue();
			console.log('ERROR', error);
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
			return handleLoginError('Usuario con contraseña incorrectos');
		}
		localStorage.setItem('accessToken', res.value.getValue().data[0].token);
		setLoading(false);
		handleLoginSuccess();
		router.push('/dashboard/products');
	};

	const generalContext = useContext(GeneralContext);

	useEffect(() => {
		localStorage.setItem(
			'apiURL',
			`http://tumenudelivery.com:${generalContext.api_port}`
		);
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
					<Image
						src={logoImage}
						width={300}
						height={150}
						alt="logo"
						style={{ marginBottom: '2rem' }}
					></Image>
					<h1 style={{ color: 'white' }}>Iniciar Sesión</h1>
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
				</Content>
			</Layout>
			<Loading isLoading={loading} />
		</>
	);
}
