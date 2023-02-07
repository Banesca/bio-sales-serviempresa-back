import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { List } from 'antd';
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
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const getSubCategoryRequest = async (subCategoryId) => {
		setLoading(false);
		try {
			await getSubCategoryById(subCategoryId);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const getLineRequest = async (lineId) => {
		setLoading(false);
		try {
			await getLineById(lineId);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const getBrandRequest = async (id) => {
		setLoading(false);
		try {
			await getBrandById(id);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const getProductRequest = async (id) => {
		setLoading(true);
		try {
			await getProductById(id);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		console.log(currentProduct, 'current Product');
	}, [currentProduct]);

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
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<ArrowLeftOutlined
						style={{ fontSize: '1.5rem', color: 'white' }}
						onClick={handleReturn}
					/>
					<h1 style={{ color: 'white', fontSize: '2rem' }}>
						Detalles
					</h1>
					<div></div>
				</div>
				<List style={{ width: '100%', paddingInline: '2rem' }}>
					<List.Item>
						<p>Nombre</p>
						<p>{currentProduct?.nameProduct}</p>
					</List.Item>
					<List.Item>
						<p>Código</p>
						<p>{currentProduct?.barCode}</p>
					</List.Item>
					<List.Item>
						<p>Precio</p>
						<p>$ {currentProduct?.priceSale}</p>
					</List.Item>
					<List.Item>
						<p>Categoría</p>
						<p>{currentCategory.name}</p>
					</List.Item>
					<List.Item>
						<p>Sub Categoría</p>
						<p>{currentSubCategory.nameSubFamily}</p>
					</List.Item>
					{currentLine.name && (
						<List.Item>
							<p>Linea</p>
							<p>{currentLine.name}</p>
						</List.Item>
					)}
					<List.Item>
						<p>Marca</p>
						<p>{currentBrand.name}</p>
					</List.Item>
					<List.Item>
						<p>En Promoción</p>
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
							<p>Precio de Promoción</p>
							<p>$ {currentProduct.marketPrice}</p>
						</List.Item>
					)}
					<List.Item>
						<p>Medida</p>
						<p>
							{currentProduct.idUnitMeasureSaleFk === 17
								? 'Unidad'
								: 'Kilogramo'}
						</p>
					</List.Item>
					<List.Item>
						{currentProduct.idUnitMeasureSaleFk === 17 ? (
							<>
								<p>Unidad por Caja</p>
								<p>{currentProduct.unitByBox}</p>
							</>
						) : (
							<>
								<p>Peso por unidad</p>
								<p>{currentProduct.unitweight} KG</p>
							</>
						)}
					</List.Item>
					<List.Item>
						<p>EAN13</p>
						<p>{currentProduct.ean}</p>
					</List.Item>
					<List.Item>
						<p>CPE</p>
						<p>{currentProduct.cpe}</p>
					</List.Item>
					<List.Item>
						<p>Registro Sanitario</p>
						<p>{currentProduct.healthRegister}</p>
					</List.Item>
					<List.Item>
						<p>Stock</p>
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
