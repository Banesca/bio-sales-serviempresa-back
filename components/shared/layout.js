import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoBriefcaseOutline } from 'react-icons/io5';
import { Button, Dropdown, Layout, Menu, Space } from 'antd';
import {
	ImportOutlined,
	ProfileOutlined,
	ShoppingOutlined,
	UserOutlined,
	UsergroupAddOutlined,
	InboxOutlined,
	NotificationOutlined,
	DownOutlined,
	ShopOutlined,
	CarOutlined,
	CreditCardOutlined,
	ProjectOutlined,
	FieldTimeOutlined,
} from '@ant-design/icons';

import Loading from './loading';
import MainLogo from '../logos/mainLogo';

const { Header, Content, Sider } = Layout;

export default function DashboardLayout({ children }) {
	const sidebarLinks = [
		{
			key: '/dashboard/products',
			label: 'Productos',
			icon: React.createElement(ShoppingOutlined),
		},
		{
			key: '/dashboard/categories',
			label: 'Categorías',
			icon: React.createElement(ProfileOutlined),
		},
		{
			key: '/dashboard/brands',
			label: 'Marcas',
			icon: React.createElement(ProfileOutlined),
		},
		{
			key: '/dashboard/users',
			label: 'Usuarios',
			icon: React.createElement(UserOutlined),
		},
		{
			key: '/dashboard/clients',
			label: 'Clientes',
			icon: React.createElement(UsergroupAddOutlined),
		},
		{
			key: '/dashboard/orders',
			label: 'Pedidos',
			icon: React.createElement(IoBriefcaseOutline),
		},
		{
			key: '/dashboard/reports',
			label: 'Reportes',
			icon: React.createElement(ProfileOutlined),
		},
		{
			key: '/dashboard/stock',
			label: 'Inventario',
			icon: React.createElement(InboxOutlined),
		},
		{
			key: '/dashboard/time',
			label: 'Horaios',
			icon: React.createElement(FieldTimeOutlined),
		},
		{
			key: '/dashboard/store',
			label: 'Almacen',
			icon: React.createElement(ShopOutlined),
		},
		{
			key: '/dashboard/notifications',
			label: 'Notificaciones',
			icon: React.createElement(NotificationOutlined),
		},
		{
			key: '/dashboard/cars',
			label: 'Camiones',
			icon: React.createElement(CarOutlined),
		},
		{
			key: '/dashboard/pay',
			label: 'Condiciones de pago',
			icon: React.createElement(CreditCardOutlined),
		},
		{
			key: '/dashboard/merchandising',
			label: 'Merchandising',
			icon: React.createElement(ProjectOutlined),
		},
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
		if (e.key === actualKey) {
			return;
		}
		if (e.key === '/login') {
			localStorage.clear();
		}
		localStorage.setItem('key', e.key);
		setLoading(true);
		router.push(e.key);
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
						<Menu
							items={sidebarLinks}
							onSelect={(e) => handleNavigation(e)}
							className="flex flex-col gap-5 h-full bg-[#012258] text-white"
						/>
						<h1 className="sticky -mt-8 ml-4 hidden lg:block text-white">
							Version 0.1.0
						</h1>
					</Sider>
					<Layout>
						<div className="bg-[#F7F9FB">
							<Content className="w-11/12 mx-auto">{children}</Content>
						</div>
					</Layout>
				</Layout>
			</Layout>
			<Loading isLoading={loading} />
		</>
	);
}
