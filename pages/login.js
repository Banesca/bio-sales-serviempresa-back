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
import { MailOutlined, SafetyOutlined } from '@ant-design/icons';

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
			return
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
										className="my-8"
										wrapperCol={{ span: 14, offset: 0 }}
										justify="center"
									>
										<a
											type="link"
											onClick={() => setDeleteModalOpen(true)}
											block
											className="shadow-none text-blue-600 text-center"
										>
											¿Olvidó su contraseña?
										</a>
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
								</Form.Item>
							</Form>
							<h5 className="text-center">Versión 1.0.0</h5>
						</div>
					</div>
				</Content>
			</Layout>
			<Loading isLoading={loading} />
		</>
	);
}
