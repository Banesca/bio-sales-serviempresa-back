import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { Space, Button, Table, Modal, ConfigProvider, Empty } from 'antd';
import PropTypes from 'prop-types';

import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { PROFILES, PROFILE_LIST } from '../shared/profiles';
import { useAuthContext } from '../../context/useUserProfileProvider';

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
			title: 'Perfil',
			dataIndex: 'idProfileFk',
			key: 2,
			render: (text) => {
				let profile = PROFILE_LIST.find((p) => p.id === text);
				return <p>{profile?.name}</p>;
			},
		},
		{
			title: 'Acciones',
			align: 'center',
			width: '40px',
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
					{userProfile == PROFILES.MASTER && (
						<Button
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
	const { userProfile } = useAuthContext();

	// const [loading, setLoading] = useState(true);
	const { loading, setLoading } = useLoadingContext();

	useEffect(() => {
		if (users) {
			setLoading(false);
		}
	}, [users]);

	const customizeRenderEmpty = () => (
		<Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
			style={{
				textAlign: 'center',
				marginBottom: '30px'
			}}
			description={
				<span>
					Sin datos
				</span>
			}
		>
			
		</Empty>
	);

	return (
		<div>
			<ConfigProvider renderEmpty={customizeRenderEmpty}>
				<Table
					columns={columns}
					dataSource={users}
					loading={loading}
					//onChange={(some) => setPage(some.current)}
				/>
			</ConfigProvider>

			<Modal
				title={'Detail'}
				open={isModalOpen}
				onOk={() => handleCloseModal(true)}
				onCancel={() => handleCloseModal(false)}
				footer={[
					<Button
						key="cancel"
						danger
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
