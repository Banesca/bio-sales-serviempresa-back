import { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button, Col, Row, message } from 'antd';
import DashboardLayout from '../../../components/shared/layout'
import UsersTable from '../../../components/users/table';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import Loading from '../../../components/shared/loading';
import UserFilters from '../../../components/users/filters';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { addKeys } from '../../../util/setKeys';

export default function Users() {
	const { requestHandler } = useRequest();

	const { loading, setLoading } = useLoadingContext();
	// const [loading, setLoading] = useState(true);

	const [users, setUsers] = useState([]);
	const [query, setQuery] = useState({
		fullname: '',
		mail: '',
		idProfileFk: 0,
	});

	const getUsersRequest = async () => {
		const res = await requestHandler.get(`/api/v2/user`);
		if (res.isLeft()) {
			setLoading(false);
			return;
		}
		const value = res.value.getValue();
		setUsers(value.data);
		setLoading(false);
	};

	const generalContext = useContext(GeneralContext);

	useEffect(() => {
		if (generalContext) {
			getUsersRequest();
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
		await handleDelete();
		await getUsersRequest();
	};

	const handleDelete = async () => {
		const res = await requestHandler.put(
			`/api/v2/user/change/status/${currentUser.idUser}/3`
		);
		console.log(res);
		setLoading(false);
		return message.success(
			`El usuario ${currentUser.fullname} ha sido eliminado`
		);
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
						<Col offset={6} span={12}>
							<h1
								style={{
									textAlign: 'center',
									fontSize: '2rem',
									color: '#fff',
								}}
							>
								Usuarios
							</h1>
						</Col>
						<Col
							span={6}
							style={{
								justifyContent: 'center',
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
