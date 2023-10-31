/* eslint-disable indent */
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Input, Form, Layout, message, Modal, Button, Tooltip } from 'antd';
import Loading from '../components/shared/loading';
import { GeneralContext } from './_app';
import { useRequest } from '../hooks/useRequest';
import { useBusinessProvider } from '../hooks/useBusinessProvider';
import { ip } from '../util/environment';
import { PROFILES } from '../components/shared/profiles';
import MainLogo from '../components/logos/mainLogo';
import {
	MailOutlined,
	SafetyOutlined,
	DownloadOutlined,
	AndroidOutlined,
	AppleOutlined,
} from '@ant-design/icons';

const { Content } = Layout;

export default function Login() {
	const router = useRouter();
	const { requestHandler } = useRequest();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const handleDelete = () => {
		setDeleteModalOpen(false);
	};

	const [messageApi, contextHolder] = message.useMessage();
	const handleLoginError = (error) => {
		messageApi.error(error);
	};

	const handleLoginSuccess = () => {
		messageApi.success('Inicio de sesión exitoso');
	};

	const [loading, setLoading] = useState(false);
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
		console.log(value.idProfileFk);
		if (value.idProfileFk !== 1) {
			const businessByUser = await getUserBusiness(value.idUser);
			if (businessByUser.length < 1 || value.idProfileFk !== 1) {
				handleLoginError('Acceso denegado');
				setLoading(false);
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
			setLoading(false);
			return;
		} else {
			localStorage.setItem('selectedBusiness', JSON.stringify(value.branch[0]));
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
		localStorage.clear();
		localStorage.setItem('apiURL', `${ip}:${generalContext.api_port}`);
	}, [generalContext?.api_port]);

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
					<div className="relative h-[80px] w-11/12 max-w-[300px] m-5">
						<MainLogo />
					</div>
					<div className="overflow-hidden rounded-xl bg-[#0091ff] flex flex-col items-center gap-2 p-1 min-w-[450px] shadow-2xl">
						<div className="rounded-lg text-white w-full py-4 flex justify-center items-center">
							<h1 className="text-center text-4xl">INICIAR SESIÓN</h1>
						</div>
						<div className="bg-[#012258] w-full px-16 py-5 text-white rounded-lg">
							<Form name="login" autoComplete="off" onFinish={onSubmit}>
								<div className="">
									<h1 className="text-white py-2 flex gap-1">
										<MailOutlined className="text-xl" />
										Correo
									</h1>
									<Tooltip title="Ingrese su correo de usuario">
										<Form.Item
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
									</Tooltip>
								</div>
								<div>
									<h1 className="text-white py-2 flex gap-1">
										<SafetyOutlined className="text-xl" />
										Contraseña
									</h1>
									<Tooltip title="Ingresa tu contrasena">
										<Form.Item
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
									</Tooltip>
									<Form.Item
										wrapperCol={{ span: 14, offset: 0 }}
										justify="center"
									>
										<Button
											type="primary"
											htmlType="submit"
											className="bg-blue-600"
											block
										>
											Iniciar sesión
										</Button>

										<a
											type="link"
											onClick={() => setDeleteModalOpen(true)}
											block
											className="shadow-none text-blue-600 text-center"
											style={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											¿Olvidó su contraseña?
										</a>
									</Form.Item>
									<Form.Item
										className="my-8"
										wrapperCol={{ span: 14, offset: 0 }}
										justify="center"
									>
										<a
											type="link"
											block
											className="bg-blue-600"
											href=""
											style={{
												background: '#0091FF',
												color: 'black',
												display: 'flex',
												justifyContent: 'center',
												borderRadius: '8px',
												alignItems: 'center',
											}}
										>
											Descargar app
											<DownloadOutlined />
										</a>
										<div style={{display:'flex', justifyContent:'center', margin:'20px'}}>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 50 50"
												width="50px"
												height="50px"
											>
												<path d="M 33.375 0 C 30.539063 0.191406 27.503906 1.878906 25.625 4.15625 C 23.980469 6.160156 22.601563 9.101563 23.125 12.15625 C 22.65625 12.011719 22.230469 11.996094 21.71875 11.8125 C 20.324219 11.316406 18.730469 10.78125 16.75 10.78125 C 12.816406 10.78125 8.789063 13.121094 6.25 17.03125 C 2.554688 22.710938 3.296875 32.707031 8.90625 41.25 C 9.894531 42.75 11.046875 44.386719 12.46875 45.6875 C 13.890625 46.988281 15.609375 47.980469 17.625 48 C 19.347656 48.019531 20.546875 47.445313 21.625 46.96875 C 22.703125 46.492188 23.707031 46.070313 25.59375 46.0625 C 25.605469 46.0625 25.613281 46.0625 25.625 46.0625 C 27.503906 46.046875 28.476563 46.460938 29.53125 46.9375 C 30.585938 47.414063 31.773438 48.015625 33.5 48 C 35.554688 47.984375 37.300781 46.859375 38.75 45.46875 C 40.199219 44.078125 41.390625 42.371094 42.375 40.875 C 43.785156 38.726563 44.351563 37.554688 45.4375 35.15625 C 45.550781 34.90625 45.554688 34.617188 45.445313 34.363281 C 45.339844 34.109375 45.132813 33.910156 44.875 33.8125 C 41.320313 32.46875 39.292969 29.324219 39 26 C 38.707031 22.675781 40.113281 19.253906 43.65625 17.3125 C 43.917969 17.171875 44.101563 16.925781 44.164063 16.636719 C 44.222656 16.347656 44.152344 16.042969 43.96875 15.8125 C 41.425781 12.652344 37.847656 10.78125 34.34375 10.78125 C 32.109375 10.78125 30.46875 11.308594 29.125 11.8125 C 28.902344 11.898438 28.738281 11.890625 28.53125 11.96875 C 29.894531 11.25 31.097656 10.253906 32 9.09375 C 33.640625 6.988281 34.90625 3.992188 34.4375 0.84375 C 34.359375 0.328125 33.894531 -0.0390625 33.375 0 Z M 32.3125 2.375 C 32.246094 4.394531 31.554688 6.371094 30.40625 7.84375 C 29.203125 9.390625 27.179688 10.460938 25.21875 10.78125 C 25.253906 8.839844 26.019531 6.828125 27.1875 5.40625 C 28.414063 3.921875 30.445313 2.851563 32.3125 2.375 Z M 16.75 12.78125 C 18.363281 12.78125 19.65625 13.199219 21.03125 13.6875 C 22.40625 14.175781 23.855469 14.75 25.5625 14.75 C 27.230469 14.75 28.550781 14.171875 29.84375 13.6875 C 31.136719 13.203125 32.425781 12.78125 34.34375 12.78125 C 36.847656 12.78125 39.554688 14.082031 41.6875 16.34375 C 38.273438 18.753906 36.675781 22.511719 37 26.15625 C 37.324219 29.839844 39.542969 33.335938 43.1875 35.15625 C 42.398438 36.875 41.878906 38.011719 40.71875 39.78125 C 39.761719 41.238281 38.625 42.832031 37.375 44.03125 C 36.125 45.230469 34.800781 45.988281 33.46875 46 C 32.183594 46.011719 31.453125 45.628906 30.34375 45.125 C 29.234375 44.621094 27.800781 44.042969 25.59375 44.0625 C 23.390625 44.074219 21.9375 44.628906 20.8125 45.125 C 19.6875 45.621094 18.949219 46.011719 17.65625 46 C 16.289063 45.988281 15.019531 45.324219 13.8125 44.21875 C 12.605469 43.113281 11.515625 41.605469 10.5625 40.15625 C 5.3125 32.15625 4.890625 22.757813 7.90625 18.125 C 10.117188 14.722656 13.628906 12.78125 16.75 12.78125 Z" />
											</svg>

											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 50 50"
												width="50px"
												height="50px"
												style={{marginLeft:'10px'}}
											>
												<path d="M 16.375 -0.03125 C 16.332031 -0.0234375 16.289063 -0.0117188 16.25 0 C 15.921875 0.0742188 15.652344 0.304688 15.53125 0.621094 C 15.410156 0.9375 15.457031 1.289063 15.65625 1.5625 L 17.78125 4.75 C 14.183594 6.640625 11.601563 9.902344 11 13.78125 C 11 13.792969 11 13.800781 11 13.8125 C 11 13.824219 11 13.832031 11 13.84375 C 11 13.875 11 13.90625 11 13.9375 C 11 13.957031 11 13.980469 11 14 C 10.996094 14.050781 10.996094 14.105469 11 14.15625 L 11 15.5625 C 10.40625 15.214844 9.734375 15 9 15 C 6.800781 15 5 16.800781 5 19 L 5 31 C 5 33.199219 6.800781 35 9 35 C 9.734375 35 10.40625 34.785156 11 34.4375 L 11 37 C 11 38.644531 12.355469 40 14 40 L 15 40 L 15 46 C 15 48.199219 16.800781 50 19 50 C 21.199219 50 23 48.199219 23 46 L 23 40 L 27 40 L 27 46 C 27 48.199219 28.800781 50 31 50 C 33.199219 50 35 48.199219 35 46 L 35 40 L 36 40 C 37.644531 40 39 38.644531 39 37 L 39 34.4375 C 39.59375 34.785156 40.265625 35 41 35 C 43.199219 35 45 33.199219 45 31 L 45 19 C 45 16.800781 43.199219 15 41 15 C 40.265625 15 39.59375 15.214844 39 15.5625 L 39 14.1875 C 39.011719 14.09375 39.011719 14 39 13.90625 C 39 13.894531 39 13.886719 39 13.875 C 39 13.863281 39 13.855469 39 13.84375 C 38.417969 9.9375 35.835938 6.648438 32.21875 4.75 L 34.34375 1.5625 C 34.589844 1.226563 34.597656 0.773438 34.367188 0.425781 C 34.140625 0.078125 33.71875 -0.09375 33.3125 0 C 33.054688 0.0585938 32.828125 0.214844 32.6875 0.4375 L 30.34375 3.90625 C 28.695313 3.3125 26.882813 3 25 3 C 23.117188 3 21.304688 3.3125 19.65625 3.90625 L 17.3125 0.4375 C 17.113281 0.117188 16.75 -0.0625 16.375 -0.03125 Z M 25 5 C 26.878906 5 28.640625 5.367188 30.1875 6.03125 C 30.21875 6.042969 30.25 6.054688 30.28125 6.0625 C 33.410156 7.433594 35.6875 10 36.5625 13 L 13.4375 13 C 14.300781 10.042969 16.53125 7.507813 19.59375 6.125 C 19.660156 6.101563 19.722656 6.070313 19.78125 6.03125 C 21.335938 5.359375 23.109375 5 25 5 Z M 19.5 8 C 18.667969 8 18 8.671875 18 9.5 C 18 10.332031 18.667969 11 19.5 11 C 20.328125 11 21 10.332031 21 9.5 C 21 8.671875 20.328125 8 19.5 8 Z M 30.5 8 C 29.671875 8 29 8.671875 29 9.5 C 29 10.332031 29.671875 11 30.5 11 C 31.332031 11 32 10.332031 32 9.5 C 32 8.671875 31.332031 8 30.5 8 Z M 13 15 L 37 15 L 37 37 C 37 37.5625 36.5625 38 36 38 L 28.1875 38 C 28.054688 37.972656 27.914063 37.972656 27.78125 38 L 16.1875 38 C 16.054688 37.972656 15.914063 37.972656 15.78125 38 L 14 38 C 13.4375 38 13 37.5625 13 37 Z M 9 17 C 10.117188 17 11 17.882813 11 19 L 11 31 C 11 32.117188 10.117188 33 9 33 C 7.882813 33 7 32.117188 7 31 L 7 19 C 7 17.882813 7.882813 17 9 17 Z M 41 17 C 42.117188 17 43 17.882813 43 19 L 43 31 C 43 32.117188 42.117188 33 41 33 C 39.882813 33 39 32.117188 39 31 L 39 19 C 39 17.882813 39.882813 17 41 17 Z M 17 40 L 21 40 L 21 46 C 21 47.117188 20.117188 48 19 48 C 17.882813 48 17 47.117188 17 46 Z M 29 40 L 33 40 L 33 46 C 33 47.117188 32.117188 48 31 48 C 29.882813 48 29 47.117188 29 46 Z" />
											</svg>
										</div>

										<h5
											className="text-center"
											style={{ color: 'white', marginTop: '20px' }}
										>
											Versión 1.5.0
										</h5>

										<Modal
											centered
											title="¿Olvidó su contraseña?"
											style={{ textAlign: 'center' }}
											open={deleteModalOpen}
											onCancel={() => setDeleteModalOpen(false)}
											footer={null}
										>
											<p style={{ marginTop: '20px' }}>
												Para recuperar su acceso comuniquese con un
												administrador
											</p>
										</Modal>
									</Form.Item>
								</div>
							</Form>
						</div>
					</div>
				</Content>
			</Layout>
			<Loading isLoading={loading} />
		</>
	);
}
