import { useContext, useEffect, useState } from 'react';
import { Table, Space, Modal, ConfigProvider, Button } from 'antd';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeTwoTone,
} from '@ant-design/icons';
import DashboardLayout from '../../../components/shared/layout';
import { useRouter } from 'next/router';
import { GeneralContext } from '../../_app';
import { addKeys } from '../../../util/setKeys';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import { message } from 'antd';
import ProductFilter from '../../../components/products/productFilter';
import { useProductFilter } from '../../../components/products/useProductFilter';
import Loading from '../../../components/shared/loading';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useProducts } from '../../../components/products/hooks/useProducts';
import Title from '../../../components/shared/title';
import { PROFILES } from '../../../components/shared/profiles';
import { useAuthContext } from '../../../context/useUserProfileProvider';
import * as XLSX from 'xlsx';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';

export default function Products() {
	const router = useRouter();
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Código',
			width: '160px',
			dataIndex: 'barCode',
			responsive: ['md'],
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			width: '160px',
			dataIndex: 'priceSale',
			responsive: ['sm'],
			key: 3,
			render: (text, record) => (
				<p>${record.isPromo == '1' ? record.marketPrice : text}</p>
			),
		},
		{
			title: 'Promoción',
			align: 'center',
			width: '20px',
			dataIndex: 'isPromo',
			responsive: ['lg'],
			key: 5,
			render: (text) => {
				return (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						{text != 0 ? (
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
			align: 'center',
			key: 6,
			render: (product, index) => (
				<Space
					size="small"
					style={{ justifyContent: 'center', display: 'flex' }}
				>
					<Button
						type="primary"
						onClick={() => {
							setLoading(true);
							router.push(`/dashboard/products/${product.idProduct}`);
						}}
					>
						<EyeTwoTone />
					</Button>
					<Button
						onClick={() => {
							setLoading(true);
							router.push(`/dashboard/products/update/${product.idProduct}`);
						}}
					>
						<EditOutlined />
					</Button>
					<Button
						type="primary"
						danger
						onClick={() => handleOpenDeleteModal(product)}
					>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];
	const { userProfile } = useAuthContext();
	const { loading, setLoading } = useLoadingContext();

	const generalContext = useContext(GeneralContext);
	const { getProducts, deleteProduct, products } = useProducts();
	const { clean, filtered, setProduct, setQuery } = useProductFilter();
	const { selectedBusiness } = useBusinessProvider();

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(filtered());
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		XLSX.writeFile(workbook, 'Lista_de_productos.xlsx');
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

	const deleteProductRequest = async (id) => {
		setLoading(true);
		try {
			await deleteProduct(id, selectedBusiness.idSucursal);
		} catch (error) {
			message.error('Error al eliminar producto');
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

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [currentProduct, setCurrentProduct] = useState();

	const handleOpenDeleteModal = (product) => {
		setCurrentProduct(product);
		setDeleteModalOpen(true);
	};

	const handleDelete = () => {
		deleteProductRequest(currentProduct.idProduct);
		setDeleteModalOpen(false);
	};

	return (
		<>
			<DashboardLayout>
				<div className="m-4 p-4">
					<Title goBack={false} title={'Productos'}>
						<div>
							<Button onClick={exportToExcel} block>
								Exportar
							</Button>
						</div>
						<Button
							type="warning"
							style={{ marginRight: '1.3rem', marginLeft: '1.3rem' }}
							onClick={() => router.push('/dashboard/products/import')}
						>
							Importar
						</Button>
						{userProfile != PROFILES.BILLER && (
							<Button
								style={{ marginRight: '-2rem' }}
								type="success"
								disabled={userProfile == PROFILES.BILLER}
								onClick={() => router.push('/dashboard/products/add')}
							>
								Agregar
							</Button>
						)}
					</Title>
					<ProductFilter setQuery={setQuery} clean={clean} />
					<ConfigProvider
						renderEmpty={filtered().length !== 0 ? CustomizeRenderEmpty : ''}
					>
						<Table
							columns={columns}
							dataSource={filtered()}
							loading={loading}
						/>
					</ConfigProvider>
				</div>
				<Modal
					title="Eliminar"
					open={deleteModalOpen}
					onCancel={() => setDeleteModalOpen(false)}
					onOk={handleDelete}
					footer={[
						// eslint-disable-next-line react/jsx-key
						<div className="flex justify-end gap-6">
							<Button
								key="cancel"
								danger
								onClick={() => setDeleteModalOpen(false)}
							>
								Cancelar
							</Button>
							,
							<Button key="delete" danger type="primary" onClick={handleDelete}>
								Eliminar
							</Button>
							,
						</div>,
					]}
				>
					<p>
						Estas seguro de que deseas eliminar
						{currentProduct?.nameProduct}
					</p>
				</Modal>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
}
