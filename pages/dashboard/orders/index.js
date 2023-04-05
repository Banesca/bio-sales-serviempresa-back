import { Col, Row, Button, Modal } from 'antd';
import { useContext, useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import Loading from '../../../components/shared/loading';
import Link from 'next/link';
import OrdersFilters from '../../../components/orders/ordersFilters';
import { useOrders } from '../../../components/orders/hooks/useOrders';
import { message } from 'antd';
import OrdersTable from '../../../components/orders/ordersTable';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { Typography } from 'antd';
import Title from '../../../components/shared/title';
import { useAuthContext } from '../../../context/useUserProfileProvider';
import PROFILES from '../../../components/shared/profiles'
import { FaUsers } from 'react-icons/fa';
import { RightOutlined, ShoppingFilled } from '@ant-design/icons';

export const orderStatusToUse = {
	1: 'Inconcluso',
	2: 'Facturado',
	3: 'Recibido',
	4: 'Procesado',
	5: 'Retenido', 
	6: 'Anulada'
};

export default function OrdersPage() {
	const { orders, getOrders } = useOrders();
	const generalContext = useContext(GeneralContext);
	const { loading, setLoading } = useLoadingContext();
	const { requestHandler } = useRequest();
	const { selectedBusiness } = useBusinessProvider();
	const { userProfile } = useAuthContext();


	const [isModalOpen, setIsModalOpen] = useState(false);

	const [query, setQuery] = useState({
		idStatusOrder: 0,
		startDate: null,
		endDate: null,
	});

	const handleSeeModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const getOrdersRequest = async (data) => {
		setLoading(true);
		try {
			await getOrders(data);
		} catch (error) {
			message.error('Error al cargar los pedidos');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		if (
			Object.keys(generalContext).length &&
			Object.keys(selectedBusiness).length
		) {
			getOrdersRequest({
				idBranchFk: selectedBusiness.idSucursal,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness]);

	// filters
	const ordersList = useMemo(() => {
		let list = orders;
		if (query.idStatusOrder) {
			if (list) {
				list = list.filter(
					(o) => o.idStatusOrder == query.idStatusOrder
				);
			}
		}
		return list;
	}, [query, orders]);

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{/* <Title title={'Pedidos'}>
					<Link href="orders/add">
						<Button type="success" style={{marginRight: '-2.3rem'}}>
							Agregar
						</Button>
					</Link>

				</Title> */}

				<h1 style={{color: '#012258', fontSize: '2rem', margin: '0'}}>Inicio</h1>
				<h3>Bienvenido <span style={{color: '#012258'}}>Pedro</span>, este es el estado de tus clientes</h3>
				{/* <ProductFilter setQuery={setQuery} clean={clean} /> */}


				<div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'space-between'}}>
					
					{/* First informative picture  */}
					<div style={{width: '33vw', height: 'fit-content', backgroundColor: '#fff', marginTop: '25px', marginBottom: '25px', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '.5px .5px 5px 1px #e6e6e6'}}>
						<header style={{display: 'flex', justifyContent: 'space-between', margin: '25px'}}>
							<section>
								<span style={{color: '#012258', fontSize: '2rem', fontWeight: 'bolder'}}>32</span>
								<h1 style={{marginTop: '0px', fontSize: '1rem'}}>Ordenes pendientes</h1>
							</section>
							<section style={{display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#012258', fontSize: '2rem', border: '2px solid', padding: '15px', borderRadius: '50%', width: 'fit-contents', height: 'fit-content'}}>
								<ShoppingFilled style={{width: '40px', height: '40px', display: 'flex', justifyContent: 'center'}}/>
							</section>
						</header>
						<footer style={{background: '#f2f7fccc', color: '#012258', width: '100%', marginBottom: '0px', padding: '6px', borderRadius: '8px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
							<h1 style={{margin: '0px auto 0px 20px', width: 'fit-content', position: 'relative'}}>
								Ver ordenes pendientes 
							</h1>
							<a>
								<RightOutlined/>
							</a>
						</footer>
					</div>

					{/*  Second informative picture */}
					<div style={{width: '33vw', height: 'fit-content', backgroundColor: '#fff', marginTop: '25px', marginBottom: '25px', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '.5px .5px 5px 1px #e6e6e6'}}>
						<header style={{display: 'flex', justifyContent: 'space-between', margin: '25px'}}>
							<section>
								<span style={{color: '#012258', fontSize: '2rem', fontWeight: 'bolder'}}>10</span>
								<h1 style={{marginTop: '0px', fontSize: '1rem'}}>Visitas por realizar</h1>
							</section>
							<section style={{display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#012258', fontSize: '2rem', border: '2px solid', padding: '15px', borderRadius: '50%', width: 'fit-contents', height: 'fit-content'}}>
								<FaUsers style={{width: '40px', height: '40px', display: 'flex', justifyContent: 'center'}}/>
							</section>
						</header>
						<footer style={{background: '#f2f7fccc', color: '#012258', width: '100%', marginBottom: '0px', padding: '6px', borderRadius: '8px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
							<h1 style={{margin: '0px auto 0px 20px', width: 'fit-content', position: 'relative'}}>
								Ver visitas pendientes 
							</h1>
							<a>
								<RightOutlined/>
							</a>
						</footer>
					</div>

				</div>
				{/* <OrdersFilters
					setQuery={setQuery}
					getOrdersRequest={getOrdersRequest}
				/> */}
				<OrdersTable orders={ordersList} />
			</div>
			<Modal
				title={'Detail'}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleSeeModal}
			>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Modal>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
}