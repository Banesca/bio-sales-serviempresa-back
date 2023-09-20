import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Dropdown, Layout, Menu, Space, } from 'antd';
import SelectBusiness from '../business/selectBusiness';
import {
	UserOutlined,
	DownOutlined,
	ClusterOutlined,
	StockOutlined,
	TeamOutlined,
	LogoutOutlined,
	ShopFilled,
	TagsFilled,
	PieChartFilled,
	ClockCircleFilled,
	GiftFilled,
	BellFilled,
	TrademarkCircleFilled,
	DollarCircleFilled,
	SettingOutlined,
	DollarOutlined,
} from '@ant-design/icons';
import { FaShoppingCart, FaTruck, FaUsers } from 'react-icons/fa';

import Loading from './loading';
import MainLogo from '../logos/mainLogo';

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children, type) {
	return {
		key,
		icon,
		children,
		label,
		type,
	};
}

const routes = [
	'/dashboard/products',
	'/dashboard/categories',
	'/dashboard/brands',
	'/dashboard/stock',
	'/dashboard/store',
	'/dashboard/users',
	'/dashboard/clients',
	'/dashboard/pay',
	'/dashboard/merchandising',
	'/dashboard/orders',
	'/dashboard/reports',
	'/dashboard/time',
	'/dashboard/cars',
	'/dashboard/notifications',
	'/dashboard/tdc',
	'/login',
];

const itemsMenu = [
	getItem('Productos', 'sub1', <ShopFilled />, [
		getItem('Listados', '1', <TagsFilled />),
		getItem('Categorías', '2', <ClusterOutlined />),
		getItem('Inventario', '4', <StockOutlined />),
		getItem('Almacenes', '5', <ShopFilled />),
	]),
	getItem('Usuarios', '6', <UserOutlined />),
	getItem('Clientes', '7', <TeamOutlined />),
	getItem('Ordenes', '10', <FaShoppingCart />),
	getItem('Reportes', '11', <PieChartFilled />),
	getItem('Horarios', '12', <ClockCircleFilled />),
	getItem('Condiciones de pago', '8', <DollarCircleFilled />),
	getItem('Tasa de cambio', '15', <DollarOutlined />),
	getItem('Camiones', '13', <FaTruck />),
	getItem('Merchandising', '9', <GiftFilled />),
	getItem('Notificaciones', '14', <BellFilled />),
	getItem('Cerrar sesión', '16', <LogoutOutlined />),
];
export default function DashboardLayout({ children }) {
	const [collapsed, setCollapsed] = useState(false);
	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};
	const items = [
		{
			label: (
				<div className="flex flex-col gap-4">
					<h1 className="font-bold">Administrador</h1>
					<h1>Email: admin@admin.com</h1>
					<Button
						onClick={() => {
							router.push('/dashboard/users/update/1');
						}}
					>
						Editar perfil
					</Button>
				</div>
			),
			key: '0',
		},
	];

	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [actualKey, setActualKey] = useState();
	const [currentBusiness, setCurrentBusiness] = useState();

	useEffect(() => {
		setActualKey(router.pathname);
	}, [router.pathname]);

	useEffect(() => {
		setCurrentBusiness(localStorage.getItem('bs'));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [children]);

	const handleNavigation = (e) => {
		if (routes[parseInt(e.key - 1)] == actualKey) {
			return;
		}
		if (routes[parseInt(e.key - 1)] == '/login') {
			localStorage.clear();
		}
		localStorage.setItem('key', routes[e.key]);
		setLoading(true);
		router.push(routes[parseInt(e.key - 1)]);
	};

	return (
		<>
			<Layout className="h-full w-full">
				<Header
					className="flex justify-between items-center bg-white font-bold"
					theme="light"
				>
					<div className="relative h-12 w-44">
						<MainLogo />
					</div>
					
					<SelectBusiness />
					<Dropdown
						menu={{
							items,
						}}
						trigger={['click']}
					>
						<Button className="bg-gray-50" onClick={(e) => e.preventDefault()}>
							<Space>
								Perfil
								<DownOutlined />
							</Space>
						</Button>
					</Dropdown>
				</Header>
				<Layout className="h-full min-h-screen" hasSider>
					<Sider theme="dark" breakpoint="lg" collapsedWidth="3rem">
						<div className="w-full h-full">
							<Menu
								mode="inline"
								theme="dark"
								inlineCollapsed={collapsed}
								items={itemsMenu}
								onClick={handleNavigation}
								className="h-full bg-[#012258] text-white"
							/>
						</div>
					</Sider>
					<Layout className="h-full min-h-screen">
						<div className="bg-[#F7F9FB] min-h-screen">
							<Content className="w-11/12 mx-auto">{children}</Content>
						</div>
					</Layout>
				</Layout>
			</Layout>
			<Loading isLoading={loading} />
		</>
	);
}
