import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Layout, Menu } from 'antd';
import {
	CarryOutOutlined,
	ImportOutlined,
	ShopOutlined,
	UserOutlined,
	UsergroupAddOutlined,
} from '@ant-design/icons';

import Loading from './loading';
import logo from '../public/assets/logo.svg';

const { Header, Content, Sider } = Layout;

export default function DashboardLayout({ children }) {
	const sidebarLinks = [
		{
			key: '/dashboard/products',
			label: 'Productos',
			icon: React.createElement(CarryOutOutlined),
		},
		{
			key: '/dashboard/business',
			label: 'Empresas',
			icon: React.createElement(ShopOutlined),
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
			icon: React.createElement(UserOutlined),
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
			
		}
		localStorage.setItem('key', e.key);
		router.push(e.key);
		setLoading(true);
	};

	return (
		<Layout style={{ height: '100vh' }}>
			<Header
				style={{
					background: '#111',
					display: 'flex',
					justifyContent: 'start',
					alignItems: 'center',
				}}
			>
				<Image src={logo} width={100} height={50} alt={'logo'} />
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
				<Content style={{ heigh: '100vh' }}>{children}</Content>
			</Layout>
			<Loading isLoading={loading} />
		</Layout>
	);
}
