import { useContext, useEffect, useState } from 'react';
import { Table, Space, Modal, ConfigProvider, Empty } from 'antd';
import Button from 'antd-button-color';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	DownOutlined,
	EditOutlined,
	EyeTwoTone,
} from '@ant-design/icons';

import DashboardLayout from '../../../components/shared/layout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GeneralContext } from '../../_app';
import { addKeys } from '../../../util/setKeys';
import SelectBusiness from '../../../components/business/selectBusiness';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import { message } from 'antd';
import ProductFilter from '../../../components/products/productFilter';
import { useProductFilter } from '../../../components/products/useProductFilter';
import Loading from '../../../components/shared/loading';
import { useCategoryContext } from '../../../hooks/useCategoriesProvider';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useProducts } from '../../../components/products/hooks/useProducts';
import { useBrandContext } from '../../../hooks/useBrandsProvider';
import Title from '../../../components/shared/title';
import { PROFILES } from '../../../components/shared/profiles';
import { useAuthContext } from '../../../context/useUserProfileProvider';

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
				<p>
					${record.isPromo == '1' ? record.marketPrice : text}
				</p>
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
				<Space size="small" style={{justifyContent: 'center', display: 'flex'}}>
					<Button
						type="primary"
						onClick={() => {
							setLoading(true);
							router.push(
								`/dashboard/products/${product.idProduct}`
							);
						}}
					>
						<EyeTwoTone />
					</Button>
					<Button
						onClick={() => {
							setLoading(true);
							router.push(
								`/dashboard/products/update/${product.idProduct}`
							);
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

	const { getCategories, getSubCategories, getLines } = useCategoryContext();
	const { getBrands } = useBrandContext();

	const { getProducts, deleteProduct, products } = useProducts();
	const { clean, filtered, setProduct, setQuery } = useProductFilter();

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
			console.error(error);
			message.error('Error al cargar productos');
		} finally {
			setLoading(false);
		}
	};

	const categoryListRequest = async (id = 1) => {
		setLoading(true);
		try {
			await getCategories(id);
			await getSubCategories(id);
			await getLines(id);
			setLoading(false);
		} catch (error) {
			return message.error('Error al cargar las categorías');
		} finally {
			setLoading(false);
		}
	};

	const brandListRequest = async (business = 1) => {
		setLoading(true);
		try {
			await getBrands(business);
		} catch (error) {
			message.error('Error al cargar marcas');
		} finally {
			setLoading(false);
		}
	};

	const deleteProductRequest = async (id) => {
		setLoading(true);
		try {
			await deleteProduct(id, selectedBusiness.idSucursal);
		} catch (error) {
			console.error(error);
			message.error('Error al eliminar producto');
		} finally {
			setLoading(false);
		}
	};

	const { selectedBusiness } = useBusinessProvider();

	useEffect(() => {
		// request data
		setLoading(true);
		if (
			Object.keys(generalContext).length > 0 &&
			Object.keys(selectedBusiness).length > 0
		) {
			categoryListRequest(selectedBusiness.idSucursal);
			brandListRequest(selectedBusiness.idSucursal);
			getProductsRequest(selectedBusiness.idSucursal);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness]);

	// Delete Modal
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	// which modal component
	const [currentProduct, setCurrentProduct] = useState();

	const handleOpenDeleteModal = (product) => {
		setCurrentProduct(product);
		setDeleteModalOpen(true);
	};

	const handleDelete = () => {
		// request delete product
		deleteProductRequest(currentProduct.idProduct);
		setDeleteModalOpen(false);
	};

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
						padding: '15px',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Title goBack={false} title={'Productos'}>
						{userProfile != PROFILES.BILLER && (
							<Button
								style={{ marginRight: '1rem' }}
								type="success"
								disabled={userProfile == PROFILES.BILLER}
								onClick={() =>
									router.push('/dashboard/products/add')
								}
							>
								Filtro
								<DownOutlined></DownOutlined>
							</Button>
						)}
						{/* <Button
							type="warning"
							style={{marginRight: '-2.3rem'}}
							onClick={() =>
								router.push('/dashboard/products/import')
							}
						>
							Importar
						</Button> */}
					</Title>
					<ProductFilter setQuery={setQuery} clean={clean} />
					<ConfigProvider renderEmpty={customizeRenderEmpty}>
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
						<Button
							key="cancel"
							danger
							onClick={() => setDeleteModalOpen(false)}
						>
							Cancelar
						</Button>,
						<Button
							key="delete"
							danger
							type="primary"
							onClick={handleDelete}
						>
							Eliminar
						</Button>,
					]}
				>
					<p>
						Estas seguro de que deseas eliminar
						{` ${currentProduct?.nameProduct}`}
					</p>
				</Modal>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
}