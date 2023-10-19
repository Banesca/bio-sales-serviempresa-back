import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Dropdown, Layout, Menu, Space } from 'antd';
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
	'/dashboard/rutas',
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
	getItem(
		'Condiciones de pago',
		'8',
		<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"> {/* <style>svg{fill:#fcfcfc}</style>  */}<path d="M112 112c0 35.3-28.7 64-64 64V336c35.3 0 64 28.7 64 64H464c0-35.3 28.7-64 64-64V176c-35.3 0-64-28.7-64-64H112zM0 128C0 92.7 28.7 64 64 64H512c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM176 256a112 112 0 1 1 224 0 112 112 0 1 1 -224 0zm80-48c0 8.8 7.2 16 16 16v64h-8c-8.8 0-16 7.2-16 16s7.2 16 16 16h24 24c8.8 0 16-7.2 16-16s-7.2-16-16-16h-8V208c0-8.8-7.2-16-16-16H272c-8.8 0-16 7.2-16 16z"/></svg>
	),
	getItem('Tasa de cambio', '16', <DollarOutlined />),
	getItem('Camiones', '13', <FaTruck />),
	getItem(
		'Rutas',
		'14',
		<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
			<path d="M512 96c0 50.2-59.1 125.1-84.6 155c-3.8 4.4-9.4 6.1-14.5 5H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c53 0 96 43 96 96s-43 96-96 96H139.6c8.7-9.9 19.3-22.6 30-36.8c6.3-8.4 12.8-17.6 19-27.2H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-53 0-96-43-96-96s43-96 96-96h39.8c-21-31.5-39.8-67.7-39.8-96c0-53 43-96 96-96s96 43 96 96zM117.1 489.1c-3.8 4.3-7.2 8.1-10.1 11.3l-1.8 2-.2-.2c-6 4.6-14.6 4-20-1.8C59.8 473 0 402.5 0 352c0-53 43-96 96-96s96 43 96 96c0 30-21.1 67-43.5 97.9c-10.7 14.7-21.7 28-30.8 38.5l-.6 .7zM128 352a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM416 128a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
		</svg>
	),
	getItem('Merchandising', '9', <GiftFilled />),
	getItem('Notificaciones', '15', <BellFilled />),
	getItem('Cerrar sesión', '17', <LogoutOutlined />),
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
