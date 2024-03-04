/* eslint-disable indent */
import DashboardLayout from '../../../components/shared/layout';
import {
	Button,
	List,
	message,
	Table,
	Modal,
	Form,
	Row,
	Col,
	Input,
	Typography
} from 'antd';
import { ConsoleSqlOutlined, ExportOutlined } from '@ant-design/icons';
import Loading from '../../../components/shared/loading';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GeneralContext } from '../../_app';
import { orderStatusToUse } from '.';
import DetailOrderTable from '../../../components/orders/detail/orderTable';
import ChangeOrderStatus from '../../../components/orders/detail/changeStatus';
import Title from '../../../components/shared/title';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useOrders } from '../../../components/orders/hooks/useOrders';
import { useAuthContext } from '../../../context/useUserProfileProvider';
import { PROFILES, PROFILE_LIST } from '../../../components/shared/profiles';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { useTdc } from '../../../components/tdc/useTdc';
import { useRequest } from '../../../hooks/useRequest';
import { apiImg, ipBackOffice } from '../../../util/environment';



const OrderDetail = () => {
	const router = useRouter();
	const [openModal2, setOpenModal2] = useState(false);
	const [openModal3, setOpenModal3] = useState(false);
	const { id } = router?.query;
	const [log, setLog] = useState();
	const { actualTdc, updateTdc } = useTdc();
	const [modalIsOpen, setModalIsOpen] = useState(false);
	useEffect(() => {
		setLog(localStorage.getItem('userProfile'));
	}, []);
	const { requestHandler } = useRequest();
	const { loading, setLoading } = useLoadingContext();
	const { user, currentOrder, getOrderById, changeStatus } = useOrders();
	const { userProfile } = useAuthContext();
	const [dataSource, setDataSource] = useState([]);
	const generalContext = useContext(GeneralContext);
	const [model, setModel] = useState('');
	const [model2, setModel2] = useState('');
	const [sourceImage, setSourceImage] = useState('');
	const [model3, setModel3] = useState('');
	const getOrderRequest = async (id) => {
		setLoading(true);
		try {
			await getOrderById(id);
		} catch (error) {
			message.error('Error al cargar el pedido');
		} finally {
			setLoading(false);
		}
	};

	const getFoto=(a,b) => {
		setModalIsOpen(a)
		setSourceImage(b)
	}

	const getStatus = () => {
		let status = currentOrder.idStatusOrder;
		let color = '';
		status;
		if (status == 1) {
			color = '#ff6c0b';
		} else if (status == 2) {
			color = '#06a800';
		} else if (status == 3) {
			color = '#0984e3';
		} else if (status == 4) {
			color = '#ffd034';
		} else if (status == 5) {
			color = '#d63031';
		} else if (status == 6) {
			color = '#d63031';
		} else {
			color = '#969696';
		}
		return color;
	};

	const defaultColumns2 = [
		{
			title: 'Metodo de pago',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Monto a pagar',
			dataIndex: 'monto',
			key: 'monto',
		},
	];

	const attributes = {
		mpCash: 'Efectivo ($)',
		mpCreditCard: 'Crédito',
		mpDebitCard: 'Débito',
		mpTranferBack: 'Transferencia',
		mpMpago: 'Pago Móvil',
		mpUber: 'BioPago',
		mpPedidosya: 'Binance',
		mpJust: 'Efectivo (Bs)',
		mpWabi: 'Efectivo (Euro)',
		mpOtro2: 'Punto de venta',
		mpPersonal: 'Banco internacionales',
		mpPaypal: 'Paypal',
		mpZelle: 'Zelle',
	};


	let selectedBusiness;
	let idSucursal;
	if (typeof window !== 'undefined') {
		selectedBusiness = localStorage.getItem('selectedBusiness');
		if (selectedBusiness) {
			selectedBusiness = JSON.parse(selectedBusiness);
			idSucursal = selectedBusiness.idSucursal;
		} else {
			console.error('selectedBusiness is not defined in localStorage');
		}
	} else {
		console.error('localStorage is not available');
	}


	
	let idClientfk = currentOrder;
	

	const bodyRegister = {
		title: "Confirmación orden numero: " + currentOrder?.idOrderH,
		idUserAddFk: log,
		isEntry: 0,
		spending: 1,
		idBranchFk: idSucursal,
		idCurrencyFk: 1,
		mpCash: 0,
		mpCreditCard: 0,
		mpDebitCard: 0,
		mpTranferBack: 0,
		mpMpago: 0,
		mpRappi: 0,
		mpGlovo: 0,
		mpUber: 0,
		mpPedidosya: 0,
		mpJust: 0,
		mpWabi: 0,
		mpOtro2: 0,
		mpPedidosyacash: 0,
		mpPersonal: 0,
		mpRapicash: 0,
		mpPresent: 0,
		mpPaypal: 0,
		mpZelle: 0,
		mpBofa: 0,
		mpYumi: 0,
		idBoxFk: 1,
		isCloseBox: false,
	};

	const bodyRegisterAnul = {
		title: "Anulacion orden numero: " + currentOrder?.idOrderH,
		amount:0,
		idUserAddFk:log,
		isEntry: 0,
		spending: 0,
		idBranchFk: idSucursal,
		idCurrencyFk: 1,
		mpCash: 0,
		mpCreditCard: 0,
		mpDebitCard: 0,
		mpTranferBack: 0,
		mpMpago: 0,
		mpRappi: 0,
		mpGlovo: 0,
		mpUber: 0,
		mpPedidosya: 0,
		mpJust: 0,
		mpWabi: 0,
		mpOtro2: 0,
		mpPedidosyacash: 0,
		mpPersonal: 0,
		mpRapicash: 0,
		mpPresent: 0,
		mpPaypal: 0,
		mpZelle: 0,
		mpBofa: 0,
		mpYumi: 0,
		idBoxFk: 1,
		isCloseBox: false,
	};

	const mpObjects = Object.keys(attributes)
		.map((key) => ({
			name: attributes[key],
			monto: currentOrder && currentOrder[key] ? currentOrder[key] : 0,
		}))
		.filter((obj) => obj.monto > 0);
	Object.keys(attributes).forEach((key) => {
		if (bodyRegister.hasOwnProperty(key) && currentOrder && currentOrder[key]) {
			bodyRegister[key] = currentOrder[key];
		}

		//console.log('pase por aca')
	});
/*
	const mpObjects2 = Object.keys(attributes)
	.map((key) => ({
		name: attributes[key],
		monto: currentOrder && currentOrder[key] ? currentOrder[key]*-1 : 0,
	}))
	.filter((obj) => obj.monto !== 0);
	Object.keys(attributes).forEach((key) => {
	if (bodyRegisterAnul.hasOwnProperty(key) && currentOrder && currentOrder[key]) {
		if (key.startsWith('mp') && currentOrder[key] != 0) {
            const hola= bodyRegisterAnul[key] = currentOrder[key] * -1;
        } else {
            bodyRegisterAnul[key] = currentOrder[key];
        }
	}
	//console.log('pase por aca2')

});*/

	//console.log(bodyRegister);
	
	useEffect(()=>{


		
		//console.log(mpObjects.length)
	},[bodyRegister])

	const captureElement = async (elementId) => {
		const element = document.getElementById(elementId);
		if (element) {
			/*const img = document.createElement('img');
			img.src = '/Images/LOGO.png';
			img.style.maxWidth = '150px';
			img.style.maxHeight = '150px';
			element.insertBefore(img, element.firstChild);*/
			const canvas = await html2canvas(element);
			const imgData = canvas.toDataURL('image/png');
			const link = document.createElement('a');
			link.href = imgData;
			link.download = 'image.png';
			link.click();

			element.removeChild(img);
		} else {
			console.error(`Element with id "${elementId}" not found`);
		}
	};

/*
	
	const handleAnul = async () => {
		//console.log(bodyRegister);
		//console.log(bodyRegisterAnul);
		Object.keys(attributes).forEach(async (key) => {
			if (bodyRegisterAnul.hasOwnProperty(key) && currentOrder && currentOrder[key]) {
				if (key.startsWith('mp') && currentOrder[key] != 0) {
					bodyRegisterAnul[key] = currentOrder[key] * -1;
					bodyRegisterAnul['amount'] = currentOrder[key]* -1;
					bodyRegisterAnul['title'] = `Anulacion -${attributes[key]}-Orden: ${currentOrder.idOrderH}`;

					await requestHandler.post('/api/v2/tracking/add', bodyRegisterAnul);
				} else {
					bodyRegisterAnul[key] = currentOrder[key];
				}if (bodyRegisterAnul[key] != 0) {
					//console.log(bodyRegisterAnul)					
				}
			}
		});

		message.success('realizado con exito')
	}*/

	const handleChangeStatus = async (status) => {
		setLoading(true);
		try {
			await changeStatus(status, id);
			message.success('Pedido actualizado');
			if (status === 'Anulado') {
				const res2 = await requestHandler.get('/api/v2/order/reverse/masive/' + id);
				//console.log(res2);
				message.success('Pedido actualizado2');
			}
		} catch (error) {
			message.error('Error al actualizar pedido');
		} finally {
			setLoading(false);
		}
	};

	const handleOrder = () => {
		setLoading(true);
		router.push(`/dashboard/orders/update/${id}`);
	};
	const handleInputChange = (e) => {
		setModel(e.target.value);
	};

	const handleInputChange2 = (e) => {
		setModel2(e.target.value);
	};

	const actualizaciónFactura = (idOrderH) => {

		const regex = /^[0-9]+$/;
		if (regex.test(model)) {
		  // inputValue is valid
		  try {const res = requestHandler.put(`/api/v2/order/update/seniat/${id}`, { factura: model });
		//console.log(res);
		message.success('Factura actualizada');
	
		}catch (error){//console.log(error);

		}finally{
			setTimeout(()=>{
				getOrderRequest(id);
				setOpenModal2(false)
			},1000)
		}
		
		} else {
		  // inputValue is invalid
		  message.error('solo se permiten numeros')
		}

		//console.log(idOrderH);
		
	};


	useEffect(() => {
		setLoading(true);
		if (Object.keys(generalContext).length && id) {
			getOrderRequest(id);
		}
	}, [generalContext, id]);



	useEffect(() => {
		//console.log(currentOrder)
		//console.log(currentOrder?.numbernotecredit )
		//console.log(currentOrder?.facturaAfip )
		//console.log(currentOrder?.imageBank1 )
			}, [currentOrder]);
		


	if (loading || !currentOrder) {
		return (
			<DashboardLayout>
				<Loading isLoading={loading} />
			</DashboardLayout>
		);
	}




	const handleConfirm = async () => {
		//console.log(bodyRegister);
		const res = await requestHandler.post('/api/v2/tracking/add', bodyRegister);
		setLoading(true)
		try {
			message.success('Confirmación exitosa!')
		}catch {
			message.error('Error al confirmar los pagos')
		}
		finally{
			setLoading(false)
		}
		//console.log(res);
	}



	const openTrucks = () => {
		setOpenModal2(true);
	};
	const closeModals = () => {
		setOpenModal2(false);
	};

	const closeModals2 = () => {
		setOpenModal3(false);
	};


	const handleButtonClick = () => {
		router.push(`/dashboard/orders/update/${id}`);
	};

	const handleEditNote = () => {
		setOpenModal3(true);
	};




	/*POST 

{
numbernotecredit,
idOrderH
}

/order/set/numbernotecredit */

	const actualizaciónNota = (idOrderH) => {
		//console.log(idOrderH);

		const regex = /^[0-9]+$/;
		if (regex.test(idOrderH)) {
			try {
				const res = requestHandler.post(`/api/v2/order/set/numbernotecredit`,{
					numbernotecredit:idOrderH,
					idOrderH:id,
				} );
				if(res.status===200){
					//window.location.reload();
					//console.log(res.status==200);
				}
				//console.log(res);
				message.success('Nota de credito creada');
				
	
			}catch (error){//console.log(error);
				message.error('Error en la creacion');
			}finally{
				setTimeout(function(){
					location.reload();
				 }, 3000);
	
			}
		} else {
			// inputValue is invalid
			message.error('solo se permiten numeros')
		  }
  
		

		
	
	};


	const commonData = {
		'Numero del pedido': currentOrder.numberOrden,
		Vendedor: user?.fullname,
		Estado: orderStatusToUse[currentOrder.idStatusOrder].state,
		Cliente: currentOrder.fullNameClient,
		Contacto: currentOrder.phoneClient,
		Dirección: currentOrder.address,
		'Fecha de creacion': new Date(
			currentOrder.fechaEntrega
		).toLocaleDateString(),
		'Observacion (opcional):': currentOrder.comments,
	};
	const ExcelExport = [commonData];

	(currentOrder?.body || []).forEach((item, index) => {
		const productData = {
			'Nombre del pruducto': item.nameProduct,
			Código: item.barCode,
			Precio: item.priceSale,
			Cantidad: item.weight,
			'Sub Total': item.weight * item.priceSale,
			Total: currentOrder?.totalBot,
		};
		ExcelExport.push(productData);
	});


	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
			>
				<div style={{ display: 'flex', width: '90%' }}>
					<Title
						title="Detalle de la orden"
						path="/dashboard/orders"
						goBack={1}
					/>
					<div style={{ display: 'flex' }}>
						<Button
							htmlType="submit"
							type="success"
							onClick={() => captureElement('factura')}
							block
							style={{ width: '100%' }}
						>
							<ExportOutlined /> Imprimir recibo
						</Button>
					</div>
					<div style={{ display: 'flex', marginLeft: '10px' }}>
						<Button
							htmlType="submit"
							type="success"
							onClick={() => openTrucks()}
							block
							disabled={currentOrder?.facturaAfip}
							style={{ width: '100%' }}
						>
							Agregar factura
						</Button>
					</div>
					<div style={{ display: 'flex', width: '12%', marginLeft: '10px' }}>
						<Button
							htmlType="submit"
							type="success"
							block
							disabled={
								orderStatusToUse[currentOrder.idStatusOrder].state ==
								'Cobrado' ||
								orderStatusToUse[currentOrder.idStatusOrder].state ==
								'Despachado' ||
								orderStatusToUse[currentOrder.idStatusOrder].state ==
								'Anulado' ||
								orderStatusToUse[currentOrder.idStatusOrder].state == 'Pagado'
							}
							onClick={handleButtonClick}
						>
							Pagar
						</Button>
					</div>
					<div style={{ display: 'flex', width: 'fit-content', marginLeft: '10px' }}>
						<Button
							htmlType="submit"
							type="success"
							block
							disabled={!currentOrder?.facturaAfip ||  currentOrder?.numbernotecredit!==null}
							onClick={handleEditNote}
						>
							Agregar Nota de Credito
						</Button>
					</div>
				</div>
				<div
					id="factura"
					style={{
						width: '96%',
					}}
				>
					<List
						style={{
							width: '100%',
							padding: '10px 30px',
							backgroundColor: 'white',
							marginBottom: '25px',
							borderRadius: '15px',
							boxShadow: '4px 4px 8px rgba(207, 207, 207, 0.479)',
						}}
					>
						<ChangeOrderStatus
							status={currentOrder.idStatusOrder}
							handleOrder={handleOrder}
							orderId={id}
							handleChangeStatus={handleChangeStatus}
							attributes={attributes}
							currentOrder={currentOrder}
							bodyRegisterAnul={bodyRegisterAnul}
						/>

						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Número de Orden:</p>
							<p>{currentOrder.numberOrden}</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Vendedor:</p>
							<p>{user?.fullname}</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Estado:</p>
							<p style={{ color: `${getStatus()}`, fontWeight: 'bold' }}>
								{orderStatusToUse[currentOrder.idStatusOrder].state}
							</p>
						</List.Item>
						<List.Item>
							<p></p>
							<p style={{ fontWeight: 'bold', color: 'red' }}>
								{currentOrder.isacountCourrient === 1 ? 'Orden a crédito' : ''}
							</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Cliente:</p>
							<p>{currentOrder.fullNameClient}</p>
						</List.Item>

						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Contacto:</p>
							<p>{currentOrder.phoneClient}</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Dirección:</p>
							<p>{currentOrder.address}</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Fecha de creación:</p>
							<p>{new Date(currentOrder.fechaEntrega).toLocaleDateString()}</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Número de factura:</p>
							<p>{currentOrder.facturaAfip}</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Nota de credito:</p>
							<p>{currentOrder?.numbernotecredit}</p>
						</List.Item>
						
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Comprobante de pago:</p>
							{<div className='flex w-100 gap-1'>
							{currentOrder?.imageBank1 ? <img src={(`${apiImg}/bank/${currentOrder?.imageBank1}`)} className='w-16 rounded-md h-12 cursor-pointer' onClick={() => getFoto(true,`${apiImg}/bank/${currentOrder?.imageBank1}`)} /> : null}
							{currentOrder?.imageBank2 ? <img src={(`${apiImg}/bank/${currentOrder?.imageBank2}`)} className='w-16 rounded-md h-12 cursor-pointer' onClick={() => getFoto(true,`${apiImg}/bank/${currentOrder?.imageBank2}`)} /> : null}
							{currentOrder?.imageBank3 ? <img src={(`${apiImg}/bank/${currentOrder?.imageBank3}`)} className='w-16 rounded-md h-12 cursor-pointer' onClick={() => getFoto(true,`${apiImg}/bank/${currentOrder?.imageBank3}`)} /> : null}
							{currentOrder?.imageBank4 ? <img src={(`${apiImg}/bank/${currentOrder?.imageBank4}`)} className='w-16 rounded-md h-12 cursor-pointer' onClick={() => getFoto(true,`${apiImg}/bank/${currentOrder?.imageBank4}`)} /> : null}
							{currentOrder?.imageBank5 ? <img src={(`${apiImg}/bank/${currentOrder?.imageBank5}`)} className='w-16 rounded-md h-12 cursor-pointer' onClick={() => getFoto(true,`${apiImg}/bank/${currentOrder?.imageBank5}`)} /> : null}
							{currentOrder?.imageBank5 ? <img src={(`${apiImg}/bank/${currentOrder?.imageBank6}`)} className='w-16 rounded-md h-12 cursor-pointer' onClick={() => getFoto(true,`${apiImg}/bank/${currentOrder?.imageBank6}`)} /> : null}
							</div>
							}
						</List.Item>

						<List.Item>
							<p style={{ fontWeight: 'bold', width: '100%' }}>
								Observación (opcional):
							</p>
							<p style={{}}>{currentOrder.comments}</p>
						</List.Item>
					</List>
					<DetailOrderTable
						products={currentOrder?.body}
						total={currentOrder.totalBot}
					/>
					<Table
						title={() => (
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
									<Typography
										style={{
											fontSize: '2rem',
											fontWeight: 'bold',
										}}
									>
										Métodos de pago
									</Typography>
								</div>
								<Button type="success" onClick={handleConfirm}>
									Confirmar Pago
								</Button>
							</div>
						)}
						style={{ width: '100%' }}
						bordered
						columns={defaultColumns2}
						dataSource={mpObjects}
					/>
				</div>
			</div>
			<Modal open={openModal2} onCancel={closeModals} footer={false}>
				<div className="flex flex-col justify-between h-full gap-5">
					<h1>Agregar factura</h1>
					<Form layout="vertical">
						<Form.Item label="Número de factura" name="model">
							<Input type='number' pattern="/^[0-9]+$/" onChange={handleInputChange} />
						</Form.Item>
					</Form>
					<div className="flex justify-end gap-5">
						<Button className="bg-blue-500" type="primary" onClick={() => actualizaciónFactura(model)}>
							Guardar
						</Button>
					</div>
				</div>
			</Modal>

			<Modal open={openModal3} onCancel={closeModals2} footer={false}>
				<div className="flex flex-col justify-between h-full gap-5">
					<h1>Agregar Nota de credito</h1>
					<Form layout="vertical">
						<Form.Item label="Nota de credito" name="model2">
							<Input onChange={handleInputChange2} />
						</Form.Item>
					</Form>
					<div className="flex justify-end gap-5">
						<Button className="bg-blue-500" type="primary" onClick={() => actualizaciónNota(model2)}>
							Guardar
						</Button>
					</div>
				</div>
			</Modal>

			<Modal
				open={modalIsOpen}
				footer={false}
				onCancel={() => setModalIsOpen(false)}
				width={860}
				className='flex justify-center'
			>
				<img src={sourceImage} className='w-[760px] h-[500px] mt-6'/>
			</Modal>
			
		</DashboardLayout>
	);
};

//Efectivo $,euro,zelle,bancos internacionales

export default OrderDetail;
