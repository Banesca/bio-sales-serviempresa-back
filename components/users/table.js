/* eslint-disable indent */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { Space, Button, Table, Modal, ConfigProvider } from 'antd';
import PropTypes from 'prop-types';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { PROFILES, PROFILE_LIST } from '../shared/profiles';
import { CustomizeRenderEmpty } from '../common/customizeRenderEmpty';

const UsersTable = ({
	users,
	handleCloseModal,
	handleOpenModal,
	currentUser,
	isModalOpen,
}) => {
	const [log, setLog] = useState();

	useEffect(() => {
		setLog(localStorage.getItem('userProfile'));
	}, []);

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
			title: 'Perfil',
			dataIndex: 'idProfileFk',
			key: 2,
			render: (text) => {
				let profile = PROFILE_LIST.find((p) => p.id === text);
				return (
					<p className="bg-gray-100 w-fit py-1 px-5 rounded-3xl">
						{profile?.name}
					</p>
				);
			},
		},
		{
			title: 'Acciones',
			dataIndex: 'idProfileFk',
			align: 'start',
			width: '40px',
			key: 5,
			defaultSortOrder: 'descend',
			sortDirections: ['descend'],
			sorter: (a, b) => a.idProfileFk > b.idProfileFk,
			render: (text, _, record) => (
				<Space size="middle" style={{}}>
					<Button
						type="primary"
						className="bg-blue-600 flex justify-center items-center"
						onClick={() => {
							router.push(`users/${_.idUser}`);
							setLoading(true);
						}}
					>
						<EyeTwoTone />
					</Button>
					{log == PROFILES.MASTER ? (
						<Button
							className="flex justify-center items-center"
							onClick={() => {
								router.push(`/dashboard/users/update/${_.idUser}`);
							}}
						>
							<EditOutlined />
						</Button>
					) : log !== PROFILES.BILLER &&
					  text !== PROFILES.MASTER &&
					  text == PROFILES.SELLER ? (
						<Button
							className="flex justify-center items-center"
							onClick={() => {
								router.push(`/dashboard/users/update/${_.idUser}`);
							}}
						>
							<EditOutlined />
						</Button>
					) : (
						<></>
					)}
					{log == PROFILES.MASTER && (
						<Button
							className="flex justify-center items-center"
							type="primary"
							danger
							onClick={() => {
								handleOpenModal(_);
							}}
						>
							<DeleteOutlined />
						</Button>
					)}
				</Space>
			),
		},
	];

	const router = useRouter();
	const { loading, setLoading } = useLoadingContext();

	useEffect(() => {
		if (users) {
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [users]);

	return (
		<div>
			<ConfigProvider
				renderEmpty={users.length !== 0 ? CustomizeRenderEmpty : ''}
			>
				<Table columns={columns} dataSource={users} loading={loading} />
			</ConfigProvider>

			<Modal
				title={'Detail'}
				open={isModalOpen}
				onOk={() => handleCloseModal(true)}
				onCancel={() => handleCloseModal(false)}
				footer={[
					<Button key="cancel" danger onClick={() => handleCloseModal(false)}>
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
