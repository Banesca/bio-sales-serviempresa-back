import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoBriefcase, IoBriefcaseOutline } from 'react-icons/io5';
import { Button, Layout, Menu } from 'antd';
import {
	ImportOutlined,
	ProfileOutlined,
	ShoppingCartOutlined,
	ShoppingOutlined,
	UserOutlined,
	UsergroupAddOutlined,
	InboxOutlined,
	BellOutlined,
	BellFilled,
	ShoppingFilled,
	ShopFilled,
	DownOutlined,
	HomeOutlined,
	HomeFilled,
	SettingFilled,
	DiffFilled,
	ApiFilled,
	CalendarFilled,
} from '@ant-design/icons';
import {BsFillCartFill} from 'react-icons/bs';
import Loading from './loading';
import { useRequest } from '../../hooks/useRequest';
import { useAuthContext } from '../../context/useUserProfileProvider';
import { PROFILES, PROFILE_LIST } from '../shared/profiles';
import { FaUserAlt, FaUserFriends } from 'react-icons/fa';


const { Header, Content, Sider } = Layout;

export default function DashboardLayout({ children }) {
	const sidebarLinks = [
		{
			key: '/dashboard/home',
			label: 'Inicio',
			icon: React.createElement(HomeFilled),
		},
		{
			key: '/dashboard/products',
			label: 'Catalogo',
			icon: React.createElement(ShoppingFilled),
		},
		/* {
			key: '/dashboard/categories',
			label: 'Categorías',
			icon: React.createElement(ProfileOutlined),
		},
		{
			key: '/dashboard/brands',
			label: 'Marcas',
			icon: React.createElement(ProfileOutlined),
		}, */
		/* {
			key: '/dashboard/users',
			label: 'Usuarios',
			icon: React.createElement(UserOutlined),
		}, */
		{
			key: '/dashboard/orders',
			label: 'Pedidos',
			icon: React.createElement(IoBriefcase),
		},
		{
			key: '/dashboard/shopping',
			label: 'Carrito de compras',
			icon: React.createElement(BsFillCartFill),
		},
		/* {
			key: '/dashboard/stock',
			label: 'Inventario',
			icon: React.createElement(InboxOutlined),
		}, */
		{
			key: '/dashboard/clients',
			label: 'Clientes',
			icon: React.createElement(FaUserFriends),
		},
		{
			key: '/dashboard/reports',
			label: 'Reportes',
			icon: React.createElement(DiffFilled),
		},
		{
			key: '/dashboard/calendar',
			label: 'Calendario',
			icon: React.createElement(CalendarFilled),
		},
		{
			key: '/dashboard/settings',
			label: 'Configuración',
			icon: React.createElement(SettingFilled),
		},
		{
			key: '/dashboard/profile',
			label: 'Mi perfil',
			icon: React.createElement(FaUserAlt),
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
			label: 'Inicio',
			icon: React.createElement(ShoppingOutlined),
		},
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
		getUserBusiness();
		setCurrentBusiness(localStorage.getItem('bs'));
		/* setCurrentBusiness(business?.map(b => b.nombre)); */
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
		localStorage.setItem('bus', value[0]?.nombre)
		setBusiness(value[0]?.nombre);
	}

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
						className='logo'
						style={{
							marginLeft: '-25px',
							fontWeight: 'bolder',
							fontSize: '1.5rem',
							color: 'black',
						}}
					>
					</p>
					<p style={{
						alignSelf: 'center', 
						fontWeight: 'bolder',
						fontSize: '1.8rem',
						color: 'black'
					}}>
						{/* {business == '' ? '' : business} */}
						{currentBusiness == [] ? business : currentBusiness}
					</p>
					<p className='header-icons'>
						<Button className='layout-btn'><BellFilled></BellFilled></Button>
						<Button className='layout-btn'><BsFillCartFill></BsFillCartFill></Button>
						<Button className='layout-btn'><UserOutlined></UserOutlined> web<DownOutlined></DownOutlined></Button>
					</p>
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
							style={{ height: '100%', marginTop: '10px'}}
						/>
						{/* <h1 className='version' style={{position: 'sticky', marginTop: '-30px', marginLeft: '15px'}}>Version 0.9.5</h1> */}
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