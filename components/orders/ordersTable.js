/* eslint-disable indent */
import { Button, ConfigProvider, Table } from 'antd';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { Space } from 'antd';
import { EditOutlined, EyeTwoTone, PrinterOutlined } from '@ant-design/icons';
import { orderStatusToUse } from '../../pages/dashboard/orders';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser } from '../users/hooks/useUser';
import { useAuthContext } from '../../context/useUserProfileProvider';
import { PROFILES, PROFILE_LIST } from '../shared/profiles';
import { CustomizeRenderEmpty } from '../common/customizeRenderEmpty';



export default function OrdersTable({ orders }) {
	const router = useRouter();

	const { loading, setLoading } = useLoadingContext();
	const { ordersPay, setOrdersPay } = useState();
	const [ column, setColumns] = useState();
	const { userProfile } = useAuthContext();

	const handleSeeDetail = (order, record) => {
		setLoading(true);
		router.push(`/dashboard/orders/${order.idOrderH}`);
	};

	const handleSeeUpdate = (order, record) => {
		setLoading(true);
		router.push(`/dashboard/orders/update/${order.idOrderH}`);
	};

	const [users, setUsers] = useState({});
	const { getUserById } = useUser();

	const getUserRequest = async () => {
		setLoading(true);
		const loggedUser = localStorage.userId;
		try {
			const u = await getUserById(loggedUser);
			if (!u) {
				return u;
			}
			setUsers(u);
			
			if (u.idProfileFk === 3) {
				await getSellerClientsRequest(u.idUser);
			}
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};



	useEffect(() => {
		getUserRequest();
		console.log(columns)
		console.log(userProfile)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const columns = [
		{
			title: 'Orden Nro.',
			dataIndex: 'numberOrden',
		},
		{
			title: 'Nro. de Factura',
			dataIndex: 'facturaAfip',
		},
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
				let bDate = new Date(bDay, bMonth, bYear);

				return aDate - bDate;
			},
			showSorterTooltip: false,
			render: (text) => (
				<p>{text.slice(0, 10).split('-').reverse().join('-')}</p>
			),
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

				return aDate - bDate;
			},
			showSorterTooltip: false,
			render: (text) => (
				<p>{text.slice(0, 10).split('-').reverse().join('-')}</p>
			),
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
			align: 'center',
			render: (text, record) => (
				<p
					className={`font-bold text-center  ${
						orderStatusToUse[record.idStatusOrder].state == 'Por pagar'
							? 'text-orange-500'
							: orderStatusToUse[record.idStatusOrder].state == 'Cobrado'
							? 'text-green-500'
							: orderStatusToUse[record.idStatusOrder].state == 'Pagado'
							? 'text-blue-500'
							: orderStatusToUse[record.idStatusOrder].state == 'Despachado'
							? 'text-yellow-500'
							: orderStatusToUse[record.idStatusOrder].state == 'Anulado'
							? 'text-red-500'
							: orderStatusToUse[record.idStatusOrder].state == 'Retenido'
							? 'text-red-500'
							: ''
					} ${
						orderStatusToUse[record.idStatusOrder].state == 'Por pagar'
							? 'bg-orange-200'
							: orderStatusToUse[record.idStatusOrder].state == 'Cobrado'
							? 'bg-green-200'
							: orderStatusToUse[record.idStatusOrder].state == 'Pagado'
							? 'bg-blue-200'
							: orderStatusToUse[record.idStatusOrder].state == 'Despachado'
							? 'bg-yellow-200'
							: orderStatusToUse[record.idStatusOrder].state == 'Anulado'
							? 'bg-red-200'
							: orderStatusToUse[record.idStatusOrder].state == 'Retenido'
							? 'bg-red-200'
							: ''
					} px-2 py-1 rounded-xl`}
				>
					{orderStatusToUse[record.idStatusOrder].state}
				</p>
			),
		},
		{
			title: 'Acción',
			dataIndex: 'fullNameClient',
			key: 5,
			render: (text, order, record) => (
				<Space
					size="middle"
					style={{ display: 'flex', justifyContent: 'center' }}
				>
					{userProfile == PROFILES.MASTER ? (
						order.idStatusOrder == 2 ||
						order.idStatusOrder == 3 ||
						order.idStatusOrder == 6 ||
						order.idStatusOrder == 1 && order.isacountCourrient == 1 ||
						order.idStatusOrder == 4 ? (
							<Button
								type="primary"
								className="bg-blue-500"
								onClick={() => handleSeeDetail(order)}
							>
								<EyeTwoTone />
							</Button>
						) : (
							<Button onClick={() => handleSeeUpdate(order, record)}>
								<EditOutlined />
							</Button>
						)
					) : users.fullname !== text ||
					  order.idStatusOrder == 2 ||
					  order.idStatusOrder == 6 ||
					  order.idStatusOrder == 3 ||
					  order.idStatusOrder == 1 && order.isacountCourrient == 1 ||
					  order.idStatusOrder == 4 ? (
						<Button type="primary" onClick={() => handleSeeDetail(order)}>
							<EyeTwoTone />
						</Button>
					) : (
						<Button onClick={() => handleSeeUpdate(order, record)}>
							<EditOutlined />
						</Button>
					)}
				</Space>
			),
		},
	];



	useEffect(()=>{
		setColumns(columns)
	},[userProfile])

	return (
		<ConfigProvider
			renderEmpty={orders?.length !== 0 || true ? CustomizeRenderEmpty : ''}
		>
			<Table columns={column} dataSource={orders} loading={loading} />
			
		</ConfigProvider>
	);
}
