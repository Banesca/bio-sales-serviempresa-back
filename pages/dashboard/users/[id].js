import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, List, Table, Modal, Form, Select, message } from 'antd';
import { AimOutlined, ArrowLeftOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
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
import { useAuthContext } from '../../../context/useUserProfileProvider';

const UserDetail = () => {
	const router = useRouter();
	const { id } = router.query;

	const { userProfile } = useAuthContext();

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
		addItemToUserRoute,
	} = useUser();

	const { clients, listClients } = useClients();

	const [user, setUser] = useState();
	const [profile, setProfile] = useState();

	// assign clients
	const [isAssignClientOpen, setIsAssignClientOpen] = useState(false);
	const [clientsToAssign, setClientsToAssign] = useState([]);

	const [clientToRemove, setClientToRemove] = useState(null);
	const [confirmRemoveClient, setConfirmRemoveClient] = useState(false);

	// Assign Business
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);

	// business
	const [businessByUser, setBusinessByUser] = useState([]);
	const [businessToAdd, setBusinessToAdd] = useState();
	const [businessToRemove, setBusinessToRemove] = useState();

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

	const { business } = useBusinessProvider();

	useEffect(() => {
		if (Object.keys(generalContext).length) {
			getUserRequest(id);
			getUserBusiness(id);
			getClientsRequest();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext]);

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
					`${count} ${
						count > 1 ? 'Clientes agregados' : 'Cliente agregado'
					}`
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
			const rest = await requestHandler.get(`/api/v2/user/locations/${id}`)
			console.log(rest);
			router.push('https://www.google.com/maps/@19.0774869,-98.1952265,21z')
		} catch {
			if (res.isLeft()) {
				setLoading(false);
				message.error('Ha ocurrido un error');
			}
		} finally {
			setLoading(false)
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
					<Title title="Información General" path="/dashboard/users" goBack={1}>
						<>
							{profile?.id != PROFILES.MASTER &&
								userProfile == PROFILES.MASTER && (
								<Button
									onClick={() => setIsModalOpen(true)}
									type="primary"
									style={{ marginRight: '.5rem' }}
								>
										Empresas
								</Button>
							)}
							{profile?.id == PROFILES.SELLER && (
								<>
									<Button
										onClick={() =>
											setIsAssignClientOpen(true)
										}
										type="primary"
										style={{ marginRight: '.5rem' }}
									>
										Clientes
									</Button>
									<Button type="primary">
										<Link
											href={`/dashboard/users/routes/${id}`}
										>
											Rutas
										</Link>
									</Button>
								</>
							)}
						</>
					</Title>
					<List className='form'
						style={{
							width: '100%',
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
						</List.Item>
						<List.Item style={{padding: '10px 25px'}}>
							<p>Perfil</p>
							<p>{profile?.name}</p>
						</List.Item>
						<List.Item style={{padding: '10px 25px'}}>
							<p>Ultima ubicación</p>
							<Button type='primary' onClick={() => getLocation(id)} >{React.createElement(AimOutlined/* SendOutlined */)}</Button>
						</List.Item>
					</List>
					{profile?.id != PROFILES.MASTER && (
						<>
							{userProfile == PROFILES.MASTER && (
								<UserBusinessTable
									business={businessByUser}
									setConfirmDelete={setConfirmDelete}
									setBusinessToRemove={setBusinessToRemove}
								/>
							)}
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
				{/* Asignar Empresas */}
				<Modal
					title="Asignar Empresas"
					open={isModalOpen}
					onCancel={() => closeModal(false)}
					footer={[
						<Button key="cancel" onClick={() => closeModal(false)}>
							Cancelar
						</Button>,
						<Button
							key="asigne"
							type="primary"
							onClick={() => closeModal(true)}
						>
							Asignar
						</Button>,
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
										<Select.Option
											key={b.idSucursal}
											value={b.idSucursal}
										>
											{b.nombre}
										</Select.Option>
									))}
							</Select>
						</Form.Item>
					</Form>
				</Modal>
				{/* End Asignar Empresas */}

				{/* Asignar Clientes */}
				<Modal
					title="Asignar Clientes"
					open={isAssignClientOpen}
					onCancel={() => setIsAssignClientOpen(false)}
					footer={[
						<Button
							key="cancel"
							onClick={() => {
								setIsAssignClientOpen(false);
								setClientsToAssign([]);
							}}
						>
							Cancelar
						</Button>,
						<Button
							key="asigne"
							type="primary"
							onClick={handleAssignClientsToSeller}
						>
							Asignar
						</Button>,
					]}
				>
					<Form>
						<Form.Item label="Clientes">
							<Select
								allowClear
								mode="multiple"
								value={clientsToAssign}
								onChange={(v) => setClientsToAssign(v)}
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
				{/* End Asignar Clientes */}
				{/* Confirm remove business */}
				<Modal
					open={confirmDelete}
					title="Remover Permisos"
					onCancel={() => closeRemoveModal(false)}
					footer={[
						<Button
							key="cancel"
							onClick={() => closeRemoveModal(false)}
						>
							Cancelar
						</Button>,
						<Button
							key="remove"
							type="primary"
							danger
							onClick={() => handleRemoveBusiness()}
						>
							Remover
						</Button>,
					]}
				>
					<p>
						Estas seguro de remover el acceso de la sucursal a{' '}
						{user?.fullname}
					</p>
				</Modal>
				{/* End confirm remove business */}
				{/* Confirm remove client */}
				<Modal
					open={confirmRemoveClient}
					title="Remover Permisos"
					onCancel={() => setConfirmRemoveClient(false)}
					footer={[
						<Button
							key="cancel"
							onClick={() => setClientToRemove(false)}
						>
							Cancelar
						</Button>,
						<Button
							key="remove"
							type="primary"
							danger
							onClick={() => handleRemoveClient()}
						>
							Remover
						</Button>,
					]}
				>
					<p>
						{`Estas seguro de remover el acceso sobre el cliente ${clientToRemove?.nameClient} al usuario ${user?.fullname}`}
					</p>
				</Modal>
				{/* End remove client */}
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
};

export default UserDetail;