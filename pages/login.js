import Image from 'next/image';
import logoImage from '../public/assets/logo.svg';

import { Input, Form, Button, Layout } from 'antd';
import { useRouter } from 'next/router';
import { login } from '../services/auth';
import { message } from 'antd';
import { useState } from 'react';

import Loading from '../components/loading';

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
		const res = await login(values);
		if (res.isLeft()) {
			const error = res.value.getErrorValue();
			console.log('ERROR', error);
			setLoading(false);
			switch (error.status) {
				case 400:
					return handleLoginError(error.data.error);
				case 500:
					return handleLoginError(error.data.error);
			}
		}
		console.log(res.value.getValue());
		localStorage.setItem('accessToken', res.value.getValue().accessToken);
		localStorage.setItem('refreshToken', res.value.getValue().refreshToken);
		handleLoginSuccess();
		setLoading(false);
		router.push('/dashboard/products');
	};

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
							name="email"
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
							name="password"
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
