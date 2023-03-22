import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoBriefcaseOutline } from 'react-icons/io5';
import { Button, Layout, Menu } from 'antd';
import {
	ImportOutlined,
	ProfileOutlined,
	ShoppingCartOutlined,
	ShoppingOutlined,
	UserOutlined,
	UsergroupAddOutlined,
	InboxOutlined,
} from '@ant-design/icons';

import Loading from './loading';
import { useRequest } from '../../hooks/useRequest';
import { useAuthContext } from '../../context/useUserProfileProvider';
import { PROFILES, PROFILE_LIST } from '../shared/profiles';


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
			key: '/dashboard/stock',
			label: 'Inventario',
			icon: React.createElement(InboxOutlined),
		},
		{
			key: '/dashboard/profile',
			label: 'Mi perfil',
			icon: React.createElement(UserOutlined),
		},
		{
			key: '/login',
			label: 'Cerrar Sesión',
			icon: React.createElement(ImportOutlined),
		}
	];
	const sidebar = [
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
			key: '/dashboard/stock',
			label: 'Inventario',
			icon: React.createElement(InboxOutlined),
		},
		{
			key: '/dashboard/profile',
			label: 'Mi perfil',
			icon: React.createElement(UserOutlined),
		},
		{
			key: '/login',
			label: 'Cerrar Sesión',
			icon: React.createElement(ImportOutlined),
		}
	];

	const router = useRouter();
	const { userProfile } = useAuthContext();


	const [loading, setLoading] = useState(false);
	const [actualKey, setActualKey] = useState();
	const [currentBusiness, setCurrentBusiness] = useState();
	

	useEffect(() => {
		setActualKey(router.pathname);
	}, [router.pathname]);
	
	useEffect(() => {
		setCurrentBusiness(localStorage.getItem('bs'));
		/* setCurrentBusiness(business?.map(b => b.nombre)); */
		getUserBusiness();
	}, [children]);
	

	const handleNavigation = (e) => {
		if (e.key === actualKey) {
			return;
		}
		// logout
		if (e.key === '/login') {
			localStorage.clear()
		}
		localStorage.setItem('key', e.key);
		setLoading(true);
		router.push(e.key);
	};

	const { requestHandler } = useRequest();
	const [business, setBusiness] = useState();
	

	const getUserBusiness = async () => {
		const loggedUser = localStorage.getItem('userId')
		const res = await requestHandler.get(`/api/v2/user/branch/${loggedUser}`);
		if (res.isLeft()) {
			return;
		}
		const value = res.value._value.data;
		localStorage.setItem('bus', value[0].nombre)
		setBusiness(value[0].nombre);
	};

	return (
		<>
			<Layout style={{ height: '100vh', width: '100%' }}>
				<Header
					className='header'
					theme="light"
					style={{
						backgroundColor: '#0984e3',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						zIndex: 1000,
						width: '100%'
					}}
				>
					<p
						style={{
							marginLeft: '-25px',
							fontWeight: 'bolder',
							fontSize: '1.5rem',
							color: 'white',
						}}
					>
						SiempreOL
					</p>
					<p style={{
						alignSelf: 'center', 
						fontWeight: 'bolder',
						fontSize: '1.8rem',
						color: 'white'
					}}>
						{/* {business == '' ? '' : business} */}
						{currentBusiness !== [] ? business : currentBusiness}
					</p>
					<p></p>
				</Header>
				<Layout style={{ minHeight: 'fit-content' }} hasSider>
					<Sider
						theme="light"
						breakpoint="lg"
						collapsedWidth='3rem'
						width='10rem'
					>
						<Menu
							mode="inline"
							className='menu'
							items={userProfile == PROFILES.BILLER ? sidebar : sidebarLinks}
							onSelect={(e) => handleNavigation(e)}
							style={{ height: '100%', marginTop: '10px' }}
						/>
						<h1 className='version' style={{position: 'sticky', marginTop: '-30px', marginLeft: '15px'}}>Version 0.9.5</h1>
					</Sider>
					<Layout>
						<Content
							className='content' style={{ heigh: '100vh', overflow: 'initial', backgroundColor: '#F7F9FB' }}
						>
							{children}
						</Content>
					</Layout>
				</Layout>
			</Layout>
			<Loading isLoading={loading} />
		</>
	);
}