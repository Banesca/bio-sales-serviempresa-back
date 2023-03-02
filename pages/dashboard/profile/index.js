import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, List, Table, Modal, Form, Select, message, Input } from 'antd';
import DashboardLayout from '../../../components/shared/layout';
import Loading from '../../../components/shared/loading';
import { GeneralContext } from '../../_app';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useUser } from '../../../components/users/hooks/useUser';
import useClients from '../../../components/clients/hooks/useClients';
import Link from 'next/link';
import { PROFILES, PROFILE_LIST } from '../../../components/shared/profiles';
import Title from '../../../components/shared/title';
import { useAuthContext } from '../../../context/useUserProfileProvider';
import { useRequest } from '../../../hooks/useRequest';

const UserDetail = () => {

	const { userProfile } = useAuthContext();
	const { requestHandler } = useRequest()


	const { loading, setLoading } = useLoadingContext();
	const {
		sellerClients,
		getUserById,
		getSellerClients,
	} = useUser();

	const { clients, listClients } = useClients();

	const [user, setUser] = useState({});

	const [profile, setProfile] = useState();

	// assign clients
	const [isAssignClientOpen, setIsAssignClientOpen] = useState(false);


	// Assign Business
	const [isModalOpen, setIsModalOpen] = useState(false);

	// business

	const generalContext = useContext(GeneralContext);


	const getSellerClientsRequest = async (id) => {
		setLoading(true);
		try {
			await getSellerClients(id);
		} catch (error) {
			message.error('Ha ocurrido un error');
		} finally {
			setLoading(false);
		}
	};



	const getUserRequest = async (id) => {
		setLoading(true);
		const loggedUser = localStorage.getItem('userId')
		try {
			const user = await getUserById(loggedUser);
			if (!user) {
				return message.error('Usuario no encontrado');
			}
			setUser(user);
			setProfile(
				PROFILE_LIST.filter((p) => p.id === user.idProfileFk)[0]
			);
			console.log(user)
			if (user.idProfileFk === 3) {
				await getSellerClientsRequest(user.idUser);
			}
		} catch (error) {
			message.error('Ha ocurrido un error user request');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const id = localStorage.getItem('userId')
		if (Object.keys(generalContext).length) {
			getUserRequest(id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext]);

	const [form] = Form.useForm();

	const [userData, setUserData] = useState({
		pin: user.pin || '',
	});


	const handleChange = (e) => {
		setUserData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}));
	};

	const onSubmit = async (data) => {
		setLoading(true);
		try {
			const id = window.localStorage.getItem('userId')
			await requestHandler.put('/api/v2/user/edit/pass', {
				pin: data.pin,
				idUser: id
			})
			message.success('Contraseña actualizada');
		} catch (error) {
			message.error('Error al actualizar contraseña');
		} finally {
			setLoading(false);
		}
	};

	const handleOpenModal = (data) => {
		setIsModalOpen(true);
	};

	const handleCloseModal = async (bool) => {
		setIsModalOpen(false);
		if (!bool) {
			setLoading(false);
			setIsModalOpen(false);
			return;
		}
	};

	const finishForm = async (values) => {
		await handleCloseModal(true)
		form.resetFields()
		onSubmit(values)
	}

	return (
		<>
			<DashboardLayout>
				<div
					style={{
						margin: '1rem',
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					<h1
						style={{
							textAlign: 'center',
							fontSize: '2rem',
							margin: '15px'
						}}
					>
						Mi perfil
					</h1>
					<List
						style={{
							width: '100%',
							backgroundColor: 'white',
							borderRadius: '.5rem',
							marginBottom: '1rem',
						}}
					>
						<List.Item style={{padding: '10px 25px'}}>
							<p>Nombre</p>
							<p>{user?.fullname}</p>
						</List.Item>
						<List.Item style={{padding: '10px 25px'}}>
							<p>Email</p>
							<p>{user?.mail}</p>
						</List.Item >
						<List.Item style={{padding: '10px 25px'}}>
							<p>Perfil</p>
							<p>{profile?.name}</p>
						</List.Item>
						<List.Item style={{padding: '10px 25px'}}>
							<Button type='primary' ghost
								onClick={() => {
									handleOpenModal();
								}}
							>Cambiar contraseña</Button>
						</List.Item>
						<Modal
							title={'Cambio de contraseña'}
							open={isModalOpen}
							onOk={() => handleCloseModal(true)}
							onCancel={() => handleCloseModal(false)}
							footer={[
								<Button
									key="cancel"
									onClick={() => handleCloseModal(false)}
								>
							Cancelar
								</Button>,
								<Button
									type="primary"
									key="delete"
									onClick={finishForm}
								>
							Guardar
								</Button>,
							]}
						>
							<List.Item>
								<h4>Ingresa una contraseña nueva</h4>
								<Form 
									name="login"
									autoComplete="off"
									labelCol={{ span: 8 }}
									form={form}
									initialValues={{
										pin: userData.pin,
									}}
									onFinish={finishForm}
								>
									
									<Form.Item
										label="Contraseña"
										name="pin"
										rules={[
											{
												required: true,
												message: 'Ingresa una contraseña',
											},
											{
												min: 8,
												message: 'Escribe una contraseña de minimo 8 caracteres',
											},
										]}
									>
										<Input
											type="password"
											name="pin"
											value={userData.pin}
											onChange={handleChange}
										/>
									</Form.Item>
									<Form.Item
										label="Repetir contraseña"
										name="Repit"
										dependencies={['pin']}
										rules={[
											{
												required: true,
												message: 'Repite la contraseña',
											},
											({ getFieldValue }) => ({
												validator(_, value) {
													if (!value || getFieldValue('pin') === value) {
														return Promise.resolve();
													}
													return Promise.reject(
														new Error('Las dos contraseñas no son iguales')
													);
												},
											}),
										]}
									>
										<Input
											type="password"
											name="Repit"
											value={userData.pin}
											onChange={handleChange}
										/>
									</Form.Item>
								</Form>
							</List.Item>
						</Modal>
					</List>
					
				</div>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
};

export default UserDetail;