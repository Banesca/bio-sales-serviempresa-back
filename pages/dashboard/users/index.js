import { useContext, useEffect, useMemo, useState } from 'react';

import { Button, Col, Collapse, Row, Tabs } from 'antd';

import DashboardLayout from '../../../components/layout';
import UsersTable from '../../../components/users/table';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import Link from 'next/link';
import Loading from '../../../components/loading';
import UserFilters from '../../../components/users/filters';

export default function Users() {
	const { requestHandler } = useRequest();

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
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
		return usersList;
	}, [query, users]);

	if (loading) {
		return (
			<DashboardLayout>
				<Loading isLoading={loading} />
			</DashboardLayout>
		);
	}

	return (
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
				<UsersTable users={usersList} />
			</div>
		</DashboardLayout>
	);
}
