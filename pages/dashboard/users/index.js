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

export default function Users() {
	const { requestHandler } = useRequest();

	const { loading, setLoading } = useLoadingContext();
	const { users, deleteUser, getUsers } = useUser();
	// const [loading, setLoading] = useState(true);

	// const [users, setUsers] = useState([]);
	const [query, setQuery] = useState({
		fullname: '',
		mail: '',
		idProfileFk: 0,
	});

	const generalContext = useContext(GeneralContext);

	useEffect(() => {
		setLoading(true)
		if (Object.keys(generalContext).length) {
			getUsers();
			setLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext]);

	const usersList = useMemo(() => {
		let usersList = users;
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
					<Row style={{ alignItems: 'center' }}>
						<Col
							lg={{ offset: 6, span: 12 }}
							md={{ offset: 6, span: 12 }}
							sm={{ offset: 6, span: 12 }}
							xs={{ span: 12 }}
						>
							<Typography>
								<h1
									style={{
										textAlign: 'center',
										fontSize: '1.5rem',
										margin: '.5rem 0',
									}}
								>
									Usuarios
								</h1>
							</Typography>
						</Col>
						<Col
							lg={{ span: 6 }}
							md={{ span: 6 }}
							sm={{ span: 6 }}
							xs={{ span: 12 }}
							style={{
								justifyContent: 'end',
								display: 'flex',
							}}
						>
							<Button type="primary">
								<Link href="users/add">Agregar</Link>
							</Button>
						</Col>
					</Row>
					<UserFilters setQuery={setQuery} />
					<UsersTable
						users={usersList}
						handleCloseModal={handleCloseModal}
						handleOpenModal={handleOpenModal}
						isModalOpen={isModalOpen}
						currentUser={currentUser}
					/>
				</div>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
}
