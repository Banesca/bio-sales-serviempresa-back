import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState, useRef } from 'react';
import {
	Col,
	Row,
	message,
	Typography,
	Button,
	Form,
	Select,
	Card,
	Table,
	Input,
} from 'antd';
import DashboardLayout from '../../../../components/shared/layout';
import { GeneralContext } from '../../../_app';
import { useRequest } from '../../../../hooks/useRequest';
import ProductFilter from '../../../../components/products/productFilter';
import { useBusinessProvider } from '../../../../hooks/useBusinessProvider';
import { addKeys } from '../../../../util/setKeys';
import { Modal } from 'antd';
import { useProductFilter } from '../../../../components/products/useProductFilter';
import { List } from 'antd';
import ProductList from '../../../../components/orders/update/productList';
import ProductsInOrder from '../../../../components/orders/update/productsInOrder';
import { useOrders } from '../../../../components/orders/hooks/useOrders';
import { useLoadingContext } from '../../../../hooks/useLoadingProvider';
import { useProducts } from '../../../../components/products/hooks/useProducts';
import { useCategoryContext } from '../../../../hooks/useCategoriesProvider';
import { useBrandContext } from '../../../../hooks/useBrandsProvider';
import { statusNames } from '../../../../components/orders/detail/changeStatus';
import { useTdc } from '../../../../components/tdc/useTdc';
import {
	CalculatorOutlined,
	LeftOutlined,
	PauseOutlined,
	CloseOutlined,
	DeleteOutlined,
	PrinterOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';

export const UNIT_TYPE = {
	UNIT: 17,
	KG: 3,
};

const UpdateOrderPage = () => {
	const router = useRouter();
	const { id } = router.query;

	const { filtered, clean, setProduct, setQuery } = useProductFilter();
	const { products, getProducts } = useProducts();
	const {
		currentOrder,
		getOrderById,
		changeStatus,
		setProductsQuantity,
		confirmProductQuantity,
	} = useOrders();
	const {
		categories,
		subCategories,
		lines,
		getCategories,
		getSubCategories,
		getLines,
	} = useCategoryContext();
	const { brands, getBrands } = useBrandContext();
	const { loading, setLoading } = useLoadingContext();
	const [Payment, setPayment] = useState();
	const [PaymentAdd2, setPaymentAdd2] = useState(null);
	const [PaymentAdd, setPaymentToAdd] = useState([]);
	const [PaymentTipe, setPaymentTipe] = useState();
	const [PaymentAddTipe, setPaymentToAddTipe] = useState([]);
	const generalContext = useContext(GeneralContext);
	const { requestHandler } = useRequest();
	const { selectedBusiness } = useBusinessProvider();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [currentProduct, setCurrentProduct] = useState();
	const [total, setTotal] = useState(0);
	const [amountIgtf, setAmountIgtf] = useState(0);
	const [IGTFS, setIGTFS] = useState(false);
	const [closeOrderModal, setIsCloseOrderModal] = useState(false);
	const [cancelOrderModal, setIsCancelOrderModal] = useState(false);
	const [calculadora, setIsCalculadora] = useState(false);
	const [pauseOrderModal, setIsPauseOrderModal] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	const [wallet3, setWallet3] = useState([]);
	const [count, setCount] = useState(1);
	const [isIgtf, setIsIgtf] = useState(false);
	const [newTotal, setNewTotal] = useState(0);
	const [totalDeclarado, setTotalDecla] = useState(0);
	const [client, setClient] = useState({});
	const [clients, setClients] = useState({});
	const [debts, setDebts] = useState(0);
	const [amountlimit, setAmountlimit] = useState(0);
	const [stopCredit, setStopCredit] = useState(false);
	const EditableContext = React.createContext(null);
	const { actualTdc, updateTdc } = useTdc();
	const [inputValue, setInputValue] = useState('');
	const [result, setResult] = useState(0);
	const getOrderRequest = async (id) => {
		setLoading(true);
		try {
			await getOrderById(id);
		} catch (error) {
			message.error('Error al cargar orden');
		} finally {
			setLoading(false);
		}
	};

	const getCategoriesRequest = async (id) => {
		setLoading(true);
		try {
			await getCategories(id);
			await getSubCategories(id);
			await getLines(id);
		} catch (error) {
			message.error('Error al cargar categorías');
		} finally {
			setLoading(false);
		}
	};

	const getPayments = async () => {
		const res = await requestHandler.get('/api/v2/utils/typepayment');
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		setPayment(res.value.getValue().response);
		console.log(Payment);
	};

	const getBrandsRequest = async (id) => {
		setLoading(true);
		try {
			await getBrands(id);
		} catch (error) {
			message.error('Error al cargar marcas');
		} finally {
			setLoading(false);
		}
	};

	const handleListProductRequest = async (id) => {
		setLoading(true);
		try {
			await getProducts(id);
		} catch (error) {
			message.error('Error al cargar productos');
		} finally {
			setLoading(false);
		}
	};

	const getPaymentTipe = async () => {
		const res = await requestHandler.get('/api/v2/paymentcondition/list');
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		setPaymentTipe(res.value.getValue().response);
	};

	useEffect(() => {
		if (products) {
			addKeys(products);
			setProduct(products);
			getPayments();
			getPaymentTipe();
		}
	}, [products]);

	const calculateTotalRequest = async () => {
		const res = await requestHandler.get(`/api/v2/order/calculate/total/${id}`);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue();
		setTotal(value.message[0].TOTAL);
		console.log(value)
		console.log(id)
	};

	useEffect(() => {
		if (
			Object.keys(generalContext).length &&
			Object.keys(selectedBusiness).length
		) {
			getOrderRequest(id);

			getBrandsRequest(selectedBusiness.idSucursal);
			getCategoriesRequest(selectedBusiness.idSucursal);
			handleListProductRequest(selectedBusiness.idSucursal);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, id, selectedBusiness]);

	const handleRemoveProduct = async (record) => {
		if (!record) return;

		setLoading(true);
		
		const idUser = localStorage.getItem('userId');
		const res = await requestHandler.delete(
			`/api/v2/order/product/delete/${record.idOrderB}/${idUser}`
		);
		if (res.isLeft()) {
			return message.error('Ha ocurrido un error');
		}
		await getOrderRequest(id);
		setLoading(false);
		setDeleteOpen(false);
		message.success('Producto removido');
	};

	const openDeleteModal = (product) => {
		setCurrentProduct(product);
		setDeleteOpen(true);
	};

	const getClientsRequest = async () => {
		setLoading(true);
		const res = await requestHandler.get('/api/v2/client/list');
		if (res.isLeft()) {
			setLoading(false);
			return;
		}
		let clientsList = res.value.getValue().response;
		clientsList = clientsList.filter((b) => b.idStatusFk !== '3');
		console.log(clientsList);
		clientsList = clientsList.find((c) => c.phone ===currentOrder?.phoneClient)
		console.log(clientsList);
		setClients(clientsList);
		setLoading(false);
	};

	const handleAdd = (selectOption) => {
	
		setPaymentToAdd();
		setPaymentAdd2(selectOption)

		let newData = {
			key: count,
			name: selectOption,
			monto: 0,
			igtf:false
		};
		console.log(newData)
		setDataSource([...dataSource, newData]);
		setCount(count + 1);
		setPaymentAdd2(null)

	};

	const EditableRow = ({ index, ...props }) => {
		const [form] = Form.useForm();
		return (
			<Form form={form} component={false}>
				<EditableContext.Provider value={form} type='number'>
					<tr {...props}  />
				</EditableContext.Provider>
			</Form>
		);
	};

	const EditableCell = ({
		title,
		editable,
		children,
		dataIndex,
		record,
		handleSave,
		...restProps
	}) => {
		const [editing, setEditing] = useState(false);
		const inputRef = useRef(null);
		const form = useContext(EditableContext);
		useEffect(() => {
			if (editing) {
				inputRef.current.focus();
			}
		}, [editing]);
		const toggleEdit = () => {
			setEditing(!editing);
			form.setFieldsValue({
				[dataIndex]: record[dataIndex],
			});
		};
		const save = async () => {
			try {
				let values = await form.validateFields();

				if (dataIndex === 'monto' && (values.monto === '' || values.monto === null)) {
					values.monto = '0';
				}

				toggleEdit();
				handleSave({
					...record,
					...values,
				});
			} catch (errInfo) {
				console.log('Save failed:', errInfo);
			}
		};
		let childNode = children;
		if (editable) {
			childNode = editing ? (
				<Form.Item
					style={{
						margin: 0,
					}}
					name={dataIndex}
				>
					<Input ref={inputRef} onPressEnter={save} onBlur={save} type='number' min={0} pattern='/^\d*\.?\d*$/' placeholder='hola'/>
				</Form.Item>
			) : (
				<div
					className="editable-cell-value-wrap"
					style={{
						paddingRight: 24,
					}}
					onClick={toggleEdit}
				>
					{children}
				</div>
			);
		}

		return <td {...restProps}>{childNode}</td>;
	};

	const handleSave = (row) => {
		const newData = [...dataSource];
		const index = newData.findIndex((item) => row.key === item.key);
		const item = newData[index];

		
		newData.splice(index, 1, {
			...item,
			...row,
		});

		const calcularSumaTotal = () => {
			let suma = 0;
			newData.forEach((objeto) => {
				suma += Number(objeto.monto);
				console.log(suma);
				if(!IGTFS && objeto.name==='Efectivo'){
					setIGTFS(true)  
					setAmountIgtf(amountIgtf+(objeto.monto*0.03))
				}

			});

			return suma;
		};


		const sumaTotal = calcularSumaTotal();
		console.log(total)
		const TotalInt=parseFloat(total)
		console.log(amountIgtf)
		let result = TotalInt + amountIgtf - sumaTotal;
		result = parseFloat(result);
		console.log(result);
		if (result < 0) {
			alert('El resultado no puede ser menor que 0');
		} else {
			setDataSource(newData);
			setTotalDecla(sumaTotal.toFixed(3));
			setNewTotal(result.toFixed(3));
		}
	};

useEffect(()=>{

	const results=dataSource.filter(e=>e.name ==='Efectivo')
	if(dataSource.length> 0 && results?.length===1){
		let result=parseFloat(newTotal)+amountIgtf
		setNewTotal(result.toFixed(3));
	}else if(IGTFS && results?.length===0){
		console.log(amountIgtf)
		setNewTotal(newTotal-amountIgtf);
		setTotal(total)
	}
	console.log(amountIgtf)
},[IGTFS])


	const handleDelete = (key) => {
		const newData = dataSource.filter((item) => item.key !== key);
		let igtf=dataSource.filter((item) => item.name === 'Efectivo');
		let min=igtf.length > 0 ? igtf?.reduce((claveMasBaja, claveActual) =>{return claveActual < claveMasBaja ? claveActual : claveMasBaja;}) : []
		
		if(key===min.key && min.name==='Efectivo' ){
			igtf=newData.filter((item) => item.name === 'Efectivo');
			console.log(igtf)
			if(igtf.length> 1){
				min=igtf?.reduce((claveMasBaja, claveActual) =>{return claveActual < claveMasBaja ? claveActual : claveMasBaja;})
				min.length < 1 ? setAmountIgtf(amountIgtf) : setAmountIgtf(min.monto*0.03)
			} else{
				setIGTFS(false) //
				setNewTotal(newTotal-amountIgtf)
				setAmountIgtf(0)
			}
			 console.log(min)
		}
		
		console.log(newData);
		console.log(min);
		console.log(igtf);
		setDataSource(newData);

		const calcularSumaTotal = () => {
			let suma = 0;
			newData.forEach((objeto) => {
				suma += Number(objeto.monto);
				console.log(suma);
				
			});
			return suma;
		};



		const TotalInt=parseFloat(total)
		
		let sumaTotal = calcularSumaTotal();
		setTotalDecla(sumaTotal);
		let result = TotalInt - sumaTotal;
		result = parseFloat(result.toFixed(3));
		setNewTotal(result);
	};



	


	const defaultColumns = [
		{
			title: 'Método de pago',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Monto a pagar',
			dataIndex: 'monto',
			key: 'monto',
			editable: true,
			render: (text, record) => (
				<>
					{text}
				</>
			),
		},
		{
			title: 'Acción',
			dataIndex: 'operation',
			render: (_, record) => (
				<>
					<div style={{ display: 'flex', gap: '8px' }}>
						{record.name === 'Bolivares' && (
							<Button
								onClick={() => handleCalculate(record.monto, record.key)}
								className="bg-blue-500"
							>
								<CalculatorOutlined />
							</Button>
						)}
						{dataSource.length >= 1 && (
							<Button
								onClick={() => handleDelete(record.key)}
								type="primary"
								danger
							>
								<DeleteOutlined />
							</Button>
						)}
					</div>
				</>
			),
		},
	];

	const columns = defaultColumns.map((col) => {
		if (!col.editable) {
			return col;
		}

		return {
			...col,
			onCell: (record) => ({
				record,
				editable: col.editable,
				dataIndex: col.dataIndex,
				title: col.title,
				handleSave,
			}),
		};
	});

	const defaultColumns2 = [
		{
			title: 'Método de pago',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Monto a pagar',
			dataIndex: 'monto',
			key: 'monto',
		},
	];

	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	};

	useEffect(()=>{
		getDebtsbyClient (currentOrder)
		console.log(clients)
	},[clients])

	 const getDebtsbyClient = async (id) => {
		setLoading(true);
		console.log(id);

		let ids= id?.idClientFk !== null ? id?.idClientFk : clients.idClient
		console.log(ids)

		try {
			const res = await requestHandler.get(
				`/api/v2/wallet/get/full/` + ids + `/1000`
			);
			console.log(res);
			if (res.isLeft()) {
				throw res.value.getErrorValue();
			}
			const value = res.value.getValue().deuda;
			console.log(res.value.getValue().deuda);
			const deuda=parseInt(value)
			setDebts(deuda);
		} catch (error) {
			message.error('Ha ocurrido un error'); 
			console.log()
		} finally {
			setLoading(false);
		}
	}; 

	useEffect(() => {
		if (currentOrder) {
			calculateTotalRequest(currentOrder.idOrderH);
			 getDebtsbyClient(currentOrder);
			console.log(currentOrder) 
			getClients(currentOrder)
			getClientsRequest()
		}
		console.log(clients)
		console.log(currentOrder?.comments) 
		console.log(localStorage.getItem('selectedBusiness')) 
	}, []);

	const handleNewWallet = () => {
		
		const walletBody = {
		  title: `Deuda orden: #${currentOrder?.idOrderH}`,
		  amount: total,
		  nameclient: currentOrder?.fullNameClient,
		  idUserAddFk: Number(localStorage.getItem("idUser")),
		  isEntry: 0,
		  idClientFk: currentOrder?.idClientFk!== null ? currentOrder?.idClientFk : clients.idClient ,
		  idBranchFk: selectedBusiness?.idSucursal,
		  idCurrencyFk: 99,
		  idPaymentMethodFk: null,
		  idOrder: currentOrder?.idOrderH,
		};
	
		setWallet3(walletBody)
	}
	useEffect(() => {
		if (currentOrder) {
			calculateTotalRequest(currentOrder.idOrderH);
			 getDebtsbyClient(currentOrder);
			console.log(currentOrder) 
			getClients(currentOrder)
			getClientsRequest()
		}
		console.log(clients)
		console.log(currentOrder) 
	}, [currentOrder]);

	useEffect(() => {
		handleNewWallet()
	}, [currentOrder]);

	useEffect(() => {
		handleNewWallet()
		console.log(wallet3)
		console.log(selectedBusiness)
	}, [clients]);

	const addWallet = async ()=>{
		const res=await requestHandler.post(`/api/v2/wallet/add`,wallet3) 
		if (res.isLeft()) {
			message.error('no se pudo actualizar la wallet')
			throw res.value.getErrorValue();
		}
	}

	const handleReceiveOrder = async () => {
		let id = String(currentOrder.idOrderH);
		console.log(currentOrder)
		console.log(PaymentAddTipe)
		console.log(id);
		setLoading(true);
		if (PaymentAddTipe === 1) {
			const res2 = await requestHandler.post(
				'/api/v2/order/update/currentacount/' + id,
				{ isacountCourrient: true },
			);
			
			
			try{
				await addWallet()
				message.success('Orden actualizada')
			}catch{
				message.error('no se pudo actualizar la orden22')
			}finally{
				router.push(`/dashboard/orders/${id}`);
			}

		} else{

	
		try {
			const mpCash = await validateMP('Efectivo');
			
				let data = [];

				const res = await requestHandler.put(
					'/api/v2/order/close/' + id,
					(data = {
						comments: 'PAGO',
						mpCash: await validateMP('Efectivo'),
						mpCreditCard: await validateMP('Credito'),
						mpDebitCard: await validateMP('Debito'),
						mpTranferBack: await validateMP('Transferencia'),
						totalBot: total+amountIgtf,
						mpMpago: await validateMP('Mpago'),
						idCurrencyFk: 1,
						listPaymentMethod: 0,
						isAfip: 0,
						mpRappi: await validateMP('Rappi'),
						mpGlovo: await validateMP('Glovo'),
						mpUber: await validateMP('Uber'),
						mpPedidosya: await validateMP('Pedidosya'),
						mpJust: await validateMP('Just Eat'),
						mpWabi: await validateMP('Wabi'),
						mpOtro2: await validateMP('Otro2'),
						mpPedidosyacash: await validateMP('Pedidos Ya Efectivo'),
						mpPersonal: await validateMP('Personal'),
						mpRapicash: await validateMP('Rapicash'),
						mpPresent: await validateMP('Present'),
						mpPaypal: await validateMP('Paypal'),
						mpZelle: await validateMP('Zelle'),
						mpBofa: await validateMP('Bofa'),
						mpYumi: await validateMP('Yumi'),
						waste: totalDeclarado,
						isPrintBillin: newTotal,
						tasa: actualTdc,
						puntoVtaAfit: '',
						comprobanteAfit: '',
						isacountCourrient: currentOrder?.isacountCourrient,
					})
				);
	
				if (newTotal === 0 && PaymentAddTipe !==1) {
					const res2 = await requestHandler.post(
						'/api/v2/order/update/currentacount/' + id,
						{ isacountCourrient: false },
					);
					console.log(res);
					console.log('aqui entre');
					router.push(`/dashboard/orders/${id}`);
				}			else	if (newTotal - totalDeclarado !== 0) {
					message.error('la suma de las formas de pago es diferente a 0')
				}
	

			}

			
		catch (error) {
			message.error('Error al recibir orden');
		} finally {
			setLoading(false);
		}	}
	};

	const validateMP = async (descriptPayMent) => {
		let result;
		result = dataSource.filter((event) => event.name === descriptPayMent);
		console.log(result);
		console.log(descriptPayMent);
		if (result.length !== 0) {
			if (descriptPayMent === 'Efectivo') {
				result = result.length > 0 ? result[0].monto : 0;
				
				if (isIgtf) {
					result += result * 0.03;
					console.log(result);
					message.success('tiene IGTF')
				}
			} else {
				result = result.length > 0 ? result[0].monto : 0;
			}
		} else {
			result = 0;
		}
		return result;
	};
	
	const getClients = async (id) => {
		//${currentOrder.idClient}
		const res = await requestHandler.get(`/api/v2/client/get/1`);
		
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value.getValue();
		setIsIgtf(value.data.isigtf === 'true');
		console.log(value)
		setAmountlimit(parseInt(value.data.limitcredit))
	};



	



	const handlePauseOrder = async () => {
		setLoading(true);
		try {
			await changeStatus(statusNames['Por pagar'], currentOrder.idOrderH);
			router.push('/dashboard/orders');
		} catch (error) {
			message.error('Error al pausar la orden');
		} finally {
			setLoading(false);
		}
	};

	const handleCancelOrder = async () => {
		setLoading(true);
		try {
			await changeStatus(statusNames.Anulado, currentOrder.idOrderH);
			console.log(res2);
			router.push('/dashboard/orders');
		} catch (error) {
			message.error('Error al anular la orden');
		} finally {
			setLoading(false);
		}
	};

	const calculateSubTotal = (item) => {
		let subTotal = 0;
		if (item.idUnitMeasureSaleFk == UNIT_TYPE.KG) {
			subTotal =
				item.weight *
				(item.unitweight *
					(item.isPromo == '1' ? item.marketPrice.toFixed(2) : item.priceSale.toFixed(2)));
		} else {
			subTotal =
				item.weight * (item.isPromo == '1' ? item.marketPrice.toFixed(2) : item.priceSale.toFixed(2));
		}
		return subTotal.toFixed(2);
	};

	const handleReturn = () => {
		router.push('/dashboard/orders');
		setLoading(true);
	};

	const exportToExcel = () => {
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(ExcelExport);
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		XLSX.writeFile(workbook, 'Comprobante.xlsx');
	};

	const divideVariablePorTdc = (variable) => {
		return variable / actualTdc;
	};

	const handleCalculate = (amount, recordKey) => {
		const result = divideVariablePorTdc(amount);
		console.log(result);

		// Actualiza el estado de datos
		setDataSource(dataSource.map(item =>
			item.key === recordKey ? { ...item, monto: result } : item
		));
	};

	const ExcelExport = [];

	(currentOrder?.body || []).forEach((item, index) => {
		const productData = {
			'Nombre del pruducto': item.nameProduct,
			Cantidad: item.weight,
			Precio: item.priceSale,
			'metodos de pago': dataSource.name,
			'monto a pagar': dataSource.monto,
			Total: total,
			Declarado: totalDeclarado,
			Restante: newTotal,
		};
		ExcelExport.push(productData);
	});

const ValidateAmount=()=>{
	if(PaymentAddTipe===1 && debts+total>amountlimit){
	message.error('La transaccion sobrepasa su limite de credito')
	setStopCredit(true)
	setPaymentToAddTipe([])
	} 	 else if(stopCredit && debts+total<amountlimit){
		setStopCredit(false)
	 }
}

const handleChange=(e)=>{
	console.log(e)

	 setPaymentToAddTipe(e)
	e===1 ? setDataSource([]) : null
}

useEffect(() => {
	ValidateAmount()
	console.log(PaymentTipe)
	console.log(PaymentAddTipe)
	if(PaymentAddTipe!==1 && debts+total<amountlimit){
		setStopCredit(false)
	 }
	
}, [currentOrder, PaymentAddTipe,total]);
	
	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<div>
						<Button
							style={{
								marginRight: '50%',
								height: '42px',
								borderRadius: '20px',
							}}
							onClick={handleReturn}
						>
							<LeftOutlined
								style={{ fontSize: '1.5rem', marginRight: '50%' }}
							/>
						</Button>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<h1 className="text-center font-semibold text-4xl w-[350px]">
							Agregar productos
						</h1>
						<p style={{ fontWeight: 'bold', color: 'red', fontSize: '20px' }}>
							{currentOrder?.isacountCourrient === 1 ? 'Orden a crédito' : ''}
						</p>
					</div>
					<div className="flex gap-4">
						<Button onClick={exportToExcel} className="bg-blue-500">
							<PrinterOutlined /> Imprimir comprobante
						</Button>
						<Button
							onClick={() => setIsCancelOrderModal(true)}
							type="primary"
							danger
						>
							<CloseOutlined /> Anular
						</Button>
					</div>
				</div>

				<Row className="h-screen w-full">
					<Col span={24}>
						<ProductFilter
							brands={brands}
							setQuery={setQuery}
							categories={categories}
							subCategories={subCategories}
							lines={lines}
							clean={clean}
						/>

						<Typography className="flex justify-between">
							{currentOrder?.isacountCourrient !== 1 && (
								<>
									<div className="w-[43%]">
										<ProductList
											products={filtered()}
											orderId={id}
											orderProducts={currentOrder?.body}
											getOrderRequest={getOrderRequest}
										/>
									</div>

								</>
							)}

							<div className="w-[52%] flex flex-col gap-5">
								<ProductsInOrder
									order={currentOrder}
									openDeleteModal={openDeleteModal}
									setProductsQuantity={setProductsQuantity}
									confirmProductQuantity={confirmProductQuantity}
									isCreditOrder={currentOrder?.isacountCourrient === 1}
								/>


								<Card className="rounded-2x1 shadow-lg">
									<List dataSource={currentOrder?.body}>
										<List.Item>
											<p>
												<strong>Condición de pago</strong>
											</p>

											<Select
												value={PaymentAddTipe}
												onChange={handleChange}
												style={{ width: '50%' }}
												placeholder="Ingrese condición de pago"
												disabled={!currentOrder || !currentOrder.body || currentOrder.body.length === 0}
											>
												{stopCredit ? <Select.Option
																	key={PaymentTipe[1].idPaymenConditions}
																	value={PaymentTipe[1].idPaymenConditions}
																>
																	{PaymentTipe[1].note}
																</Select.Option> :  PaymentTipe &&
													PaymentTipe.map(
														(PaymentTipe) =>
															(currentOrder?.isacountCourrient !== 1 ||
																PaymentTipe.note !== 'CREDITO' || !stopCredit) && (
																<Select.Option
																	key={PaymentTipe.idPaymenConditions}
																	value={PaymentTipe.idPaymenConditions}
																>
																	{PaymentTipe.note}
																</Select.Option>
															)
													)}
											</Select>
										</List.Item>

										<List.Item>
											<p>
												<strong>Método de pago</strong>
											</p>

											<Select
												placeholder="Ingrese métodos de pago"
												style={{ width: '50%' }}
												value={PaymentAdd2}
												onChange={handleAdd}
												disabled={!currentOrder || PaymentAddTipe===1 || !currentOrder.body || currentOrder.body.length === 0}
											>
												{Payment &&
													Payment.map((Payment) => (
														<Select.Option
															key={Payment.idPymentMethod}
															value={Payment.pymentMethod}
														>
															{Payment.pymentMethod}
														</Select.Option>
													))}
												<Select.Option value="Bolivares">Bolivares</Select.Option>
											</Select>
										</List.Item>
										<List.Item>
											<div style={{ display: 'flex', justifyContent: 'space-between' }}>
												<p>
													<strong>TOTAL:  </strong>
												</p>
												<p style={{ marginLeft: '10px' }}>${((parseFloat(total))+amountIgtf).toFixed(3)}</p>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between' }}>
												<p>
													<strong>DECLARADO:  </strong>
												</p>
												<p style={{ marginLeft: '10px', color: 'blue' }}>${totalDeclarado}</p>
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between' }}>
												<p>
													<strong>RESTANTE:  </strong>
												</p>
												<p style={{ marginLeft: '10px', color: 'red' }}>${newTotal}</p>
											</div>
											{amountIgtf>0 ? <div style={{ display: 'flex', justifyContent: 'space-between' }}>
												<p>
													<strong>IGTF:</strong>
												</p>
												<p style={{ marginLeft: '10px', color: 'red' }}>${amountIgtf}</p>
											</div> : null}
											<p> <strong>Tasa actual: </strong>{actualTdc}</p>
										</List.Item>
										<Table
											bordered
											columns={columns}
											dataSource={dataSource}
											rowClassName={() => 'editable-row'}
											components={components}
										/>
										<br></br>
										<List.Item>
											<div></div>
											<div className="flex justify-end">
												<Button
													onClick={() => setIsCloseOrderModal(true)}
													type="primary"
													className="bg-blue-500"
													disabled={!currentOrder?.body}
												>
													Enviar
												</Button>
											</div>
										</List.Item>
									</List>
								</Card>
							</div>
						</Typography>
					</Col>
				</Row>
			</div>
			<Modal
				title="Confirmación"
				open={deleteOpen}
				onCancel={() => setDeleteOpen(false)}
				onOk={handleRemoveProduct}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button key="cancel" onClick={() => setDeleteOpen(false)}>
							Cancelar
						</Button>
						<Button
							key="delete"
							danger
							type="primary"
							onClick={() => handleRemoveProduct(currentProduct)}
						>
							Eliminar
						</Button>
					</div>,
				]}
			>
				<p>
					¿Está seguro de que deseas eliminar?
					{` ${currentProduct?.nameProduct}`}
				</p>
			</Modal>
			<Modal
				title="Confirmación"
				className="send"
				open={closeOrderModal}
				onCancel={() => setIsCloseOrderModal(false)}
				onOk={() => handleReceiveOrder()}
				cancelText="Cancelar"
				okText="Enviar"
				okType="primary"
				closable="false"
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button
							key="cancel"
							danger
							onClick={() => setIsCloseOrderModal(false)}
						>
							Cancelar
						</Button>
						<Button
							key="delete"
							type="primary"
							className="bg-blue-500"
							onClick={() => handleReceiveOrder()}
						>
							Enviar
						</Button>
					</div>,
				]}
			>
				<List
					dataSource={currentOrder?.body}
					renderItem={(item) => (
						<List.Item>
							<List.Item.Meta
								title={item.nameProduct}
								description={`Cantidad: ${item.weight} | Precio: $ ${item.isPromo == 1
									? item.marketPrice.toFixed(2)
									: item.priceSale.toFixed(2)
									} ${item.idUnitMeasureSaleFk == UNIT_TYPE.KG
										? `| Peso: ${item.unitweight}KG`
										: ''
									}`}
							/>
							<p>SubTotal: $ {calculateSubTotal(item)}</p>
						</List.Item>
					)}
				>
					<List.Item
						style={{
							borderTop: '1px solid #eee',
							alignContent: 'right',
							display: 'flex ',
						}}
					>
						<div></div>
						<div style={{ display: 'flex', textAlign: 'right' }}>
							<p>
								<strong>TOTAL:</strong>
							</p>
							<p>${parseFloat(total)+amountIgtf}</p>

						</div>
					</List.Item>
	
					<List.Item style={{ display: 'flex', justifyContent: 'center' }}>
						<Table
							style={{ width: '100%' }}
							bordered
							columns={defaultColumns2}
							dataSource={dataSource}
							rowClassName={() => 'editable-row'}
							components={components}
						/>
					</List.Item>
				</List>
			</Modal>

			<Modal
				title="Confirmación"
				open={pauseOrderModal}
				onCancel={() => setIsPauseOrderModal(false)}
				onOk={handlePauseOrder}
				closable="false"
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button
							key="cancel"
							danger
							onClick={() => setIsPauseOrderModal(false)}
						>
							Cancelar
						</Button>
						<Button key="delete" type="info" onClick={handlePauseOrder}>
							Pausar
						</Button>
					</div>,
				]}
			>
				<p>
					{' '}
					¿Estás seguro que deseas pausar la orden?
					<br /> Podrás acceder previamente a la orden pausada desde el módulo
					de ordenes. <br />
				</p>
			</Modal>
			<Modal
				title="Confirmación"
				open={cancelOrderModal}
				onCancel={() => setIsCancelOrderModal(false)}
				onOk={handleCancelOrder}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button key="cancel" onClick={() => setIsCancelOrderModal(false)}>
							Cancelar
						</Button>
						<Button
							key="delete"
							danger
							type="primary"
							onClick={handleCancelOrder}
						>
							Anular
						</Button>
					</div>,
				]}
			>
				<p>¿Está seguro de que deseas anular esta orden?</p>
			</Modal>


		</DashboardLayout>
	);
};

export default UpdateOrderPage;
