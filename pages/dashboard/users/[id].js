/* eslint-disable indent */
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, List, Modal, Form, Select, message, Card } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import DashboardLayout from '../../../components/shared/layout';
import Loading from '../../../components/shared/loading';
import { GeneralContext } from '../../_app';
import { useRequest } from '../../../hooks/useRequest';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useUser } from '../../../components/users/hooks/useUser';
import useClients from '../../../components/clients/hooks/useClients';
import UserBusinessTable from '../../../components/users/detail/businessTable';
import UserClientsTable from '../../../components/users/detail/clientsTable';
import Link from 'next/link';
import { PROFILES, PROFILE_LIST } from '../../../components/shared/profiles';
import Title from '../../../components/shared/title';
import UserForm from '/components/users/userForm';

const UserDetail = () => {
	const router = useRouter();
	const { id } = router.query;

	const handleReturn = () => {
		router.push('/dashboard/users');
		setLoading(true);
	};

	const { loading, setLoading } = useLoadingContext();
	const {
		sellerClients,
		getUserById,
		getSellerClients,
		assignClientToSeller,
		removeClientToSeller,
	} = useUser();

	const { clients, listClients } = useClients();
	const [user, setUser] = useState();
	const [profile, setProfile] = useState();
	const [isAssignClientOpen, setIsAssignClientOpen] = useState(false);
	const [clientsToAssign, setClientsToAssign] = useState([]);
	const [clientToRemove, setClientToRemove] = useState(null);
	const [confirmRemoveClient, setConfirmRemoveClient] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [businessByUser, setBusinessByUser] = useState([]);
	const [businessToAdd, setBusinessToAdd] = useState();
	const [businessToRemove, setBusinessToRemove] = useState();
	const [pin, setPin] = useState();

	const generalContext = useContext(GeneralContext);

	const { requestHandler } = useRequest();

	const getUserBusiness = async (id) => {
		const res = await requestHandler.get(`/api/v2/user/branch/${id}`);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue().data;
		setBusinessByUser(value);
	};

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

	const getClientsRequest = async () => {
		setLoading(true);
		try {
			await listClients();
		} catch (error) {
			message.error('Ha ocurrido un error');
		} finally {
			setLoading(false);
		}
	};

	const getUserRequest = async (id) => {
		setLoading(true);
		try {
			const user = await getUserById(id);
			if (!user) {
				return message.error('Usuario no encontrado');
			}
			setUser(user);
			setProfile(PROFILE_LIST.filter((p) => p.id === user.idProfileFk)[0]);
			user;
			if (user.idProfileFk === 3) {
				await getSellerClientsRequest(user.idUser);
			}
		} catch (error) {
			message.error('Ha ocurrido un error user request');
		} finally {
			setLoading(false);
		}
	};

	const { business } = useBusinessProvider();
	const [disabled, setDisabled] = useState();

	useEffect(() => {
		getUserRequest(id);
		getUserBusiness(id);
		getClientsRequest();
		getLoc(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleAsigne = async () => {
		setLoading(true);
		if (businessByUser.length > 0 && profile?.id != PROFILES.SELLER) {
			setLoading(false);
			return message.info('Este usuario ya tiene una empresa asignada');
		}
		const res = await requestHandler.post('/api/v2/user/branch/add', {
			idUserFk: user.idUser,
			idSucursalFk: businessToAdd,
		});
		if (res.isLeft()) {
			setLoading(false);
			message.error('Ha ocurrido un error');
		}
		await getUserBusiness(id);
		setLoading(false);
		message.success('Empresa asignada');
	};

	const closeModal = async (bool) => {
		const alreadyExist = businessByUser.filter(
			(b) => b.idSucursalFk === businessToAdd
		);
		if (alreadyExist.length > 0) {
			setLoading(false);
			setIsModalOpen(false);
			return message.info('El usuario ya cuenta con acceso');
		}
		if (!bool) {
			setLoading(false);
			setIsModalOpen(false);
			return;
		}
		await handleAsigne();
		setIsModalOpen(false);
	};

	const handleRemoveBusiness = async () => {
		setLoading(true);
		const res = await requestHandler.delete(
			`/api/v2/user/delete/branch/${businessToRemove.idUserBranch}`
		);
		if (res.isLeft()) {
			setLoading(false);
			message.error('Ha ocurrido un error');
		}
		await getUserBusiness(id);
		setLoading(false);
		setConfirmDelete(false);
		message.success('Acceso removido');
	};

	const closeRemoveModal = async (bool) => {
		if (!bool) {
			setConfirmDelete(false);
		}
		await handleRemoveBusiness();
		setConfirmDelete(false);
	};

	const handleAssignClientsToSeller = async () => {
		setLoading(true);
		setIsAssignClientOpen(false);
		try {
			let count = 0;
			for (const client of clientsToAssign) {
				if (clientAlreadyAssigned(client)) {
					message.info(
						'Este usuario ya cuenta con acceso sobre el cliente seleccionado'
					);
					continue;
				}
				await assignClientToSeller({
					idClientFk: client,
					idUserFk: Number(id),
				});
				count += 1;
			}
			if (count > 0)
				message.success(
					`${count} ${count > 1 ? 'Clientes agregados' : 'Cliente agregado'}`
				);
			await getSellerClients(id);
			setClientsToAssign([]);
		} catch (error) {
			message.error('Error al asignar clientes');
		} finally {
			setLoading(false);
		}
	};

	const getLocation = async (id) => {
		setLoading(true);
		try {
			const res = await requestHandler.get(`/api/v2/user/locations/${id}`);
			let lat = res.value._value.data[0].latitud;
			let long = res.value._value.data[0].longitud;
			window.open(`https://www.google.com/maps/place/${lat}+${long}`, '_blank');
		} catch {
			setLoading(false);
			message.error('Ha ocurrido un error');
		} finally {
			setLoading(false);
		}
	};

	const getLoc = async (id) => {
		setLoading(true);
		try {
			const res = await requestHandler.get(`/api/v2/user/locations/${id}`);
			let lat = res.value._value.data[0].latitud;
			let long = res.value._value.data[0].longitud;
			res.value._value.data == '' ? setDisabled(true) : setDisabled(false);
		} catch {
			setLoading(false);
			setDisabled(true);
		} finally {
			setLoading(false);
		}
	};

	const clientAlreadyAssigned = (id) => {
		const exists = sellerClients.some((c) => c.idClient === id);
		return exists;
	};

	const handleRemoveClient = async () => {
		setLoading(true);
		setConfirmRemoveClient(false);
		try {
			await removeClientToSeller(clientToRemove.idSellersClient);
			await getSellerClients(id);
			message.success('Cliente removido');
		} catch (error) {
			message.error('Error al remover cliente');
		} finally {
			setLoading(false);
		}
	};

	const [log, setLog] = useState();

	useEffect(() => {
		setLog(localStorage.getItem('userProfile'));
	}, []);

	
	const updateUserRequest = async (data) => {
		await updateUser(data, id);
		if (data.pin != "") {
		await upPass(id, data)
		}
	};
	return (
		<>
			<DashboardLayout>
				<div className="m-4 flex items-center justify-center flex-col gap-4">
					<Title
						title="Detalle de usuario"
						path="/dashboard/users"
						goBack={1}
					></Title>
					<Card className="w-full shadow-lg">
						<List>
							<List.Item style={{ padding: '10px 25px' }}>
								<p>Nombre</p>
								<p>{user?.fullname}</p>
							</List.Item>
							<List.Item style={{ padding: '10px 25px' }}>
								<p>Email</p>
								<p>{user?.mail}</p>
							</List.Item>
							<List.Item style={{ padding: '10px 25px' }}>
								<p>Perfil</p>
								<p>{profile?.name}</p>
							</List.Item>
							{profile?.id == PROFILES.SELLER && (
								<List.Item style={{ padding: '10px 25px' }}>
									<p>Ultima ubicación</p>
									<Button
										type="primary"
										className='bg-blue-500'
										disabled={disabled}
										onClick={() => getLocation(id)}
									>
										{React.createElement(AimOutlined)}
									</Button>
								</List.Item>
							)}
							{profile?.id !== PROFILES.MASTER && (
								<List.Item style={{ padding: '10px 25px' }}>
									<p>Acciones</p>
									<div className="flex gap-5">
										{profile?.id != PROFILES.MASTER &&
											log == PROFILES.MASTER ? (
											<Button
												className="bg-blue-500"
												onClick={() => setIsModalOpen(true)}
												type="primary"
											>
												Empresas
											</Button>
										) : (
											<></>
										)}
										<Button
											className="bg-blue-500"
											onClick={() => setIsAssignClientOpen(true)}
											type="primary"
										>
											Clientes
										</Button>
										{profile?.id == PROFILES.SELLER && (
											<>
												<Button type="primary" className="bg-blue-500">
													<Link href={`/dashboard/users/routes/${id}`}>
														Rutas
													</Link>
												</Button>
											</>
										)}
									</div>
								</List.Item>
							)}
						</List>
					</Card>

					{profile?.id != PROFILES.MASTER && (
						<>
							<UserBusinessTable
								business={businessByUser}
								setConfirmDelete={setConfirmDelete}
								setBusinessToRemove={setBusinessToRemove}
							/>
							{profile?.id == PROFILES.SELLER && (
								<UserClientsTable
									clients={sellerClients}
									setConfirmDelete={setConfirmRemoveClient}
									setClientToRemove={setClientToRemove}
								/>
							)}
						</>
					)}
				</div>
				<Modal
					title="Asignar Empresas"
					open={isModalOpen}
					onCancel={() => closeModal(false)}
					footer={[
						// eslint-disable-next-line react/jsx-key
						<div className="flex justify-end gap-6">
							<Button danger key="cancel" onClick={() => closeModal(false)}>
								Cancelar
							</Button>
							<Button
								key="asigne"
								type="primary"
								onClick={() => closeModal(true)}
							>
								Asignar
							</Button>
						</div>
					]}
				>
					<Form>
						<Form.Item label="Empresas">
							<Select
								allowClear
								value={businessToAdd}
								onChange={(v) => setBusinessToAdd(v)}
							>
								{business &&
									business.map((b) => (
										<Select.Option key={b.idSucursal} value={b.idSucursal}>
											{b.nombre}
										</Select.Option>
									))}
							</Select>
						</Form.Item>
					</Form>
				</Modal>
				<Modal
					title="Asignar Clientes"
					open={isAssignClientOpen}
					onCancel={() => setIsAssignClientOpen(false)}
					footer={[
						// eslint-disable-next-line react/jsx-key
						<div className="flex justify-end gap-6">
							<Button
								key="cancel"
								danger
								onClick={() => {
									setIsAssignClientOpen(false);
									setClientsToAssign([]);
								}}
							>
								Cancelar
							</Button>
							<Button
								key="asigne"
								type="primary"
								onClick={handleAssignClientsToSeller}
							>
								Asignar
							</Button>
						</div>
					]}
				>
					<Form>
						<Form.Item label="Clientes">
							<Select
								allowClear
								mode="multiple"
								value={clientsToAssign}
								onChange={() => setClientsToAssign()}
							>
								{clients &&
									clients.map((client) => (
										<Select.Option
											key={client.idClient}
											value={client.idClient}
										>
											{client.nameClient}
										</Select.Option>
									))}
							</Select>
						</Form.Item>
					</Form>
				</Modal>
				<Modal
					open={confirmDelete}
					title="Remover Permisos"
					onCancel={() => setConfirmDelete(false)}
					footer={[
						// eslint-disable-next-line react/jsx-key
						<div className="flex justify-end gap-6">
							<Button key="cancel" onClick={() => setConfirmDelete(false)}>
								Cancelar
							</Button>
							<Button
								key="remove"
								type="primary"
								danger
								onClick={() => handleRemoveBusiness()}
							>
								Remover
							</Button>
						</div>
					]}
				>
					<p>
						Estas seguro de remover el acceso de la sucursal a {user?.fullname}
					</p>
				</Modal>
				<Modal
					open={confirmRemoveClient}
					title="Remover Permisos"
					onCancel={() => setConfirmRemoveClient(false)}
					footer={[
						// eslint-disable-next-line react/jsx-key
						<div className="flex justify-end gap-6">
							<Button
								key="cancel"
								onClick={() => setConfirmRemoveClient(false)}
							>
								Cancelar
							</Button>
							<Button
								key="remove"
								type="primary"
								danger
								onClick={() => handleRemoveClient()}
							>
								Remover
							</Button>
						</div>
					]}
				>
					<p>
					¿{`Está seguro de remover el acceso sobre el cliente ${clientToRemove?.nameClient} al usuario ${user?.fullname}`}?
					</p>
				</Modal>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
};

export default UserDetail;
