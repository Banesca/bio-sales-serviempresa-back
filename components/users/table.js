import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { Space, Button, Table, Modal, Pagination } from 'antd';
import PropTypes from 'prop-types';

import { profiles } from '../../pages/dashboard/users';
import { addKeys } from '../../util/setKeys';
import { users } from '../../util/database';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';
import { useRequest } from '../../hooks/useRequest';

const UsersTable = ({
	users,
	handleCloseModal,
	handleOpenModal,
	currentUser,
	isModalOpen,
}) => {
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
			title: 'Acciones',
			key: 5,
			render: (_, record) => (
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
							router.push(`/dashboard/users/update/${_.idUser}`);
						}}
					>
						<EditOutlined />
					</Button>
					<Button
						type="primary"
						danger
						onClick={() => {
							handleOpenModal(_);
						}}
					>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];

	const router = useRouter();
	const { requestHandler } = useRequest();

	const [loading, setLoading] = useState(true);

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
				//onChange={(some) => setPage(some.current)}
			/>
			<Modal
				title={'Detail'}
				open={isModalOpen}
				onOk={() => handleCloseModal(true)}
				onCancel={() => handleCloseModal(false)}
				footer={[
					<Button
						key="cancel"
						onClick={() => handleCloseModal(false)}
					>
						Cancelar
					</Button>,
					<Button
						type="primary"
						danger
						key="delete"
						onClick={() => handleCloseModal(true)}
					>
						Eliminar
					</Button>,
				]}
			>
				<p>{`Estas seguro de eliminar al usuario ${currentUser?.fullname}`}</p>
			</Modal>
		</div>
	);
};

UsersTable.propTypes = {
	users: PropTypes.array,
};

export default UsersTable;
