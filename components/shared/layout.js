import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Dropdown, Layout, Menu, Space } from 'antd';
import {
	ImportOutlined,
	UserOutlined,
	UsergroupAddOutlined,
	DownOutlined,
	ShopOutlined,
	CarOutlined,
	PieChartOutlined,
	TagsOutlined,
	ClusterOutlined,
	StockOutlined,
	TeamOutlined,
	DollarOutlined,
	GiftOutlined,
	ShoppingCartOutlined,
	ClockCircleOutlined,
	BellOutlined,
	LogoutOutlined,
} from '@ant-design/icons';

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
	'/login',
];

const itemsMenu = [
	getItem('Productos Gral.', 'sub1', <ShopOutlined />, [
		getItem('Productos', '1', <TagsOutlined />),
		getItem('Categorías', '2', <ClusterOutlined />),
		getItem('Inventario', '4', <StockOutlined />),
		getItem('Almacenes', '5', <ShopOutlined />),
	]),
	getItem('Perfiles', 'sub2', <UsergroupAddOutlined />, [
		getItem('Usuario', '6', <UserOutlined />),
		getItem('Clientes', '7', <TeamOutlined />),
		getItem('Condiciones de pago', '8', <DollarOutlined />),
		getItem('Merchandising', '9', <GiftOutlined />),
	]),
	getItem('Sucursal', 'sub3', <ShopOutlined />, [
		getItem('Pedidos', '10', <ShoppingCartOutlined />),
		getItem('Reportes general', '11', <PieChartOutlined />),
		getItem('Horarios', '12', <ClockCircleOutlined />),
		getItem('Camiones', '13', <CarOutlined />),
	]),
	getItem('Notificaciones', '14', <BellOutlined />),
	getItem('Cerrar sesión', '15', <LogoutOutlined />),
];
export default function DashboardLayout({ children }) {
	const [collapsed, setCollapsed] = useState(false);
	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};
	const sidebarLinks = [
		/* {
			key: '/dashboard/products',
			label: 'Productos',
			icon: React.createElement(ShoppingOutlined),
		}, */
		/* {
			key: '/dashboard/categories',
			label: 'Categorías',
			icon: React.createElement(ProfileOutlined),
		}, */
		/* {
			key: '/dashboard/brands',
			label: 'Marcas',
			icon: React.createElement(ProfileOutlined),
		}, */
		/* {
			key: '/dashboard/users',
			label: 'Usuarios',
			icon: React.createElement(UserOutlined),
		}, */
		/* {
			key: '/dashboard/clients',
			label: 'Clientes',
			icon: React.createElement(UsergroupAddOutlined),
		}, */
		/* {
			key: '/dashboard/orders',
			label: 'Pedidos',
			icon: React.createElement(IoBriefcaseOutline),
		}, */
		/* {
			key: '/dashboard/reports',
			label: 'Reportes',
			icon: React.createElement(ProfileOutlined),
		}, */
		/* {
			key: '/dashboard/stock',
			label: 'Inventario',
			icon: React.createElement(InboxOutlined),
		}, */
		/* {
			key: '/dashboard/time',
			label: 'Horaios',
			icon: React.createElement(FieldTimeOutlined),
		}, */
		/* {
			key: '/dashboard/store',
			label: 'Almacen',
			icon: React.createElement(ShopOutlined),
		}, */
		/* {
			key: '/dashboard/notifications',
			label: 'Notificaciones',
			icon: React.createElement(NotificationOutlined),
		}, */
		/* {
			key: '/dashboard/cars',
			label: 'Camiones',
			icon: React.createElement(CarOutlined),
		}, */
		/* {
			key: '/dashboard/pay',
			label: 'Condiciones de pago',
			icon: React.createElement(CreditCardOutlined),
		}, */
		/* {
			key: '/dashboard/merchandising',
			label: 'Merchandising',
			icon: React.createElement(ProjectOutlined),
		}, */
		{
			key: '/login',
			label: 'Cerrar Sesión',
			icon: React.createElement(ImportOutlined),
		},
	];
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
		if (routes[e.key] == actualKey) {
			return;
		}
		if (routes[e.key] == '/login') {
			localStorage.clear();
		}
		localStorage.setItem('key', routes[e.key]);
		setLoading(true);
		router.push(routes[parseInt(e.key - 1)]);
	};

	return (
		<>
			<Layout style={{ height: '100vh', width: '100%' }}>
				<Header
					className="flex justify-between items-center bg-white font-bold"
					theme="light"
				>
					<div className="relative h-12 w-44">
						<MainLogo />
					</div>
					<p className="text-3xl">{currentBusiness}</p>
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
				<Layout style={{ minHeight: 'fit-content' }} hasSider>
					<Sider theme="light" breakpoint="lg" collapsedWidth="3rem">
						<div className="w-full">
							<Menu
								defaultSelectedKeys={['1']}
								defaultOpenKeys={['sub1']}
								mode="inline"
								theme="dark"
								inlineCollapsed={collapsed}
								items={itemsMenu}
								onClick={handleNavigation}
								className="min-h-screen"
							/>
						</div>
					</Sider>
					<Layout>
						<div className="bg-[#F7F9FB]">
							<Content className="w-11/12 mx-auto">{children}</Content>
						</div>
					</Layout>
				</Layout>
			</Layout>
			<Loading isLoading={loading} />
		</>
	);
}
