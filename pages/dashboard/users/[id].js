import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, List, Table } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';

import DashboardLayout from '../../../components/layout';
import { users } from '../../../util/database';
import Loading from '../../../components/loading';
import { GeneralContext } from '../../_app';
import { useRequest } from '../../../hooks/useRequest';
import { Modal } from 'antd';
import { Form } from 'antd';
import { Input } from 'antd';
import { Select } from 'antd';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import { render } from 'react-dom';
import { message } from 'antd';

const UserDetail = () => {
	const columns = [
		{
			title: 'Empresas asignadas',
			dataIndex: 'nombre',
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			render: (item) => (
				<Button
					type="primary"
					danger
					onClick={() => openConfirmDelete(item)}
				>
					<DeleteOutlined />
				</Button>
			),
		},
	];

	const router = useRouter();
	const { id } = router.query;

	const handleReturn = () => {
		router.push('/dashboard/users');
		setLoading(true);
	};

	const profileList = [
		{ name: 'Administrador', id: 1 },
		{ name: 'Full Acceso', id: 2 },
		{ name: 'Vendedor', id: 3 },
	];

	const [user, setUser] = useState();
	const [profile, setProfile] = useState();
	const [loading, setLoading] = useState(false);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);

	const [businessByUser, setBusinessByUser] = useState([]);
	const [businessToAdd, setBusinessToAdd] = useState();
	const [businessToRemove, setBusinessToRemove] = useState();

	const generalContext = useContext(GeneralContext);

	const { requestHandler } = useRequest();

	const getUserBusiness = async (userId) => {
		const res = await requestHandler.get(`/api/v2/user/branch/${id}`);
		console.log(res);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue().data;
		setBusinessByUser(value);
	};

	const getUserRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/user/${id}`);
		if (res.isLeft()) {
			setLoading(false);
			return;
		}
		const value = res.value.getValue().data[0];
		setUser(value);
		setProfile(profileList.filter((p) => p.id === value.idProfileFk)[0]);
		setLoading(false);
	};

	const { business } = useBusinessProvider();

	useEffect(() => {
		if (generalContext) {
			getUserRequest(id);
			getUserBusiness(id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext]);

	const handleAsigne = async () => {
		setLoading(true);
		const res = await requestHandler.post(`/api/v2/user/branch/add`, {
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
			`/api/v2/user/delete/${businessToRemove.idUserBranch}`
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

	const openConfirmDelete = (item) => {
		setBusinessToRemove(item);
		setConfirmDelete(true);
	};

	const closeRemoveModal = async (bool) => {
		if (!bool) {
			setConfirmDelete(false);
		}
		await handleRemoveBusiness();
		setConfirmDelete(false);
	};

	useEffect(() => {
		console.log(businessByUser);
	}, [businessByUser]);

	return (
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
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<ArrowLeftOutlined
						style={{ fontSize: '1.5rem', color: 'white' }}
						onClick={handleReturn}
					/>
					<h1
						style={{
							textAlign: 'center',
							fontSize: '2rem',
							color: 'white',
						}}
					>
						Información General
					</h1>
					<div>
						<Button
							onClick={() => setIsModalOpen(true)}
							type="primary"
							style={{ marginRight: '2rem' }}
						>
							Asignar
						</Button>
					</div>
				</div>
				<List style={{ width: '100%' }}>
					<List.Item>
						<p>Nombre</p>
						<p>{user?.fullname}</p>
					</List.Item>
					<List.Item>
						<p>Email</p>
						<p>{user?.mail}</p>
					</List.Item>
					<List.Item>
						<p>Perfil</p>
						<p>{profile?.name}</p>
					</List.Item>
				</List>
				<Table
					columns={columns}
					style={{ width: '100%' }}
					dataSource={businessByUser}
				/>
			</div>
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
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
};

export default UserDetail;
