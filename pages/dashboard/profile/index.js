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
import { UserOutlined } from '@ant-design/icons';

const UserDetail = () => {
	const { requestHandler } = useRequest();

	const { loading, setLoading } = useLoadingContext();
	const { getUserById } = useUser();

	const [user, setUser] = useState({});

	const [profile, setProfile] = useState();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const generalContext = useContext(GeneralContext);

	const getUserRequest = async (id) => {
		setLoading(true);
		const loggedUser = localStorage.getItem('userId');
		try {
			const user = await getUserById(loggedUser);
			if (!user) {
				return message.error('Hay algun error con tu perfil');
			}
			setUser(user);
			setProfile(PROFILE_LIST.filter((p) => p.id === user.idProfileFk)[0]);
			if (user.idProfileFk === 3) {
				await getSellerClientsRequest(user.idUser);
			}
		} catch (error) {
			message.error('Ha ocurrido un error');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const id = localStorage.getItem('userId');
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
			const id = window.localStorage.getItem('userId');
			await requestHandler.put('/api/v2/user/edit/pass', {
				pin: data,
				idUser: id,
			})(id);
			message.success('Contraseña actualizada');
		} catch (error) {
			message.error('Error al actualizar contraseña');
		} finally {
			setLoading(false);
		}
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
		await handleCloseModal(true);
		form.resetFields();
		onSubmit(values);
	};

	const router = useRouter();

	user;
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
					<List
						style={{
							width: '96%',
							borderRadius: '15px',
							marginTop: '2rem',
							marginBottom: '1rem',
							backgroundColor: 'white',
							boxShadow: '4px 3px 8px 2px #9c9c9c5d',
						}}
					>
						<List.Item style={{ display: 'flex', justifyContent: 'center' }}>
							<h1
								style={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									textAlign: 'center',
									fontSize: '3rem',
									gap: '20px',
									margin: '20px',
								}}
							>
								Mi perfil
								<UserOutlined style={{ fontSize: '6rem' }} />
								<Button
									style={{ height: '45px', fontSize: '1rem' }}
									onClick={() => {
										router.push(`/dashboard/users/update/${user.idUser}`);
									}}
								>
									Editar Perfil
								</Button>
							</h1>
						</List.Item>

						<List.Item
							style={{
								padding: '15px 40px',
								justifyContent: 'space-between',
								fontSize: '18px',
							}}
						>
							<p style={{ fontWeight: 'bold' }}>Nombre</p>
							<p>{user?.fullname}</p>
						</List.Item>
						<List.Item
							style={{
								padding: '15px 40px',
								justifyContent: 'space-between',
								fontSize: '18px',
							}}
						>
							<p style={{ fontWeight: 'bold' }}>Email</p>
							<p>{user?.mail}</p>
						</List.Item>
						<List.Item
							style={{
								padding: '15px 40px',
								justifyContent: 'space-between',
								fontSize: '18px',
							}}
						>
							<p style={{ fontWeight: 'bold' }}>Perfil</p>
							<p>{profile?.name}</p>
						</List.Item>
						<Modal
							title={'Ingresa nueva contraseña'}
							closable={false}
							style={{ textAlign: 'center' }}
							open={isModalOpen}
							onOk={() => handleCloseModal(true)}
							onCancel={() => handleCloseModal(false)}
							footer={[
								// eslint-disable-next-line react/jsx-key
								<div className="flex justify-end gap-6">
									<Button
										key="cancel"
										danger
										onClick={() => handleCloseModal(false)}
									>
										Cancelar
									</Button>
									<Button
										type="success"
										key="delete"
										onClick={() => finishForm(userData)}
									>
										Guardar
									</Button>
								</div>
							]}
						>
							<List.Item style={{ marginTop: '30px', fontWeight: 'bold' }}>
								<Form
									name="login"
									autoComplete="off"
									labelCol={{ span: 8 }}
									form={form}
									initialValues={{
										pin: '',
									}}
									onFinish={onSubmit}
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
												message:
													'Escribe una contraseña de minimo 8 caracteres',
											},
										]}
									>
										<Input.Password
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
										<Input.Password
											type="password"
											name="Repit"
											value={userData.pin}
										/>
									</Form.Item>
								</Form>
							</List.Item>
						</Modal>
					</List>
					<div style={{ width: '89%' }}></div>
				</div>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
};

export default UserDetail;
