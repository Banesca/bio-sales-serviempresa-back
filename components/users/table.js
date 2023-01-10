import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { DeleteOutlined, EyeTwoTone } from '@ant-design/icons';
import { Space, Button, Table, Modal, Pagination } from 'antd';
import PropTypes from 'prop-types';

import { profiles } from '../../pages/dashboard/users';
import { getAdmins, getFullAccess, getSellers } from '../../services/users';
import { addKeys } from '../../util/setKeys';
import { users } from '../../util/database';

const UsersTable = ({ profile }) => {
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'firstName',
			key: 0,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Apellido',
			dataIndex: 'lastName',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Correo',
			dataIndex: 'email',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Empresa',
			dataIndex: 'business',
			key: 3,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			key: 5,
			render: (_, index) => (
				<Space size="middle">
					<Button
						type="primary"
						onClick={() => {
							router.push(`users/${_.id}`);
							setLoading(true);
						}}
					>
						<EyeTwoTone />
					</Button>
					<Button type="primary" danger>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];

	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [data, setData] = useState();
	const [page, setPage] = useState();

	useEffect(() => {
		setLoading(true);
		if (profile === profiles.seller) {
			addKeys(users);
			setData(users);
			// getSellers(null, page).then((response) => {
			// 	//setPage(response.page);
			// });
		} else if (profile === profiles.fullAccess) {
			addKeys(users);
			setData(users);
			// getFullAccess().then((response) => {});
		} else if (profile === profiles.admin) {
			addKeys(users);
			setData(users);
			// getAdmins().then((response) => {});
		}
		setLoading(false);
	}, [profile, page]);

	console.log(data, 'Dataa');
	console.log(users, 'Users');

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleSeeModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	console.log(data);

	return (
		<div>
			<h1
				style={{ fontSize: '2rem', color: '#fff', textAlign: 'center' }}
			>
				{profile === profiles.admin
					? 'Administradores'
					: profile === profiles.seller
					? 'Vendedores'
					: 'Full acceso'}
			</h1>
			<Table
				columns={columns}
				dataSource={data}
				loading={loading}
				// pagination={{
				// 	defaultCurrent: page || 1,
				// 	total: data?.totalPages * 10,
				// }}
				onChange={(some) => setPage(some.current)}
			/>
			<Modal
				title={'Detail'}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleSeeModal}
			>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Modal>
		</div>
	);
};

UsersTable.propTypes = {
	profile: PropTypes.string.isRequired,
};

export default UsersTable;
