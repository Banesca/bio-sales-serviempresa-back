import { useContext, useEffect, useState } from 'react';
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
import { useBusinessProvider } from '../../hooks/useBusinessProvider';
import { GeneralContext } from '../../pages/_app';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { useBrandContext } from '../../hooks/useBrandsProvider';
import { useCategoryContext } from '../../hooks/useCategoriesProvider';
import { MEASURE_UNITS } from './hooks/useProducts';

const ProductForm = (props) => {
	const { setLoading } = useLoadingContext();
	const { brands, getBrands } = useBrandContext();
	const {
		categories,
		getCategories,
		subCategories,
		getSubCategories,
		lines,
		getLines,
	} = useCategoryContext();

	const [file, setFile] = useState(null);
	const [fileList, setFileList] = useState([]);
	const [isValidImgSize, setIsValidImgSize] = useState();

	const initialState = {
		nameProduct: props.product.nameProduct || '',
		barCode: props.product.barCode || '',
		idProductFamilyFk: props.product.idProductFamilyFk || '',
		idProductSubFamilyFk: props.product.idProductSubFamilyFk || '',
		idLineFk: props.product.idLineFk || null,
		idBrandFk: props.product.idBrandFk || null,
		ean: props.product.ean || '',
		healthRegister: props.product.healthRegister || '',
		priceSale: props.product.priceSale || 0,
		cpe: props.product.cpe || '',
		isPromo: props.product.isPromo || '0',
		marketPrice: props.product.marketPrice || 0,
		idUnitMeasureSaleFk: props.product.idUnitMeasureSaleFk || '',
		unitweight: props.product.unitweight || null,
		unitByBox: props.product.unitByBox || '',
		observation: props.product.observation || '',
		idSucursalFk: props.product.idSucursalFk,
		idProduct: props.product.idProduct,
	};

	const [product, setProduct] = useState(initialState);

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
		setLoading(true);
		try {
			await getCategories(business);
			await getSubCategories(business);
			await getLines(business);
		} catch (error) {
			console.log(error);
		}
	};

	const brandListRequest = async (business = 1) => {
		setLoading(true);
		try {
			await getBrands(business);
		} catch (error) {
			console.log(error);
			message.error('Error al cargar las marcas');
		}
	};

	const generalContext = useContext(GeneralContext);
	const { selectedBusiness } = useBusinessProvider();

	useEffect(() => {
		console.log(product, 'product');
	}, [product]);

	useEffect(() => {
		if (
			Object.keys(generalContext).length &&
			Object.keys(selectedBusiness).length
		) {
			brandListRequest(selectedBusiness.idSucursal);
			categoryListRequest(selectedBusiness.idSucursal);
			setProduct({
				...product,
				idSucursalFk: selectedBusiness.idSucursal,
				idRestaurantFk: selectedBusiness.idSucursal,
			});
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness]);

	const onSubmit = async () => {
		setLoading(true);
		console.log(product, 'product');
		setProduct({ ...product, idSucursalFk: selectedBusiness.idSucursal });
		await props.handleRequest(product, file);
		setLoading(false);
		if (!props.update) {
			onReset();
		}
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
					// maxWidth: '650px',
					margin: 'auto 1rem',
				}}
			>
				<Form
					style={{ width: '100%' }}
					name="addProduct"
					labelCol={{ span: 4 }}
					initialValues={{
						nameProduct: product.nameProduct,
						barCode: product.barCode,
						idProductFamilyFk: product.idProductFamilyFk,
						idProductSubFamilyFk: product.idProductSubFamilyFk,
						idBrandFk: product.idBrandFk,
						idLineFk: product.idLineFk,
						ean: product.ean,
						healthRegister: product.healthRegister,
						priceSale: product.priceSale,
						cpe: product.cpe,
						marketPrice: product.marketPrice,
						idUnitMeasureSaleFk: product.idUnitMeasureSaleFk,
						unitByBox: product.unitByBox,
						unitweight: product.unitweight,
						observation: product.observation,
					}}
					onFinish={onSubmit}
					autoComplete="off"
					form={form}
				>
					<Row>
						<Col span={12}>
							<Form.Item
								label="Nombre"
								name="nameProduct"
								labelCol={{ span: 8 }}
								rules={[
									{
										required: true,
										message: 'Ingresa un nombre',
									},
								]}
							>
								<Input
									type="text"
									value={product.nameProduct}
									onChange={(e) =>
										setProduct({
											...product,
											nameProduct: e.target.value,
										})
									}
								></Input>
							</Form.Item>
						</Col>
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
								label="Sub Categoría"
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
									value={product.idProductSubFamilyFk}
									onChange={(v) =>
										setProduct({
											...product,
											idProductSubFamilyFk: v,
										})
									}
								>
									{subCategories &&
										subCategories.map((b, i) => (
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
								label="Linea"
								name="idLineFk"
								labelCol={{ span: 8 }}
							>
								<Select
									value={product.idLineFk}
									onChange={(v) =>
										setProduct({
											...product,
											idLineFk: v,
										})
									}
								>
									{lines &&
										lines.map((line) => (
											<Select.Option
												key={line.idLine}
												value={line.idLine}
											>
												{line.name}
											</Select.Option>
										))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label="Marca"
								name="idBrandFk"
								labelCol={{ span: 8 }}
								rules={[
									{
										required: true,
										message: 'Elige una marca',
									},
								]}
							>
								<Select
									value={product.idBrandFk}
									onChange={(v) =>
										setProduct({
											...product,
											idBrandFk: v,
										})
									}
								>
									{brands &&
										brands.map((brand) => (
											<Select.Option
												key={brand.idBrand}
												value={brand.idBrand}
											>
												{brand.name}
											</Select.Option>
										))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<Form.Item
								label="EAN13"
								name="ean"
								labelCol={{ span: 8 }}
							>
								<Input
									value={product.ean}
									onChange={(e) =>
										setProduct({
											...product,
											ean: e.target.value,
										})
									}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label="Registro Sanitario"
								name="healthRegister"
								labelCol={{ span: 8 }}
							>
								<Input
									value={product.healthRegister}
									onChange={(e) =>
										setProduct({
											...product,
											healthRegister: e.target.value,
										})
									}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
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
						<Col span={12}>
							<Form.Item
								labelCol={{ span: 8 }}
								label="CPE"
								name="cpe"
							>
								<Input
									value={product.cpe}
									onChange={(e) =>
										setProduct({
											...product,
											cpe: e.target.value,
										})
									}
								/>
							</Form.Item>
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
									value={product.idUnitMeasureSaleFk}
									onChange={(v) =>
										setProduct({
											...product,
											idUnitMeasureSaleFk: v,
											idUnitMeasurePurchaseFk: v,
										})
									}
								>
									{Object.entries(MEASURE_UNITS).map((u) => (
										<Select.Option key={u[1]} value={u[1]}>
											{u[0]}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							{product.idUnitMeasureSaleFk == 3 && (
								<Form.Item
									label="Peso Unitario"
									name="unitweight"
									required={product.idUnitMeasureSaleFk === 3}
									labelCol={{ span: 8 }}
								>
									<Input
										value={product.unitweight}
										onChange={(e) =>
											setProduct({
												...product,
												unitweight: e.target.value,
											})
										}
									/>
								</Form.Item>
							)}
							{product.idUnitMeasureSaleFk == 17 && (
								<Form.Item
									label="Unidades/Caja"
									name="unitByBox"
									required={
										product.idUnitMeasureSaleFk === 17
									}
									labelCol={{ span: 8 }}
								>
									<Input
										value={product.unitByBox}
										onChange={(e) =>
											setProduct({
												...product,
												unitByBox: e.target.value,
											})
										}
									/>
								</Form.Item>
							)}
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item
								label="Observación"
								name="observation"
								labelCol={{ span: 4 }}
							>
								<Input
									value={product.observation}
									onChange={(e) =>
										setProduct({
											...product,
											observation: e.target.value,
										})
									}
								/>
							</Form.Item>
						</Col>
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
		</>
	);
};

export default ProductForm;
