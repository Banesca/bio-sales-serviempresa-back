import { useState, useContext, useEffect } from 'react';

import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	ExclamationCircleFilled,
	UploadOutlined,
} from '@ant-design/icons';
import { Upload, Button, Table, message, Row, Col, Modal } from 'antd';
import * as XLSX from 'xlsx';

import DashboardLayout from '../../../components/layout';
import { addKeys, removeKeys } from '../../../util/setKeys';
import Loading from '../../../components/loading';
import { importProducts } from '../../../services/products';
import { GeneralContext } from '../../_app';
import { useRequest } from '../../../hooks/useRequest';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import { notification } from 'antd';
import { useRouter } from 'next/router';

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
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			dataIndex: 'priceSale',
			key: 3,
			render: (text, record) =>
				record.isPromo == '1' ? (
					<p style={{ color: 'green' }}>$ {record.marketPrice}</p>
				) : (
					<p>$ {text}</p>
				),
		},
		{
			title: 'Categoria',
			dataIndex: 'nameFamily',
			key: 5,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Marca',
			dataIndex: 'nameSubFamily',
			key: 5,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Promoción',
			dataIndex: 'isPromo',
			key: 5,
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
			title: 'Destacado',
			dataIndex: 'is5050',
			key: 5,
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
			key: 6,
			render: (product, index) => (
				<Button type="primary" danger>
					<DeleteOutlined onClick={() => confirmDelete(product)} />
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
				const filteredProducts = data.filter(
					(p) => p.code !== product.code
				);
				setData(filteredProducts);
			},
			onCancel() {
				console.log('cancel');
			},
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
		const filteredProducts = data.filter(
			(p) => p.code !== currentProduct.code
		);
		setData(filteredProducts);
		handleSeeModal();
	};

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

	const categoryListRequest = async (business = 1) => {
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
		console.log('BRAND', response.value.getValue());
		const value = response.value.getValue().response;
		setBrands(value);
	};

	useEffect(() => {
		if (selectedBusiness && generalContext) {
			setLoading(true);
			categoryListRequest(selectedBusiness.idSucursal);
			brandListRequest(selectedBusiness.idSucursal);
			setLoading(false);
		}
	}, [selectedBusiness, generalContext]);

	const getFileExtension = (filename) => {
		return filename.split('.').pop();
	};

	const convertExcelDataToAPI = (rows) => {
		let uploadData = [];
		for (const row of rows) {
			let valid = true;
			if (!existCategory(row.categoria)) {
				setRejectedCategories((prev) => [...prev, row.categoria]);
				valid = false;
			}
			if (!existBrand(row.marca)) {
				// rejectedBrands.push(row.marca);
				setRejectedBrands((prev) => [...prev, row.marca]);
				valid = false;
			}
			if (!valid) {
				return;
			}
			const obj = {
				nameFamily: row.categoria,
				nameSubFamily: row.marca,
				nameProduct: row.nombre,
				pricePurchase: 0,
				priceSale: row.precio,
				marketPrice: row.precio_promocion,
				idSucursalFk: selectedBusiness.idSucursal,
				idTypeProductFk: 1,
				isPromo: row.en_promocion ? '1' : '0',
				is5050: row.destacado ? '1' : '0',
				linkPago: '',
				apply_inventory: true,
				barCode: String(row.codigo),
				nameKitchen: 'descripcion',
				idProductFamily: 1,
				idProductSubFamily: 1,
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
			// if (rejectedBrands.length > 0 || rejectedCategories.length > 0) {
			// 	setNotificationOpen(true);
			// }
			addKeys(uploadData);
			setData(uploadData);
			console.log('DATA', uploadData);
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
			//message.success(`${newFileList[0].name} ha sido cargado`);
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

		setLoading(true);
		const res = await requestHandler.post(`/api/v2/product/add/masive`, {
			lista: formatData,
		});
		console.log(res);
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
					<Row style={{ margin: '2rem 0' }}>
						<Col
							span={8}
							offset={8}
							style={{
								justifyContent: 'center',
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Upload
								{...props}
								fileList={fileList}
								style={{ width: '100%' }}
								accept=".xls,.xlsx"
								type="file"
							>
								<Button icon={<UploadOutlined />} block>
									Subir archivo
								</Button>
							</Upload>
						</Col>
					</Row>
					<Row style={{ margin: '0 0 1rem' }}>
						<Col
							span={6}
							offset={8}
							style={{
								justifyContent: 'center',
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Button
								disabled={!data?.length > 0}
								onClick={handleSendData}
							>
								Cargar Datos
							</Button>
						</Col>
					</Row>
					<Table columns={columns} dataSource={data} />
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
						Algunos productos no han sido cargados, ya que, hay
						categorías y/o marcas que no están registradas, créalas
						para cargar todos los productos.
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
