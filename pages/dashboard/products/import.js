import { useState, useContext, useEffect } from 'react';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	ExclamationCircleFilled,
	UploadOutlined,
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

const ImportProducts = () => {
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Código',
			dataIndex: 'barCode',
			responsive: ['sm'],
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			dataIndex: 'priceSale',
			key: 3,
			render: (text, record) => <p>$ {text}</p>,
		},
		{
			title: 'Categoría',
			dataIndex: 'nameFamily',
			responsive: ['lg'],
			key: 4,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Sub Categoría',
			dataIndex: 'nameSubFamily',
			responsive: ['xl'],
			key: 5,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Marca',
			dataIndex: 'nameBrand',
			responsive: ['lg'],
			key: 6,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Promoción',
			dataIndex: 'isPromo',
			key: 7,
			responsive: ['md'],
			render: (bool) => {
				return (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						{bool == '1' ? (
							<CheckCircleOutlined
								style={{ fontSize: '1.5rem', color: 'green' }}
							/>
						) : (
							<CloseCircleOutlined
								style={{ fontSize: '1.5rem', color: 'red' }}
							/>
						)}
					</div>
				);
			},
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
	const [code, setCode] = useState();
	const [warningModal, setWarningModal] = useState(false);

	const [rejectedBrands, setRejectedBrands] = useState([]);
	const [rejectedCategories, setRejectedCategories] = useState([]);

	const [api, contextHolder] = notification.useNotification();

	const codeListRequest = async (business) => {
		const response = await requestHandler.get(
			`/api/v2/product/list/0/0/${business}`
		);
		if (response.isLeft()) {
			return;
		}
		const value = response.value.getValue().data;
		setCode(value);
	};
	const categoryListRequest = async (business) => {
		const response = await requestHandler.get(
			`/api/v2/family/list/${business}`
		);
		if (response.isLeft()) {
			return;
		}
		const value = response.value.getValue().response;
		setCategories(value);
	};

	const brandListRequest = async (business) => {
		const response = await requestHandler.get(
			`/api/v2/subfamily/list/${business}`
		);
		if (response.isLeft()) {
			return;
		}
		const value = response.value.getValue().response;
		setBrands(value);
	};

	useEffect(() => {
		if (selectedBusiness && generalContext) {
			setLoading(true);
			categoryListRequest(selectedBusiness.idSucursal);
			codeListRequest(selectedBusiness.idSucursal);
			brandListRequest(selectedBusiness.idSucursal);
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBusiness, generalContext]);

	const getFileExtension = (filename) => {
		return filename.split('.').pop();
	};

	const convertExcelDataToAPI = (rows) => {
		let uploadData = [];
		for (const row of rows) {
			const obj = {
				nameProduct: row.nombre,
				pricePurchase: 0,
				priceSale: row.precio,
				idUnitMeasurePurchaseFk: 17,
				idUnitMeasureSaleFk: row.medida === 'UNIDAD' ? 17 : 3,
				idSucursalFk: selectedBusiness.idSucursal,
				idTypeProductFk: 1,
				is5050: 1,
				isPromo: row.en_promocion ? 1 : 0,
				maxProducVenta: '',
				minStock: 0,
				apply_inventory: true,
				efectivo: 0,
				linkPago: 0,
				maxAditionals: 0,
				minAditionals: 0,
				marketPrice: row.precio_promocion || 0,
				percentageOfProfit: 0,
				isheavy: 0,
				idAdicionalCategoryFk: 0,
				barCode: String(row.codigo),
				nameKitchen: '',
				unitweight: row.peso_unitario || null,
				observation: row.observacion || '',
				nameBrand: row.marca || null,
				nameLine: row.linea || null,
				nameFamily: row.categoria,
				nameSubFamily: row.subcategoria,
				unitByBox: row.unidades_por_caja || null,
				ean: row.ean || '',
				healthRegister: row.registro_sanitario || '',
				cpe: row.cpe || '',
			};
			uploadData.push(obj);
		}
		return uploadData;
	};

	const existCategory = (name) => {
		const filter = categories.filter(
			(c) => c.name.toLowerCase() === name.toLowerCase()
		);
		return filter.length > 0;
	};

	const existBrand = (name) => {
		const filter = brands.filter(
			(b) => b.nameSubFamily?.toLowerCase() === name.toLowerCase()
		);
		return filter.length > 0;
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
			console.log(data)
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
		for (let product in data) {
			for (let c in code) {
				if (product.barCode == c.barCode) {
					setWarningModal(true);
					break;
				} else {
					setLoading(true);
					const res = await requestHandler.post(
						'/api/v2/product/add/masive/sales',
						{
							lista: formatData,
						}
					);
					data;
					if (res.isLeft()) {
						return message.error('Ha ocurrido un error');
					}
					message.success('Productos agregados exitosamente');
					setData([]);
					setRejectedBrands([]);
					setRejectedCategories([]);
					setFileList([]);
					setLoading(false);
				}
			}
		}
	};

	const handleSend = async () => {
		const formatData = removeKeys(data);
		setLoading(true);
		const res = await requestHandler.post('/api/v2/product/add/masive/sales', {
			lista: formatData,
		});
		data;
		if (res.isLeft()) {
			return message.error('Ha ocurrido un error');
		}
		message.success('Productos agregados exitosamente');
		setData([]);
		setRejectedBrands([]);
		setRejectedCategories([]);
		setFileList([]);
		setLoading(false);
		setWarningModal(false);
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
					<Title title="Importar" path="/dashboard/products" goBack={1} />

					<Row style={{ margin: '1rem 0', width: '100%' }}>
						<Col>
							<Button
								disabled={!data?.length > 0}
								onClick={handleSendData}
								type="primary"
								style={{ marginRight: '1rem' }}
							>
								Agregar
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
					<ConfigProvider
						renderEmpty={data.length !== 0 || true ? CustomizeRenderEmpty : ''}
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
					title="Advertencia"
					open={warningModal}
					onCancel={() => setWarningModal(false)}
					onOk={handleSend}
					okText="Importar"
					okType="warning"
					cancelText="Cancelar"
				>
					<p>
						Algunos de los productos que intentas exportar ya estan en
						existencia. Si continuas los datos de estos productos se
						sobreescribiran con los previos, <br /> <br /> ¿Deseas continuar?
					</p>
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

export default ImportProducts;
