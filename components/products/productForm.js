import { useContext, useEffect, useReducer, useState } from 'react';
import {
	Button,
	Switch,
	Select,
	Input,
	Upload,
	Col,
	Form,
	Row,
	message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRequest } from '../../hooks/useRequest';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';
import { GeneralContext } from '../../pages/_app';
import Loading from '../shared/loading';
import { Router, useRouter } from 'next/router';

const ProductForm = (props) => {
	const [loading, setLoading] = useState(false);
	const [brands, setBrands] = useState([]);
	const [categories, setCategories] = useState([]);
	const [imageUrl, setImageUrl] = useState();
	const [hasPromotion, setHasPromotion] = useState(false);
	const [unitMeasure, setUnitMeasure] = useState([]);
	const [file, setFile] = useState(null);
	const [fileList, setFileList] = useState([]);
	const [isValidImgSize, setIsValidImgSize] = useState();

	const initialState = {
		idProductFamilyFk: props.product.idProductFamilyFk || '',
		idProductSubFamilyFk: props.product.idProductSubFamilyFk || '',
		nameProduct: props.product.nameProduct || '',
		pricePurchase: 0,
		priceSale: props.product.priceSale || 0,
		idUnitMeasurePurchaseFk: props.product.idUnitMeasureSaleFk || '',
		idUnitMeasureSaleFk: props.product.idUnitMeasureSaleFk || '',
		idTypeProductFk: '1',
		idAdicionalCategoryFk: '0',
		idRestaurantFk: 1,
		is5050: '0',
		efectivo: '0',
		isPromo: props.product.isPromo || '0',
		linkPago: '0',
		minStock: '0',
		isheavy: '0',
		maxProducVenta: '0',
		maxAditionals: '0',
		minAditionals: '0',
		marketPrice: props.product.marketPrice || 0,
		percentageOfProfit: '0',
		nameKitchen: '',
		barCode: props.product.barCode || '',
		tax: '',
		starts: '5',
		idSucursalFk: props.product.idSucursalFk,
		idProduct: props.product.idProduct,
	};

	const [product, setProduct] = useState(initialState);

	console.log('Props Product', props.product);

	const { requestHandler } = useRequest();

	const fileProgress = (fileInput) => {
		const img = new Image();
		img.src = window.URL.createObjectURL(fileInput);
		console.log('open');
		img.onload = () => {
			setIsValidImgSize({ width: img.width, height: img.height });
			if (img.width <= 600 && img.height <= 600) {
				console.log('good');
				setIsValidImgSize(true);
				return true;
			} else {
				console.log('bad');
				setIsValidImgSize(false);
				message.error('La resolución debe ser menor a 600x600');
				return false;
			}
		};
	};

	const uploadProps = {
		beforeUpload: (file) => {
			fileProgress(file);
			console.log('close');
			const isJpgOrPng =
				file.type === 'image/jpeg' ||
				file.type === 'image/png' ||
				file.type === 'image/jpeg';
			if (!isJpgOrPng) {
				message.error('Solo puedes subir imágenes JPG/PNG!');
			}
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isLt2M) {
				message.error('El tamaño máximo es 2MB!');
			}
			let isValid = isJpgOrPng && isLt2M;
			console.log('valid before upload', isValid);
			if (isValid) {
				setFile(file);
			}
			return isValid;
		},
		onChange: (info) => {
			console.log('change');
			let newFileList = [...info.fileList];
			newFileList = newFileList.slice(-1);

			if (newFileList.length === 0) {
				setFileList(newFileList[0]);
				return message.success('Archivo eliminado');
			}

			setFileList(newFileList);
			if (newFileList[0].status == 'done') {
				console.log('uploaded', isValidImgSize);
				if (!isValidImgSize) {
					setFileList([]);
					return;
				}
				setLoading(true);
				message.success(`${newFileList[0].name} ha sido cargado`);
			} else if (newFileList[0].status == 'error') {
				message.error('Ha ocurrido un error');
			}
			setLoading(false);
		},
	};

	const handleSwitchChange = (value) => {
		setProduct({ ...product, isPromo: value ? '1' : '0' });
	};

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

	const unitMeasureRequest = async () => {
		const response = await requestHandler.get(`/api/v2/utils/unitmeasure`);
		if (response.isLeft()) {
			return;
		}
		console.log('BRAND', response.value.getValue());
		const value = response.value.getValue().response;
		setUnitMeasure(value);
	};

	const generalContext = useContext(GeneralContext);
	const { selectedBusiness } = useBusinessProvider();

	useEffect(() => {
		console.log('business', selectedBusiness);
		if (generalContext && selectedBusiness) {
			brandListRequest(selectedBusiness.idSucursal);
			categoryListRequest(selectedBusiness.idSucursal);
			unitMeasureRequest();
			setProduct({
				...product,
				idSucursalFk: selectedBusiness.idSucursal,
				idRestaurantFk: selectedBusiness.idSucursal,
			});
		}
	}, [generalContext, selectedBusiness]);

	const validateBarCode = async (barCode) => {
		const res = await requestHandler.post(
			'/api/v2/product/find/bybarcode',
			{ barCode, idSucursalFk: selectedBusiness.idSucursal }
		);
		const value = res.value.getValue();
		console.log(value);
		return !!value.data;
	};

	const validateProductName = async (nameProduct) => {
		const res = await requestHandler.post('/api/v2/product/find/name', {
			nameProduct,
			idSucursalFk: selectedBusiness.idSucursal,
		});
		const value = res.value.getValue();
		console.log(value);
		return !!value.data;
	};

	const router = useRouter();
	const onSubmit = async () => {
		setLoading(true);
		const formData = new FormData();
		for (const field of Object.entries(product)) {
			if (!props.update && field[0] == 'idProduct') {
				continue;
			}
			formData.append(field[0], field[1]);
		}
		if (file) {
			const imgName = file.name.replace(' ', '-');
			formData.append('image', file, imgName);
		}
		if (!props.update) {
			const invalidCode = await validateBarCode(product.barCode);
			const invalideName = await validateProductName(product.nameProduct);
			if (invalideName) {
				setLoading(false);
				return message.error(
					`El producto ${product.nameProduct} ya existe`
				);
			}
			if (invalidCode) {
				setLoading(false);
				return message.error(
					`El código ${product.barCode} ya se encuentra en uso`
				);
			}
		}
		await props.handleRequest(formData);
		setLoading(false);
		router.push('/dashboard/products');
	};

	const [form] = Form.useForm();
	const onReset = () => {
		setProduct(initialState);
		form.resetFields();
	};

	return (
		<>
			<h1
				style={{
					color: 'white',
					fontSize: '2rem',
					textAlign: 'center',
				}}
			>
				{props.update ? 'Actualizar Producto' : 'Agregar Producto'}
			</h1>
			<div
				style={{
					maxWidth: '650px',
					margin: 'auto',
				}}
			>
				<Form
					style={{ width: '100%' }}
					name="addProduct"
					labelCol={{ span: 4 }}
					initialValues={{
						nameProduct: product.nameProduct,
						barCode: product.barCode,
						priceSale: product.priceSale,
						idProductFamilyFk: product.idProductFamilyFk,
						idProductSubFamilyFk: product.idProductSubFamilyFk,
						idUnitMeasureSaleFk: product.idUnitMeasureSaleFk,
						marketPrice: product.marketPrice,
					}}
					onFinish={onSubmit}
					autoComplete="off"
					form={form}
				>
					<Form.Item
						label="Nombre"
						name="nameProduct"
						rules={[
							{ required: true, message: 'Ingresa un nombre' },
						]}
					>
						<Input
							type="text"
							defaultValue={product.nameProduct}
							value={product.nameProduct}
							onChange={(e) =>
								setProduct({
									...product,
									nameProduct: e.target.value,
								})
							}
						></Input>
					</Form.Item>
					<Row>
						<Col span={12}>
							<Form.Item
								label="Código"
								name="barCode"
								labelCol={{ span: 8 }}
								rules={[
									{
										required: true,
										message: 'Ingresa un código',
									},
								]}
							>
								<Input
									defaultValue={product.barCode}
									value={product.barCode}
									type="text"
									onChange={(e) =>
										setProduct({
											...product,
											barCode: e.target.value,
										})
									}
								></Input>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label="Precio"
								name="priceSale"
								labelCol={{ span: 8 }}
								rules={[
									{
										required: true,
										message: 'Ingresa un precio',
									},
								]}
							>
								<Input
									defaultValue={product.priceSale}
									value={product.priceSale}
									type="number"
									onChange={(e) =>
										setProduct({
											...product,
											priceSale: e.target.value,
										})
									}
								></Input>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<Form.Item
								label="Categoría"
								name="idProductFamilyFk"
								labelCol={{ span: 8 }}
								rules={[
									{
										required: true,
										message: 'Elige una categoría',
									},
								]}
							>
								<Select
									defaultValue={product.idProductFamilyFk}
									value={product.idProductFamilyFk}
									onChange={(v) =>
										setProduct({
											...product,
											idProductFamilyFk: v,
										})
									}
								>
									{categories &&
										categories.map((c, i) => (
											<Select.Option
												key={c.idProductFamily}
												value={c.idProductFamily}
											>
												{c.name}
											</Select.Option>
										))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label="Marca"
								name="idProductSubFamilyFk"
								labelCol={{ span: 8 }}
								rules={[
									{
										required: true,
										message: 'Elige una marca',
									},
								]}
							>
								<Select
									defaultValue={product.idProductSubFamilyFk}
									value={product.idProductSubFamilyFk}
									onChange={(v) =>
										setProduct({
											...product,
											idProductSubFamilyFk: v,
										})
									}
								>
									{brands &&
										brands.map((b, i) => (
											<Select.Option
												key={b.idProductSubFamily}
												value={b.idProductSubFamily}
											>
												{b.nameSubFamily}
											</Select.Option>
										))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<Form.Item
								label="Medida"
								name="idUnitMeasureSaleFk"
								labelCol={{ span: 8 }}
								rules={[
									{
										required: true,
										message: 'Elige una medida',
									},
								]}
							>
								<Select
									defaultValue={product.idUnitMeasureSaleFk}
									value={product.idUnitMeasureSaleFk}
									onChange={(v) =>
										setProduct({
											...product,
											idUnitMeasureSaleFk: v,
											idUnitMeasurePurchaseFk: v,
										})
									}
								>
									{unitMeasure &&
										unitMeasure.map((u) => (
											<Select.Option
												key={u.idUnitMeasureFk}
												value={u.idUnitMeasureFk}
											>
												{u.unitMeasure}
											</Select.Option>
										))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							{/* <Form.Item
								label="Marca"
								name="idProductSubFamilyFk"
								labelCol={{ span: 8 }}
							>
								<Select allowClear>
									{brands &&
										brands.map((b, i) => (
											<Select.Option
												key={b.idProductSubFamily}
												value={b.idProductSubFamily}
											>
												{b.name}
											</Select.Option>
										))}
								</Select>
							</Form.Item> */}
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<Form.Item
								name="isPromo"
								label="Promoción"
								labelCol={{ span: 8 }}
							>
								<Switch
									checked={product.isPromo == 1}
									onChange={handleSwitchChange}
								/>
							</Form.Item>
						</Col>
						{product.isPromo == '1' && (
							<Col span={12}>
								<Form.Item
									label="Precio"
									name="marketPrice"
									labelCol={{ span: 8 }}
									rules={[
										{
											required: product.isPromo == 1,
											message:
												'Ingresa un precio para promoción',
										},
									]}
								>
									<Input
										type="number"
										defaultValue={product.marketPrice}
										value={product.marketPrice}
										onChange={(e) =>
											setProduct({
												...product,
												marketPrice: e.target.value,
											})
										}
									></Input>
								</Form.Item>
							</Col>
						)}
					</Row>
					<Form.Item
						wrapperCol={{ span: 4, offset: 11 }}
						style={{ marginTop: '1rem' }}
						rules={[{ required: true, message: 'Sube una imagen' }]}
					>
						<Upload
							name="avatar"
							className="avatar-uploader"
							listType="picture"
							fileList={fileList}
							accept=".png,.jpg"
							{...uploadProps}
						>
							<Button icon={<UploadOutlined />}>
								Subir imagen
							</Button>
						</Upload>
					</Form.Item>
					<Row>
						<Col span={12}>
							<Form.Item
								wrapperCol={{
									span: 12,
									offset: 8,
								}}
							>
								<Button block onClick={onReset}>
									Limpiar
								</Button>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item wrapperCol={{ span: 12, offset: 8 }}>
								<Button htmlType="submit" type="primary" block>
									{props.update ? 'Actualizar' : 'Agregar'}
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
			<Loading isLoading={loading} />
		</>
	);
};

export default ProductForm;
