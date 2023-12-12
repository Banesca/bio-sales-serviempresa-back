import { useState, useContext, useEffect } from 'react';
import {
	DeleteOutlined,
	ExclamationCircleFilled,
	UploadOutlined,
	DownloadOutlined,
} from '@ant-design/icons';
import {
	Upload,
	Button,
	Table,
	message,
	Row,
	Col,
	Modal,
	ConfigProvider,
} from 'antd';
import * as XLSX from 'xlsx';
import DashboardLayout from '../../../components/shared/layout';
import { addKeys, removeKeys } from '../../../util/setKeys';
import Loading from '../../../components/shared/loading';
import { GeneralContext } from '../../_app';
import { useRequest } from '../../../hooks/useRequest';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import { notification } from 'antd';
import Title from '../../../components/shared/title';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';
import { useProductFilter } from '../../../components/products/useProductFilter';
import { useProducts } from '../../../components/products/hooks/useProducts';
const ImportStock = () => {
	const generalContext = useContext(GeneralContext);
	const { selectedBusiness } = useBusinessProvider();
	const { requestHandler } = useRequest();
	const [currentProduct, setCurrentProduct] = useState();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [fileList, setFileList] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [rejectedBrands, setRejectedBrands] = useState([]);
	const [rejectedCategories, setRejectedCategories] = useState([]);
	const [api, contextHolder] = notification.useNotification();
	const { clean, filtered, setProduct, setQuery } = useProductFilter();

	const { getProducts, deleteProduct, products } = useProducts();

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
			title: 'Stock',
			dataIndex: 'stock',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Cantidad',
			dataIndex: 'quantity',
			key: 1,
			render: (text) => <p>{text}</p>,
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

	useEffect(() => {
		if (selectedBusiness && generalContext) {
			setLoading(true);
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
				priceSale: row?.PRECIO_TIENDA,
				nameFamily: row?.Categoría || 'No especificada',
				nameSubFamily: row?.SubCategoría || 'No especificada',
				nameProduct: row?.Nombre_de_producto,
				barCode: row?.Codigo_de_barra,
				quantity: row?.Cantidad,
				efectivo: row?.Codigo_interno,
				wareHouse: row?.Almacen,
				idInventaryB: 1,
				key: '',
				stock: row?.Stock_Actual,
				idProduct: row?.Nro,
				idSucursalFk: selectedBusiness?.idSucursal,
				apply_inventory: true,
				idStatusFk: 1,
				idUnidadMedida: row?.Unidad_de_medida,
				idRestaurantFk: 1,
				minStock: 0,
			};
			uploadData.push(obj);
		}
		return uploadData;
	};

	useEffect(() => {
		let list = products;
		addKeys(list);
		setProduct(list);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [products]);

	const getProductsRequest = async (businessId) => {
		setLoading(true);
		try {
			await getProducts(businessId);
		} catch (error) {
			message.error('Error al cargar productos');
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		setLoading(true);
		if (
			Object.keys(generalContext).length > 0 &&
			Object.keys(selectedBusiness).length > 0
		) {
			getProductsRequest(selectedBusiness.idSucursal);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness]);

	const exportToExcel = () => {
		const productos = [];

		for (let product of products) {
			const body = {
				Nro: product.idProduct,
				Nombre_de_producto: product.nameProduct,
				Codigo_de_barra: product.barCode,
				Codigo_interno: product.efectivo,
				Stock_Actual: product.minStock,
				Cantidad: '',
			};
			productos.push(body);
		}
		const worksheet = XLSX.utils.json_to_sheet(productos);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(
			workbook,
			worksheet,
			'Productos para inventariar'
		);
		XLSX.writeFile(workbook, 'Inventario.xlsx');
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
			addKeys(uploadData);
			setData(uploadData);
			uploadData;
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
		const productos = [];
		for (let product of formatData) {
			const body = {
				idProduct: product.idProduct,
				quanity: product.quantity,
				reference: 'Carga masiva',
				isSum: 1,
			};
			productos.push(body);
		}
		const res = await requestHandler.post(
			'/api/v2/inventary/masive/adjustment',
			{
				data: productos,
			}
		);
		if (res.isLeft()) {
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
						<Col>
							<Button
								onClick={exportToExcel}
								icon={<DownloadOutlined />}
								block
								style={{ marginLeft: '1rem' }}
							>
								Descargar Plantilla
							</Button>
						</Col>
					</Row>
					<ConfigProvider
						renderEmpty={data.length !== 0 ? CustomizeRenderEmpty : ''}
					>
						<Table columns={columns} dataSource={data} />
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
						// eslint-disable-next-line react/jsx-key
						<div className="flex justify-end">
							<Button
								onClick={() => setNotificationOpen(false)}
								key="confirmar"
								type="primary"
							>
								Confirmar
							</Button>
						</div>,
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

export default ImportStock;
