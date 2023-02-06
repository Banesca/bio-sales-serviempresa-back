import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Layout, Menu } from 'antd';
import {
	ImportOutlined,
	ProfileOutlined,
	ShoppingCartOutlined,
	ShoppingOutlined,
	UserOutlined,
	UsergroupAddOutlined,
} from '@ant-design/icons';

import Loading from './loading';

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
			icon: React.createElement(ShoppingCartOutlined),
		},
		{
			key: '/login',
			label: 'Cerrar Sesión',
			icon: React.createElement(ImportOutlined),
		},
	];

	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [actualKey, setActualKey] = useState();

	useEffect(() => {
		setActualKey(router.pathname);
	}, [router.pathname]);

	const handleNavigation = (e) => {
		if (e.key === actualKey) {
			return;
		}
		// logout
		if (e.key === '/login') {
			localStorage.removeItem('accessToken');
		}
		localStorage.setItem('key', e.key);
		setLoading(true);
		router.push(e.key);
	};

	return (
		<>
			<Layout style={{ height: '100vh' }}>
				<Header
					style={{
						background: '#111',
						display: 'flex',
						justifyContent: 'start',
						alignItems: 'center',
					}}
				>
					<p style={{ fontWeight: 'bolder', fontSize: '1.5rem' }}>
						SiempreOL
					</p>
				</Header>
				<Layout style={{ minHeight: 'fit-content' }}>
					<Sider theme="light">
						<Menu
							mode="inline"
							items={sidebarLinks}
							onSelect={(e) => handleNavigation(e)}
							style={{ height: '100vh' }}
						/>
					</Sider>
					<Content style={{ heigh: '100vh', overflow: 'auto' }}>
						{children}
					</Content>
				</Layout>
			</Layout>
			<Loading isLoading={loading} />
		</>
	);
}
