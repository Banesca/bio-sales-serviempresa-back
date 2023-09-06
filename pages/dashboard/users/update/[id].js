import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../../../components/shared/layout';
import UserForm from '../../../../components/users/userForm';
import Loading from '../../../../components/shared/loading';
import { useRouter } from 'next/router';
import { useRequest } from '../../../../hooks/useRequest';
import { GeneralContext } from '../../../_app';
import { useBusinessProvider } from '../../../../hooks/useBusinessProvider';
import { useUser } from '../../../../components/users/hooks/useUser';
import { useLoadingContext } from '../../../../hooks/useLoadingProvider';
import {
	Button,
	Input,
	List,
	Modal,
	Form,
	Select,
	message,
	Card,
	Row,
	Col,
} from 'antd';
import { PROFILES, PROFILE_LIST } from '../../../../components/shared/profiles';
import useClients from '../../../../components/clients/hooks/useClients';
import UserBusinessTable from '../../../../components/users/detail/businessTable';
import UserClientsTable from '../../../../components/users/detail/clientsTable';
import { AimOutlined, HighlightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { idClient } from '../../../../util/environment';
import { string } from 'prop-types';

const UpdateUser = () => {
	const [clientsToAssign, setClientsToAssign] = useState([]);
	const { loading, setLoading } = useLoadingContext();
	const [user, setUser] = useState({});
	const [businessByUser, setBusinessByUser] = useState([]);
	const [pin, setPin] = useState();
	const [profile, setProfile] = useState();
	const [log, setLog] = useState();
	const { clients, listClients } = useClients();
	const { clientsToRemove, deleteClient } = useClients();
	const [disabled, setDisabled] = useState();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [businessToAdd, setBusinessToAdd] = useState();
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [businessToRemove, setBusinessToRemove] = useState();
	const [confirmRemoveClient, setConfirmRemoveClient] = useState(false);
	const [clientToRemove, setClientToRemove] = useState();
	const { sellerClients } = useUser();
	const [sellerClientsAdd, setsellerClientsAdd] = useState([]);
	const [isAssignClientOpen, setIsAssignClientOpen] = useState(false);
	const router = useRouter();
	const { id } = router.query;
	const { requestHandler } = useRequest();
	const { getUserById, updateUser, upPass } = useUser();
	const generalContext = useContext(GeneralContext);
	const { business } = useBusinessProvider();

	const getUserRequest = async (id) => {
		setLoading(true);
		try {
			const user = await getUserById(id);
			if (!user) {
				message.error('Usuario no encontrado');
			}
			setUser(user);
			console.log({ user });
			setProfile(PROFILE_LIST.filter((p) => p.id === user.idProfileFk)[0]);
		} catch (error) {
			message.error('Ha ocurrido un error');
		} finally {
			setLoading(false);
		}
	};

	const getUserBusiness = async (userId) => {
		const res = await requestHandler.get(`/api/v2/user/branch/${userId}`);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue().data;
		setBusinessByUser(value);
		let lg = value.map((b) => b?.pin);
		// setPin(lg.length == 2 ? lg[0] : lg);
		if (lg !== '') {
			setPin(value[0]?.pin);
		}
	};

	const getSellerClients = async (userId) => {
		const res = await requestHandler.get(`/api/v2/user/client/${userId}`);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue().data;
		setsellerClientsAdd(value);
		console.log(sellerClientsAdd);
	};

	const updateUserRequest = async (data) => {
		await updateUser(data, id);
		if (data.pin !== '') {
			await upPass(id, data);
		}
	};

	useEffect(() => {
		if (id) {
			getClientsRequest();
			getUserRequest(id);
			getUserBusiness(id);
			getSellerClients(id);
			getLoc(id);
			setLog(localStorage.getItem('userProfile'));
		}
	}, [generalContext, id]);

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

	const closeModal2 = async (bool) => {
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

	const assignClientToSeller = async () => {
		setLoading(true);
		if (clientsToAssign.length > 0 && profile?.id != PROFILES.SELLER) {
			setLoading(false);
			return message.info('Este usuario ya tiene un cliente asignado');
		}

		const res = await requestHandler.post('/api/v2/user/assign/client', {
			idUserFk: user.idUser,
			idClientFk: clientsToAssign,
			fecha: string,
		});

		if (res.isLeft()) {
			setLoading(false);
			message.error('Ha ocurrido un error');
			throw res.value.getErrorValue();
		}
		await getSellerClients(id);
		setLoading(false);
		message.success('Cliente asignado');
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

	const handleRemoveClients = async () => {
		console.log(clientToRemove.idClient);

		const res = await requestHandler.put(
			`/api/v2/user/assign/client/update/client/${user.idUser}`,
			{
				idUserFk: user.idUser,
				idClientFk: clientToRemove.idClient,
			}
		);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
			console.log(res.value.getValue().response);
		}
		await getSellerClients(id);
		setLoading(false);
		setConfirmRemoveClient(false);
		console.log(res);
		message.success('Cliente removido');
	};

	const handleAssignClientsToSeller = async (bool) => {
		const alreadyExist = clients.filter(
			(c) => c.idClientFk === clientsToAssign
		);
		if (alreadyExist.length > 0) {
			setLoading(false);
			setIsModalOpen(false);
			return message.info('El usuario ya tiene cliente');
		}
		await assignClientToSeller();
		setIsAssignClientOpen(false);
	};

	return (
		<DashboardLayout>
			{loading ? (
				<Loading isLoading={loading} />
			) : (
				<UserForm
					business={business}
					submitFunction={updateUserRequest}
					update={true}
					user={user}
					userBusiness={businessByUser}
					pin={pin}
				/>
			)}

			<Card className="w-full shadow-lg">
				<List>
					<List.Item style={{ padding: '10px 25px' }}>
						<p>Ultima ubicación</p>
						<Button
							type="primary"
							className="bg-blue-500"
							disabled={disabled}
							onClick={() => getLocation(id)}
						>
							<AimOutlined />
						</Button>
					</List.Item>
					{profile?.id !== PROFILES.MASTER && (
						<List.Item style={{ padding: '10px 25px' }}>
							<p>Asignar</p>
							<div className="flex gap-5">
								{profile?.id != PROFILES.MASTER && log == PROFILES.MASTER ? (
									<Button
										className="bg-blue-500"
										onClick={() => setIsModalOpen(true)}
										type="primary"
									>
										Sucursal
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
											<Link href={`/dashboard/users/routes/${id}`}>Rutas</Link>
										</Button>
									</>
								)}
							</div>
						</List.Item>
					)}

					{businessByUser.length !== 0 ? (
						<List.Item>
							<UserBusinessTable
								business={businessByUser}
								setConfirmDelete={setConfirmDelete}
								setBusinessToRemove={setBusinessToRemove}
							/>
						</List.Item>
					) : (
						<></>
					)}

					{sellerClientsAdd.length !== 0 ? (
						<List.Item>
							<UserClientsTable
								clients={sellerClientsAdd}
								setConfirmDelete={setConfirmRemoveClient}
								setClientToRemove={setClientToRemove}
							/>
						</List.Item>
					) : (
						<></>
					)}
				</List>
			</Card>

			<Modal
				title="Asignar sucursal"
				open={isModalOpen}
				onCancel={() => closeModal2(false)}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button danger key="cancel" onClick={() => closeModal2(false)}>
							Cancelar
						</Button>
						<Button
							className="bg-blue-500"
							key="asigne"
							type="primary"
							onClick={() => closeModal2(true)}
						>
							Asignar
						</Button>
					</div>,
				]}
			>
				<Form>
					<Form.Item label="Empresas">
						<Select allowClear onChange={(v) => setBusinessToAdd(v)}>
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
				title="Asignar clientes"
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
							className="bg-blue-500"
							key="asigne"
							type="primary"
							onClick={() => handleAssignClientsToSeller(false)}
						>
							Asignar
						</Button>
					</div>,
				]}
			>
				<Form>
					<Form.Item label="Clientes">
						<Select
							allowClear
							value={clientsToAssign}
							onChange={(v) => setClientsToAssign(v)}
						>
							{clients &&
								clients.map((client) => (
									<Select.Option key={client.idClient} value={client.idClient}>
										{client.nameClient}
									</Select.Option>
								))}
						</Select>
					</Form.Item>
				</Form>
				<Form.Item label="Fecha">
					<Input type="text" name="fecha"></Input>
				</Form.Item>
			</Modal>
			<Modal
				open={confirmDelete}
				title="Confirmación"
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
							Eliminar
						</Button>
					</div>,
				]}
			>
				<p>¿Está seguro de eliminar?</p>
			</Modal>
			<Modal
				open={confirmRemoveClient}
				title="Confirmación2"
				onCancel={() => setConfirmRemoveClient(false)}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button key="cancel" onClick={() => setConfirmRemoveClient(false)}>
							Cancelar
						</Button>
						<Button
							key="remove"
							type="primary"
							danger
							onClick={() => handleRemoveClients()}
						>
							Eliminar
						</Button>
					</div>,
				]}
			>
				<p>¿Está seguro de eliminar?</p>
			</Modal>
		</DashboardLayout>
	);
};

export default UpdateUser;
