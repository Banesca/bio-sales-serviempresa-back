import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Layout, Menu } from 'antd';
import {
	CarryOutOutlined,
	ShopOutlined,
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
			icon: React.createElement(CarryOutOutlined),
		},
		{
			key: '/dashboard/business',
			label: 'Empresas',
			icon: React.createElement(ShopOutlined),
		},
		{
			key: '/dashboard/sellers',
			label: 'Vendedores',
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
	];

	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [actualKey, setActualKey] = useState();

	useEffect(() => {
		let key = localStorage.getItem('key');
		if (!key) {
			localStorage.setItem('key', router.pathname);
			setActualKey(localStorage.getItem('key'));
		} else {
			setActualKey(localStorage.getItem('key'));
		}
	}, [router.pathname]);

	const handleNavigation = (e) => {
		if (e.key === actualKey) {
			return;
		}
		localStorage.setItem('key', e.key);
		router.push(e.key);
		setLoading(true);
	};

	return (
		<Layout style={{ height: '100vh' }}>
			<Header style={{ backgroundColor: 'white' }}>Logo</Header>
			<Layout>
				<Sider theme="light">
					<Menu
						mode="inline"
						items={sidebarLinks}
						onSelect={(e) => handleNavigation(e)}
						style={{ height: '100%' }}
					/>
				</Sider>
				<Content>{children}</Content>
			</Layout>
			<Loading isLoading={loading} />
		</Layout>
	);
}
