import { useState, useContext, useEffect } from 'react';

import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	ExclamationCircleFilled,
	UploadOutlined,
} from '@ant-design/icons';
import { Upload, Button, Table, message, Row, Col, Modal, ConfigProvider, Empty } from 'antd';
import * as XLSX from 'xlsx';

import DashboardLayout from '../../../components/shared/layout';
import { addKeys, removeKeys } from '../../../util/setKeys';
import Loading from '../../../components/shared/loading';
import { GeneralContext } from '../../_app';
import { useRequest } from '../../../hooks/useRequest';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import { notification } from 'antd';
import Title from '../../../components/shared/title';
import { useAuthContext } from '../../../context/useUserProfileProvider';

const ImportProducts = () => {
	const columns = [
		{
			title: 'ID',
			dataIndex: 'idProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Nombre',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Código',
			dataIndex: 'barCode',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Familia',
			dataIndex: 'nameFamily',
			responsive: ['lg'],
			key: 4,
			render: (text) => <p>{text ? text : 'Indefinida'}</p>,
		},
		{
			title: 'Subfamilia',
			dataIndex: 'nameSubFamily',
			responsive: ['lg'],
			key: 6,
			render: (text) => <p>{text ? text : 'Indefinida'}</p>,
		},
		{
			title: 'Precio Compra',
			dataIndex: 'pricePurchase',
			key: 3,
			render: (text) => <p>${text}</p>
		},
		{
			title: 'Precio venta',
			dataIndex: 'priceSale',
			key: 3,
			render: (text) => <p>${text}</p>
		},
		{
			title: 'Stock mínimo',
			dataIndex: 'minStock',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Valor total',
			dataIndex: 'totalPrice',
			responsive: ['sm'],
			key: 2,
			render: (text) => <p>${text}</p>,
		},
		{
			title: 'Stock',
			dataIndex: 'stock',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Unidad de medida',
			responsive: ['xs'],
			dataIndex: 'idUnidadMedida',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			key: 8,
			render: (product, index) => (
				<Button type="primary" onClick={() => confirmDelete(product)} danger>
					<DeleteOutlined />
				</Button>
			),
		},
	];

	const confirmDelete = (product) => {
		Modal.confirm({
			title: 'Eliminar',
			icon: <ExclamationCircleFilled />,
			content: 'Estas seguro de eliminar este producto?',
			okText: 'Eliminar',
			okType: 'danger',
			cancelText: 'Cancelar',
			onOk() {
				const filteredProducts = data.filter((p) => p.key !== product.key);
				setData(filteredProducts);
			},
			onCancel() {},
		});
	};

	const handleSeeModal = (product = null) => {
		setCurrentProduct(product);
		if (!product) {
			setDeleteModalOpen(false);
		} else {
			setDeleteModalOpen(true);
		}
		setDeleteModalOpen(!deleteModalOpen);
	};

	const handleDelete = () => {
		const filteredProducts = data.filter((p) => p.code !== currentProduct.code);
		setData(filteredProducts);
		handleSeeModal();
	};

	// Title

	const generalContext = useContext(GeneralContext);
	const { selectedBusiness } = useBusinessProvider();
	const { requestHandler } = useRequest();

	// Product to delete
	const [currentProduct, setCurrentProduct] = useState();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	//Notification
	const [notificationOpen, setNotificationOpen] = useState(false);

	// control files
	const [fileList, setFileList] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);

	// Table's Data
	const [data, setData] = useState([]);

	const [loading, setLoading] = useState(false);

	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);

	const [rejectedBrands, setRejectedBrands] = useState([]);
	const [rejectedCategories, setRejectedCategories] = useState([]);

	const [api, contextHolder] = notification.useNotification();

	/* const categoryListRequest = async (business = 1) => {
		const response = await requestHandler.get(
			`/api/v2/family/list/${business}`
		);
		if (response.isLeft()) {
			return;
		}
		const value = response.value.getValue().response;
		setCategories(value);
	};

	const brandListRequest = async (business = 1) => {
		const response = await requestHandler.get(
			`/api/v2/subfamily/list/${business}`
		);
		if (response.isLeft()) {
			return;
		}
		const value = response.value.getValue().response;
		setBrands(value);
	}; */

	useEffect(() => {
		if (selectedBusiness && generalContext) {
			setLoading(true);
			/* categoryListRequest(selectedBusiness.idSucursal); */
			/* brandListRequest(selectedBusiness.idSucursal); */
			setLoading(false);
		}
	}, [selectedBusiness, generalContext]);

	const getFileExtension = (filename) => {
		return filename.split('.').pop();
	};
	
	const convertExcelDataToAPI = (rows) => {
		let uploadData = [];
		for (const row of rows) {
			const obj = {
				idUserAddFk: 1,
				idProduction: 1,
				idProductionCenter: 1,
				pricePurchase: row?.PRECIO_TIENDA,
				nameFamily: row?.Categoria || 'No especificada',
				nameSubFamily: row?.Marca || 'No especificada',
				nameProduct: row?.Nombre,
				barCode: String(row?.Codigo_de_barra_global),
				quantity: row?.Cantidad,
				efectivo: row?.REFERENCIA,
				wareHouse: row?.Almacen,
				idInventaryB: 1,
				key: '',
				stock: row?.Stock,
				totalPrice: row?.Total,
				idProductFk: row?.Id_de_producto,
				isTypeProduct: 1,
				idProduct: row?.Id_de_producto,
				key: row?.Id_de_producto,
				priceSale: row?.PRECIO_TIENDA,
				idSucursalFk: selectedBusiness?.idSucursal, /* idSucursalFk: selectedBusiness?.idSucursal */
				apply_inventory: true,
				nameKitchen: '1',
				idStatusFk: 1,
				idUnidadMedida: row?.Unidad_de_medida,
				idRestaurantFk: 1,
				minStock: 0,
			};
			uploadData.push(obj);
		}
		console.log(uploadData);
		console.log(selectedBusiness);
		return uploadData;
	};


	const handleConvertFileToJson = (files) => {
		const file = new Blob(files, { type: files[0].type });
		let reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onload = async (e) => {
			const workbox = XLSX.read(e.target.result, { type: 'buffer' });
			const worksheetName = workbox.SheetNames[0];
			const workSheet = workbox.Sheets[worksheetName];
			let data = XLSX.utils.sheet_to_json(workSheet);
			const uploadData = await convertExcelDataToAPI(data);
			// if (rejectedBrands.length > 0 || rejectedCategories.length > 0) {
			// 	setNotificationOpen(true);
			// }
			addKeys(uploadData);
			setData(uploadData);
			(uploadData);
		};
	};

	const handleChange = (info) => {
		let newFileList = [...info.fileList];
		newFileList = newFileList.slice(-1);

		if (newFileList.length === 0) {
			setFileList(newFileList[0]);
			return message.success('Archivo eliminado');
		}
		const extension = getFileExtension(newFileList[0].name);
		if (extension !== 'xlsx' && extension !== 'xls') {
			return message.error(
				'La extension del archivo debe ser ".xlsx" o ".xls"'
			);
		}

		setFileList(newFileList);
		if (newFileList[0].status == 'done') {
			setLoading(true);
			handleConvertFileToJson([selectedFile]);
			message.success(`${newFileList[0].name} ha sido cargado`);
		} else if (newFileList[0].status == 'error') {
			message.error('Ha ocurrido un error');
		}
		setLoading(false);
	};

	const props = {
		onChange: handleChange,
		beforeUpload: (file) => {
			setSelectedFile(file);
			return file;
		},
	};

	const handleSendData = async () => {
		const formatData = removeKeys(data);
		console.log(formatData);
		setLoading(true);
		const res = await requestHandler.post('/api/v2/inventary/product/add/masive', {
			data
		});
		/* const restt = await requestHandler.post('/api/v2/production/product/add', {
			data
		}); */
		console.log(res);
		/* console.log(restt);
		console.log(res); */
		/* const restt = await requestHandler.post('/api/v2/production/product/add/masive', {
			data,
		}); */
		const rest = await requestHandler.get('/api/v2/product/listint/lite/1');
		console.log(data);
		/* (rest);
		(restt);
		(res); */
		if (rest.isLeft()) {
			setLoading(false);
			return message.error('Ha ocurrido un error');
		}
		message.success('Productos agregados exitosamente');
		setData([]);
		setRejectedBrands([]);
		setRejectedCategories([]);
		setFileList([]);
		setLoading(false);
	};

	useEffect(() => {
		if (rejectedBrands.length > 0 || rejectedCategories.length > 0) {
			setNotificationOpen(true);
		}
	}, [rejectedBrands, rejectedCategories]);

	const customizeRenderEmpty = () => (
		<Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
			style={{
				textAlign: 'center',
				marginBottom: '30px'
			}}
			description={
				<span>
					Sin datos
				</span>
			}
		>
			
		</Empty>
	);

	return (
		<>
			<DashboardLayout>
				<div
					style={{
						margin: '1rem',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Title title="Importar" path="/dashboard/stock" goBack={1} />
					
					<Row style={{ margin: '1rem 0', width: '100%' }}>
						<Col>
							<Button
								disabled={!data?.length > 0}
								onClick={handleSendData}
								type="primary"
								style={{ marginRight: '1rem' }}
							>
                Cargar
							</Button>
						</Col>
						<Col>
							<Upload
								{...props}
								fileList={fileList}
								style={{ width: '100%' }}
								accept=".xls,.xlsx"
								type="file"
							>
								<Button icon={<UploadOutlined />} block>
                  Archivo
								</Button>
							</Upload>
						</Col>
					</Row>
					<ConfigProvider renderEmpty={customizeRenderEmpty}>
						<Table
							columns={columns}
							dataSource={data}
						/>
					</ConfigProvider>
				</div>
				<Modal
					title="Eliminar"
					open={deleteModalOpen}
					onCancel={() => setDeleteModalOpen(false)}
					onOk={handleDelete}
					okText="Eliminar"
					cancelText="Cancelar"
				>
					<p>Estas seguro de que deseas eliminar este producto</p>
				</Modal>
				<Modal
					title="Notificación"
					open={notificationOpen}
					footer={[
						<Button
							onClick={() => setNotificationOpen(false)}
							key="confirmar"
							type="primary"
						>
              Confirmar
						</Button>,
					]}
				>
					<p>
            Algunos productos no han sido cargados, ya que, hay categorías y/o
            marcas que no están registradas, créalas para cargar todos los
            productos.
					</p>
					{rejectedCategories && (
						<p>
              Crea las siguientes categorías{' '}
							<strong style={{ color: 'red' }}>
								{rejectedCategories.join(', ')}
							</strong>
						</p>
					)}
					{rejectedBrands && (
						<p>
              Crea las siguientes marcas{' '}
							<strong style={{ color: 'red' }}>
								{rejectedBrands.join(', ')}
							</strong>
						</p>
					)}
				</Modal>
				<Loading isLoading={loading} />
			</DashboardLayout>
		</>
	);
};

export default ImportProducts;