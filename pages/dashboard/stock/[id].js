import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Button, List } from 'antd';
import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons';

import Loading from '../../../components/shared/loading';
import DashboardLayout from '../../../components/shared/layout';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import { ip } from '../../../util/environment';
import { useProducts } from '../../../components/products/hooks/useProducts';
import { useCategoryContext } from '../../../hooks/useCategoriesProvider';
import { useBrandContext } from '../../../hooks/useBrandsProvider';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import Title from '../../../components/shared/title';
import { message } from 'antd';

const Product = () => {
	const router = useRouter();
	const { id } = router.query;

	const generalContext = useContext(GeneralContext);

	const { getProductById, currentProduct } = useProducts();
	const {
		currentCategory,
		getCategoryById,
		currentSubCategory,
		getSubCategoryById,
		currentLine,
		getLineById,
	} = useCategoryContext();
	const { currentBrand, getBrandById } = useBrandContext();

	const { selectedBusiness } = useBusinessProvider();

	const handleReturn = () => {
		router.push('/dashboard/products');
	};

	const [loading, setLoading] = useState(true);

	const getCategoryRequest = async (categoryId) => {
		setLoading(false);
		try {
			await getCategoryById(categoryId);
		} catch (error) {
			message.error('Error al cargar categoria');
		} finally {
			setLoading(false);
		}
	};

	const getSubCategoryRequest = async (subCategoryId) => {
		setLoading(false);
		try {
			await getSubCategoryById(subCategoryId);
		} catch (error) {
			message.error('Error al cargar sub categoria');
		} finally {
			setLoading(false);
		}
	};

	const getLineRequest = async (lineId) => {
		setLoading(false);
		try {
			await getLineById(lineId);
		} catch (error) {
			message.error('Error al cargar linea');
		} finally {
			setLoading(false);
		}
	};

	const getBrandRequest = async (id) => {
		setLoading(false);
		try {
			await getBrandById(id);
		} catch (error) {
			message.error('Error al cargar marca');
		} finally {
			setLoading(false);
		}
	};

	const getProductRequest = async (id) => {
		setLoading(true);
		try {
			await getProductById(id);
		} catch (error) {
			message.error('Error al cargar producto');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		if (
			Object.keys(generalContext).length &&
			Object.keys(selectedBusiness).length
		) {
			getProductRequest(id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext]);

	useEffect(() => {
		setLoading(true);
		if (currentProduct.idProductFamilyFk) {
			getCategoryRequest(currentProduct.idProductFamilyFk);
		}
		if (currentProduct.idProductSubFamilyFk) {
			getSubCategoryRequest(currentProduct.idProductSubFamilyFk);
		}
		if (currentProduct.idLineFk) {
			getLineRequest(currentProduct.idLineFk);
		}
		if (currentProduct.idBrandFk) {
			getBrandRequest(currentProduct.idBrandFk);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentProduct]);

	if (loading) {
		<DashboardLayout>
			<Loading isLoading={loading} />
		</DashboardLayout>;
	}

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
				<Title title="Detalles" path="/dashboard/products" goBack={1} />
				<List
					style={{
						width: '100%',
						borderRadius: '15px',
						backgroundColor: 'rgba(128, 128, 128, 0.04)',
						padding: '10px 25px',
					}}
				>
					<List.Item>
						<p style={{ fontWeight: 'bold' }}>Nombre</p>
						<p>{currentProduct?.nameProduct}</p>
					</List.Item>
					<List.Item>
						<p style={{ fontWeight: 'bold' }}>Código</p>
						<p>{currentProduct?.barCode}</p>
					</List.Item>
					<List.Item>
						<p style={{ fontWeight: 'bold' }}>Precio</p>
						<p>$ {currentProduct?.priceSale}</p>
					</List.Item>
					<List.Item>
						<p style={{ fontWeight: 'bold' }}>Categoría</p>
						<p>{currentCategory?.name}</p>
					</List.Item>
					<List.Item>
						<p style={{ fontWeight: 'bold' }}>Sub Categoría</p>
						<p>{currentSubCategory?.nameSubFamily}</p>
					</List.Item>
					{currentLine?.name && (
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Linea</p>
							<p>{currentLine?.name}</p>
						</List.Item>
					)}
					<List.Item>
						<p style={{ fontWeight: 'bold' }}>Marca</p>
						<p>{currentBrand.name}</p>
					</List.Item>
					<List.Item>
						<p style={{ fontWeight: 'bold' }}>En Promoción</p>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								height: '100%',
							}}
						>
							{currentProduct?.isPromo != 0 ? (
								<CheckCircleOutlined
									style={{
										fontSize: '1.5rem',
										color: 'green',
									}}
								/>
							) : (
								<CloseCircleOutlined
									style={{ fontSize: '1.5rem', color: 'red' }}
								/>
							)}
						</div>
					</List.Item>

					{currentProduct?.isPromo == '1' && (
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Precio de Promoción</p>
							<p>$ {currentProduct.marketPrice}</p>
						</List.Item>
					)}
					<List.Item>
						<p style={{ fontWeight: 'bold' }}>Medida</p>
						<p>
							{currentProduct.idUnitMeasureSaleFk === 17
								? 'Unidad'
								: 'Kilogramo'}
						</p>
					</List.Item>
					<List.Item>
						{currentProduct.idUnitMeasureSaleFk === 17 ? (
							<>
								<p style={{ fontWeight: 'bold' }}>Unidad por Caja</p>
								<p>{currentProduct.unitByBox}</p>
							</>
						) : (
							<>
								<p style={{ fontWeight: 'bold' }}>Peso por unidad</p>
								<p>{currentProduct.unitweight} KG</p>
							</>
						)}
					</List.Item>
					<List.Item>
						<p style={{ fontWeight: 'bold' }}>EAN13</p>
						<p>{currentProduct.ean}</p>
					</List.Item>
					<List.Item>
						<p style={{ fontWeight: 'bold' }}>CPE</p>
						<p>{currentProduct.cpe}</p>
					</List.Item>
					<List.Item>
						<p style={{ fontWeight: 'bold' }}>Registro Sanitario</p>
						<p>{currentProduct.healthRegister}</p>
					</List.Item>
					{currentProduct.observation && (
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Observación</p>
							<p>{currentProduct.observation}</p>
						</List.Item>
					)}
					<List.Item>
						<p style={{ fontWeight: 'bold' }}>Stock</p>
						<p>
							{/* {currentProduct?.stock.length > 0
								? currentProduct.stock[0].stock
								: '0'} */}
						</p>
					</List.Item>
					<List.Item
						style={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						{Object.keys(currentProduct).length && (
							<Image
								src={`${ip}:${generalContext?.api_port}/product/${currentProduct?.urlImagenProduct}`}
								height={300}
								width={300}
								alt="Producto"
							/>
						)}
					</List.Item>
				</List>
			</div>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
};

export default Product;
