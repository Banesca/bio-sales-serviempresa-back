import { useState, useContext, useEffect } from 'react';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	ConsoleSqlOutlined,
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

const ImportProducts = () => {
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nameProduct',
			key: 1,
		},
		{
			title: 'Descripcion',
			dataIndex: 'nameKitchen',
			responsive: ['sm'],
			key: 2,
		},
		{
			title: 'Codigo de barra global',
			dataIndex: 'barCode',
			key: 3,
		},
		{
			title: 'Referencia',
			dataIndex: 'efectivo',
			responsive: ['xl'],
			key: 4,
		},
		{
			title: 'Categoria',
			dataIndex: 'nameFamily',
			responsive: ['lg'],
			key: 5,
		},
		{
			title: 'Marca',
			dataIndex: 'nameSubFamily',
			responsive: ['lg'],
			key: 6,
		},
		{
			title: 'Precio lista 1',
			dataIndex: 'priceSale',
			responsive: ['lg'],
			key: 7,
			render: (text, record) => <p>$ {text}</p>,
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
				nameProduct: row.Nombre,
				pricePurchase: 0,
				priceSale: row.Precio_Lista_1,
				idUnitMeasurePurchaseFk: 17,
				idUnitMeasureSaleFk: row.medida === 'UNIDAD' ? 17 : 3,
				idSucursalFk: selectedBusiness.idSucursal,
				idTypeProductFk: 1,
				is5050: 1,
				isPromo: row.en_promocion ? 1 : 0,
				maxProducVenta: '',
				minStock: 0,
				apply_inventory: true,
				efectivo: row.REFERENCIA,
				linkPago: 0,
				maxAditionals: 0,
				minAditionals: 0,
				marketPrice: row.precio_promocion || 0,
				percentageOfProfit: 0,
				isheavy: 0,
				idAdicionalCategoryFk: 0,
				barCode: String(row.Codigo_de_barra_global),
				nameKitchen: row.Descripcion,
				unitweight: row.peso_unitario || null,
				observation: row.observacion || '',
				nameBrand: row.marca || null,
				nameLine: row.linea || null,
				nameFamily: row.Categoria,
				nameSubFamily: row.Marca,
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
		reader.readAsBinaryString(file);
		reader.onload = async (e) => {
			const workbox = XLSX.read(e.target.result, { type: 'binary' });
			const worksheetName = workbox.SheetNames[0];
			const workSheet = workbox.Sheets[worksheetName];
			let data = XLSX.utils.sheet_to_json(workSheet);
			//console.log(data);
			const uploadData =  convertExcelDataToAPI(data);
			//console.log(uploadData);
			addKeys(uploadData);
			setData(uploadData);
		};
	};
	const exportToExcel = () => {
		const data = [ExcelExport];
		const worksheet = XLSX.utils.json_to_sheet(data);

		const range = XLSX.utils.decode_range(worksheet['!ref']);
		for (let R = range.s.r; R <= range.e.r; ++R) {
			for (let C = range.s.c; C <= range.e.c; ++C) {
				const cell_address = { c: C, r: R };
				const cell_ref = XLSX.utils.encode_cell(cell_address);
				if (!worksheet[cell_ref]) continue;
				worksheet[cell_ref].s = {
					fill: { patternType: 'solid', fgColor: { rgb: 'FF0000FF' } },
					font: { bold: true },
					alignment: { wrapText: true },
				};
			}
		}

		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		XLSX.writeFile(workbook, 'Plantilla.xlsx');
	};

	const ExcelExport = {
		Nombre: '',
		Descripcion: '',
		Codigo_de_barra_global: '',
		Codigo_de_barra_privado: '',
		Referencia: '',
		Categoria: '',
		Marca: '',
		Precio_Lista_1: '',
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
		//console.log(formatData);
					setLoading(true);
					const res = await requestHandler.post(
						'/api/v2/product/add/masive/sales',
						{
							lista: formatData,
						}
					);
					//console.log(res);
					if (res.isLeft()) {
						return message.error('Ha ocurrido un error');
					}
					message.success('Productos agregados exitosamente');
					setData([]);
					setRejectedBrands([]);
					setRejectedCategories([]);
					setFileList([]);
					setLoading(false);
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
								className="bg-blue-500"
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
						<Col>
							<Button
								onClick={exportToExcel}
								icon={<DownloadOutlined />}
								block
								style={{marginLeft:'1rem'}}
							>
								Descargar Plantilla
							</Button>
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
					footer={[
						<div style={{display:'flex'}}>
    						<Button type='success' onClick={handleSend}>Importar</Button>,
  							<Button type='warning'  onClick={() => setWarningModal(false)}>Cancelar</Button>
						</div>
  					]}
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
