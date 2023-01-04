import { Input, Form, Button, Layout } from 'antd';

const { Content } = Layout;

export default function Login() {
	return (
		<>
			<Layout>
				<Content>
					<main
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
						<h1>Iniciar Sesión</h1>
						<Form
							style={{ maxWidth: '400px', width: '100%' }}
							name="login"
							autoComplete="off"
						>
							<Form.Item label="Correo" name="email">
								<Input />
							</Form.Item>
							<Form.Item label="Contraseña" name="password">
								<Input.Password />
							</Form.Item>
							<Form.Item>
								<Button block type="primary" htmlType="submit">
									Aceptar
								</Button>
							</Form.Item>
						</Form>
					</main>
				</Content>
			</Layout>
		</>
	);
}
