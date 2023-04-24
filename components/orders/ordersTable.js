import { Button, ConfigProvider, Empty, message, Table } from 'antd';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { Space } from 'antd';
import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { orderStatusToUse } from '../../pages/dashboard/orders';
import { useRouter } from 'next/router';
import { useOrders } from './hooks/useOrders';
import { useEffect, useState } from 'react';
import { useUser } from '../users/hooks/useUser';
import { useAuthContext } from '../../context/useUserProfileProvider';
import { PROFILES, PROFILE_LIST } from '../shared/profiles'

export default function OrdersTable({ orders }) {
	const router = useRouter();

	const { loading, setLoading } = useLoadingContext();
	const { user } = useOrders();


	const handleSeeDetail = (order, record) => {
		setLoading(true);
		router.push(`/dashboard/orders/${order.idOrderH}`);
		console.log(order.idStatusOrder);
	};

	const [users, setUsers] = useState({});
	const {
		getUserById,
	} = useUser();


	const getUserRequest = async () => {
		setLoading(true);
		const loggedUser = localStorage.userId
		try {
			const u = await getUserById(loggedUser);
			if (!u) {
				return u
			}
			setUsers(u);
			setProfile(
				PROFILE_LIST.filter((p) => p.id === u.idProfileFk)[0]
			);
			if (u.idProfileFk === 3) {
				await getSellerClientsRequest(u.idUser);
			}
		} catch (error) {
			console.log('todo ok');
		} finally {
			setLoading(false);
			/* console.log(users); */
		}
	};

	const { userProfile } = useAuthContext();


	useEffect(() => {
	  getUserRequest();
	
	}, []);
	
	const columns = [
		{
			title: 'Fecha de creación',
			dataIndex: 'created_at',
			key: 0,
			sorter: (a, b) => {
				let aDay = a.created_at.substring(5, 7);
				let bDay = b.created_at.substring(8, 10);
				
				let aMonth = a.created_at.substring(5, 7);
				let bMonth = b.created_at.substring(5, 7);
				
				let aYear = a.created_at.substring(0, 4);
				let bYear = b.created_at.substring(0, 4);

				let aDate = new Date(aDay, aMonth, aYear);
				let bDate = new Date(aDay, aMonth, aYear);

				return aDate - bDate
			},
			showSorterTooltip: false,
			render: (text) => <p>{text.slice(0, 10).split('-').reverse().join('-')}</p>,
		},
		{
			title: 'Ultima actualización',
			dataIndex: 'updated_at',
			key: 0,
			sorter: (a, b) => {
				let aDay = a.updated_at.substring(5, 7);
				let bDay = b.updated_at.substring(8, 10);
				
				let aMonth = a.updated_at.substring(5, 7);
				let bMonth = b.updated_at.substring(5, 7);

				let aYear = a.updated_at.substring(0, 4);
				let bYear = b.updated_at.substring(0, 4);

				let aDate = new Date(aDay, aMonth, aYear);
				let bDate = new Date(bDay, bMonth, bYear);

				return aDate - bDate
			},
			showSorterTooltip: false,
			render: (text) => (
				<p>{text.slice(0, 10).split('-').reverse().join('-')}</p>),
		},
		{
			title: 'Vendedor',
			dataIndex: 'fullname',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Cliente',
			dataIndex: 'fullNameClient',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Estado',
			dataIndex: 'statusOrder',
			key: 3,
			render: (text, record) => {
				switch (record.idStatusOrder) {
				case 1:
					return (
						<p style={{ color: '#ff6c0b', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 2:
					return (
						<p style={{ color: '#06a800', fontWeight: 'bold' }}> 
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 3:
					return (
						<p style={{ color: '#0984e3', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 4:
					return (
						<p style={{ color: '#ffd034', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 5:
					return (
						<p style={{ color: '#d63031', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 6:
					return (
						<p style={{ color: '#d63031', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				}
			},
		},
		{
			title: 'Acción',
			dataIndex: 'fullNameClient',
			key: 5,
			render: (text, order, record) => (
				<Space size="middle" style={{display: 'flex', justifyContent: 'center'}}>
					{userProfile == PROFILES.MASTER ? 
						(order.idStatusOrder == 2 || order.idStatusOrder == 6
							? <Button
								type='primary'
								onClick={() => handleSeeDetail(order)}
							>
								<EyeTwoTone/>
							</Button>
							: <Button
								onClick={() => handleSeeDetail(order, record)}
							>
								<EditOutlined/>
							</Button>
						)
						:
						(users.fullname !== text || order.idStatusOrder == 2 || order.idStatusOrder == 6
							? <Button
								type='primary'
								onClick={() => handleSeeDetail(order)}
							>
								<EyeTwoTone/>
							</Button>
							: <Button
								onClick={() => handleSeeDetail(order, record)}
							>
								<EditOutlined/>
							</Button>
						)
					}
				</Space>
			),
		},
	];


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
		<ConfigProvider renderEmpty={customizeRenderEmpty}>
			<Table columns={columns} dataSource={orders} loading={loading} />
		</ConfigProvider>

	)
}