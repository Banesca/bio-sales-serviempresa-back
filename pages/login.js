import Image from 'next/image';
import logoImage from '../public/assets/logo.svg';

import { Input, Form, Button, Layout } from 'antd';
import { useRouter } from 'next/router';

const { Content } = Layout;

export default function Login() {
	const router = useRouter();

	const onSubmit = (values) => {
		// Login endpoint
		router.push('/dashboard/products');
	};

	return (
		<>
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
						<Form.Item>
							<Button type="primary" htmlType="submit" block>
								Aceptar
							</Button>
						</Form.Item>
					</Form>
				</Content>
			</Layout>
		</>
	);
}
