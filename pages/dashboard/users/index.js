import { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button, Col, Row, message } from 'antd';
import DashboardLayout from '../../../components/shared/layout';
import UsersTable from '../../../components/users/table';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import Loading from '../../../components/shared/loading';
import UserFilters from '../../../components/users/filters';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { addKeys } from '../../../util/setKeys';
import { Typography } from 'antd';
import { useUser } from '../../../components/users/hooks/useUser';
import { PROFILES } from '../../../components/shared/profiles';
import { useAuthContext } from '../../../context/useUserProfileProvider';
import Title from '../../../components/shared/title';

export default function Users() {
	const { userProfile } = useAuthContext();

	const { loading, setLoading } = useLoadingContext();
	const { users, deleteUser, getUsers, getUserById } = useUser();
	const { requestHandler } = useRequest();
	const [businessByUser, setBusinessByUser] = useState([]);

	// const [loading, setLoading] = useState(true);

	// const [users, setUsers] = useState([]);
	const [query, setQuery] = useState({
		fullname: '',
		mail: '',
		idProfileFk: 0,
		idBusiness: 0,
	});

	let h = [];

	const getUserBusiness = async (id) => {
		const res = await requestHandler.get(`/api/v2/user/branch/${id}`);
		if (res.isLeft()) {
			return;
		}
		const value = res.value._value.data;
		h.push(value);
	};

	const generalContext = useContext(GeneralContext);

	useEffect(() => {
		setLoading(true);
		if (Object.keys(generalContext).length) {
			getUsers();
			for(let x in users) {
				// iterar sobre usuarios para obtener su empresa asignada
				getUserBusiness(users[x].idUser);
			}
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext]);

	const usersList = useMemo(() => {
		let usersList = users;
		let us = businessByUser;
		if (query.fullname) {
			usersList = usersList.filter((u) =>
				u.fullname.toLowerCase().includes(query.fullname.toLowerCase())
			);
		}
		if (query.mail) {
			usersList = usersList.filter((u) =>
				u.mail.toLowerCase().includes(query.mail.toLowerCase())
			);
		}
		if (query.idProfileFk) {
			usersList = usersList.filter(
				(u) => u.idProfileFk === query.idProfileFk
			);
		}
		addKeys(usersList);
		return usersList;
	}, [query, users]);

	// Delete product modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState();

	const handleOpenModal = (data) => {
		setCurrentUser(data);
		setIsModalOpen(true);
	};

	const handleCloseModal = async (bool) => {
		setLoading(true);
		if (!bool) {
			setLoading(false);
			setIsModalOpen(false);
			return;
		}
		setIsModalOpen(false);
		await handleDelete(currentUser.idUser, currentUser.fullname);
	};

	const handleDelete = async (idUser, name) => {
		try {
			await deleteUser(idUser);
			(idUser)
			message.success(`El usuario ${name} ha sido eliminado`);
		} catch (error) {
			message.error('Error al eliminar usuario');
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
						flexDirection: 'column',
					}}
				>
					<Title title="Usuarios" goBack={false}>
						{userProfile == PROFILES.MASTER && (
							<Link href='users/add'>
								<Button
									style={{marginRight: '-2.3rem'}}
									type="success"
								>
									Agregar
								</Button>
							</Link>
						)}
					</Title>
					<UserFilters setQuery={setQuery} />
					<UsersTable
						users={usersList}
						handleCloseModal={handleCloseModal}
						handleOpenModal={handleOpenModal}
						isModalOpen={isModalOpen}
						currentUser={currentUser}
						h={h}
					/>
				</div>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
}
