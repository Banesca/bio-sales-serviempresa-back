import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { Space, Button, Table, Modal, Pagination } from 'antd';
import PropTypes from 'prop-types';

import { profiles } from '../../pages/dashboard/users';
import { addKeys } from '../../util/setKeys';
import { users } from '../../util/database';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';

const UsersTable = ({ users }) => {
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'fullname',
			key: 0,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Correo',
			dataIndex: 'mail',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Empresa',
			dataIndex: 'business',
			key: 3,
			render: () => <p>{selectedBusiness.nombre}</p>,
		},
		{
			title: 'Acciones',
			key: 5,
			render: (_, index) => (
				<Space size="middle">
					<Button
						type="primary"
						onClick={() => {
							router.push(`users/${_.idUser}`);
							setLoading(true);
						}}
					>
						<EyeTwoTone />
					</Button>
					<Button
						onClick={() => {
							router.push(
								`/dashboard/users/update/${_.idUser}`
							);
						}}
					>
						<EditOutlined />
					</Button>
				</Space>
			),
		},
	];

	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState();
	const [page, setPage] = useState();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleSeeModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const { selectedBusiness } = useBusinessProvider();

	useEffect(() => {
		if (users) {
			setLoading(false);
		}
	}, [users]);

	return (
		<div>
			<Table
				columns={columns}
				dataSource={users}
				loading={loading}
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
	users: PropTypes.array,
};

export default UsersTable;
