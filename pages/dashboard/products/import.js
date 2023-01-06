import { useState } from 'react';

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

const ImportProducts = () => {
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'name',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Código',
			dataIndex: 'code',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			dataIndex: 'price',
			key: 3,
			render: (text, record) =>
				record.isOnPromotion ? (
					<p style={{ color: 'green' }}>{text.toFixed(2)}$</p>
				) : (
					<p>{text.toFixed(2)}$</p>
				),
		},
		{
			title: 'Empresa',
			dataIndex: 'business',
			key: 4,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Marca',
			dataIndex: 'brand',
			key: 5,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Proveedor',
			dataIndex: 'provider',
			key: 6,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Stock',
			dataIndex: 'stock',
			key: 6,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Promoción',
			dataIndex: 'isOnPromotion',
			key: 5,
			render: (bool) => {
				return (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						{bool ? (
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
			dataIndex: 'isFeature',
			key: 5,
			render: (bool) => {
				return (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						{bool ? (
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

	// Product to delete
	const [currentProduct, setCurrentProduct] = useState();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	// control files
	const [fileList, setFileList] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);

	// Table's Data
	const [data, setData] = useState([]);

	const [loading, setLoading] = useState(false);

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

	const getFileExtension = (filename) => {
		return filename.split('.').pop();
	};

	const handleConvertFileToJson = (files) => {
		const file = new Blob(files, { type: files[0].type });
		let reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onload = (e) => {
			const workbox = XLSX.read(e.target.result, { type: 'buffer' });
			const worksheetName = workbox.SheetNames[0];
			const workSheet = workbox.Sheets[worksheetName];
			let data = XLSX.utils.sheet_to_json(workSheet);
			addKeys(data);
			setData(data);
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
		console.log('format', formatData);

		const response = await importProducts(formatData);

		if (response.isLeft()) {
			const error = response.value;
			return message.error(error.getErrorValue());
		}

		message.success(response.value.message);
	};

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
								disabled={!data.length > 0}
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
				<Loading isLoading={loading} />
			</DashboardLayout>
		</>
	);
};

export default ImportProducts;
