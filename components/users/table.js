import { useEffect, useState } from 'react';

import { DeleteOutlined, EyeTwoTone } from '@ant-design/icons';
import { Space, Button, Table, Modal, Pagination } from 'antd';
import PropTypes from 'prop-types';

import { profiles } from '../../pages/dashboard/users';
import { getAdmins, getFullAccess, getSellers } from '../../services/users';
import { setKeys } from '../../util/setKeys';

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
					<Button type="primary" onClick={() => handleSeeModal()}>
						<EyeTwoTone />
					</Button>
					<Button type="primary" danger>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];

	const [loading, setLoading] = useState(false);
	const [data, setData] = useState();
	const [page, setPage] = useState();

	useEffect(() => {
		setLoading(true);
		if (profile === profiles.seller) {
			getSellers(null, page).then((response) => {
				setKeys(response.docs);
				setPage(response.page);
				setData(response);
			});
		} else if (profile === profiles.fullAccess) {
			getFullAccess().then((response) => {
				setKeys(response.docs);
				setData(response);
			});
		} else if (profile === profiles.admin) {
			getAdmins().then((response) => {
				setKeys(response.docs);
				setData(response);
			});
		}
		setLoading(false);
	}, [profile, page]);

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
				dataSource={data?.docs}
				loading={loading}
				pagination={{
					defaultCurrent: page || 1,
					total: data?.totalPages * 10,
				}}
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
