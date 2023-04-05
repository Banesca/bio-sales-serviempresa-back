import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
/* import Button from 'antd-button-color';
 */
import { Input, Typography, Form, Layout, message, Modal, Button, Image } from 'antd';
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
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const handleDelete = () => {
		setDeleteModalOpen(false);
	};

	const regexpTlp = /^(?=.\d)(?=.[\u0021-\u002b\u003c-\u0040])(?=.[A-Z])(?=.[a-z])\S{8,16}$/g

	
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
			if (businessByUser.length < 1 || value.idProfileFk == 3) {
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
		localStorage.clear();
		localStorage.setItem('apiURL', `${ip}:${generalContext.api_port}`);
	}, [generalContext.api_port]);


	return (
		<>
			{contextHolder}
			<Layout>
				<Content
					className='layout-login'
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
					<h1
						className='logo'
						style={{
							fontWeight: 'bold',
							fontSize: '4rem',
							marginTop: '0px',
							marginBottom: '25px',
							height: '60px'
						}}
					>
							
					</h1>
					<div
						className='login'
						style={{
							backgroundColor: 'white',
							borderRadius: '1.5rem',
						}}
					>
						<div className='imagen' >
							<Typography style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
								<h1>INGRESAR</h1>
							</Typography>
						</div>
						<div className='login-form' style={{marginRight:'-30px'}}>

							<Form 
								name="login"
								autoComplete="off"
								labelCol={{ span: 6, offset: 0 }}
								onFinish={onSubmit}
							>
								<section style={{marginRight: '105px'}}>

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
										<Input className='login-input' placeholder='CEDULA'/>
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
										<Input.Password className='login-input password' placeholder='CONTRASEÑA' />
									</Form.Item>
								</section>

								<Form.Item wrapperCol={{ span: 14, offset: 0 }} style={{display: 'flex-end', marginTop: '-40px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}} justify='center'>
									<Button type="link" style={{marginTop: '30px', boxShadow: 'none'}} onClick={() => setDeleteModalOpen(true)} block>
									¿Olvidó su contraseña?
									</Button>
									<Modal
										title="¿Olvidó su contraseña?"
										style={{textAlign: 'center'}}
										open={deleteModalOpen}
										onCancel={() => setDeleteModalOpen(false)}
										footer={null}
									>
										<p style={{marginTop: '20px'}}>
										Para recuperar su acceso comuniquese con un administrador
										</p>
									</Modal>
								</Form.Item>
								<Form.Item wrapperCol={{ span: 14, offset: 0 }} style={{display: 'flex-end', marginTop: '-15px'}} justify='center'>
									<Button type="primary" htmlType="submit" style={{margin: '0'}} block>
									Iniciar sesión
									</Button>
								</Form.Item>
							</Form>
							<h5 style={{marginTop: '8px', marginBottom: '5px', color: '#fff'}}>Versión 0.9.5</h5>
						</div>

					</div>
				</Content>
			</Layout>
			<Loading isLoading={loading} />
		</>
	);
}