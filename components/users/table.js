import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { Space, Button, Table, Modal, ConfigProvider, Empty, message } from 'antd';
import PropTypes from 'prop-types';

import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { PROFILES, PROFILE_LIST } from '../shared/profiles';
import { useAuthContext } from '../../context/useUserProfileProvider';
import { useRequest } from '../../hooks/useRequest';
import { right } from '../../util/result';

const UsersTable = ({
	users,
	handleCloseModal,
	handleOpenModal,
	currentUser,
	isModalOpen,
}) => {

	const { requestHandler } = useRequest();	
	const [log, setLog] = useState();
	
	useEffect(() => {
		setLog(localStorage.getItem('userProfile'));
	  
	}, []);
	
	
	/* 	const getUserBusiness = async (userId) => {
		try {
			const res = await requestHandler.get(`/api/v2/user/branch/${userId}`);
			return res;
		} catch (error) {
			throw error;
		}
	};
 */
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
						onClick={() => {
							router.push(`users/${_.idUser}`);
							setLoading(true);
						}}
					>
						{/* <div>{text == PROFILES.SELLER ? getUserBusiness(_.idUser) : 'hola'}</div> */}
						<EyeTwoTone />
					</Button>
					{log == PROFILES.MASTER 
						?
						<Button
							onClick={() => {
								router.push(`/dashboard/users/update/${_.idUser}`);
							}}
						>
							<EditOutlined />
						</Button>
						:		 
						(log !== PROFILES.BILLER && text !== PROFILES.MASTER) && text == PROFILES.SELLER ? (
							<Button
								onClick={() => {
									router.push(`/dashboard/users/update/${_.idUser}`);
								}}
							>
								<EditOutlined />
							</Button>
						)
							:
							<></>
					}
					{log == PROFILES.MASTER && (
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
