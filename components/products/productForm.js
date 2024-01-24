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
	Card,
	Table,
} from 'antd';
import {
	ArrowLeftOutlined,
	LeftOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';
import { GeneralContext } from '../../pages/_app';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { useBrandContext } from '../../hooks/useBrandsProvider';
import { useCategoryContext } from '../../hooks/useCategoriesProvider';
import { MEASURE_UNITS, useProducts } from './hooks/useProducts';
import { useRouter } from 'next/router';
import { useRequest } from '../../hooks/useRequest';
import Image from 'next/image';
import { ip } from '../../util/environment';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const ProductForm = (props) => {
	const router = useRouter();
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
	const [products, setProducts] = useState(null);
	const [obsequio, setObsequio] = useState(null);
	const [file, setFile] = useState(null);
	const [promos, setPromos] = useState(null);
	const [fileList, setFileList] = useState([]);
	const [isValidImgSize, setIsValidImgSize] = useState();
	const { getProductById, updateProduct, currentProduct } = useProducts();
	const { id } = router.query;
	const [isFileSelected, setIsFileSelected] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [chips, setChips] = useState([]);
	const [chips2, setChips2] = useState([]);
	const [arregloObsequios, setArregloObsequios] = useState({
		id: '',
		productPromo:'',
		cantidad:'',
		condicion:'',
		Paymode:''
	});
	const [units, setUnits] = useState([]);
	const initialState = {
		nameProduct: props.product.nameProduct || '',
		barCode: props.product.barCode || '',
		idProductFamilyFk: props.product.idProductFamilyFk || '',
		idProductSubFamilyFk: props.product.idProductSubFamilyFk || '',
		ean: props.product.ean || '',
		healthRegister: props.product.healthRegister || '',
		priceSale: props.product.priceSale || 0,
		cpe: props.product.cpe || '',
		isPromo: props.product.isPromo || '0',
		marketPrice: props.product.marketPrice || 0,
		idUnitMeasureSaleFk: props.product.idUnitMeasureSaleFk || '',
		unitweight: props.product.unitweight || null,
		isheavy: props.product.isheavy || '',
		observation: props.product.observation || '',
		idSucursalFk: props.product.idSucursalFk,
		idProduct: props.product.idProduct,
		efectivo: props.product.efectivo || '',
		maxProducVenta: props.product.maxProducVenta || '',
		is5050: props.product.is5050 || '',
		nameKitchen: props.product.nameKitchen || '',
		idUnitMeasurePurchaseFk:props.product.idUnitMeasurePurchaseFk  || '',
		adicionals:props.product.adicionals || ''
	};

	const generalContext = useContext(GeneralContext);
	const { selectedBusiness } = useBusinessProvider();
	const { requestHandler } = useRequest();
	const [c, setC] = useState();
	const [product, setProduct] = useState(initialState);
	const [form] = Form.useForm();
	const [click, setClick] = useState(false);
	const onReset = () => {
		setProduct({
			nameProduct: '',
			barCode: '',
			idProductFamilyFk: '',
			idProductSubFamilyFk: '',
			idBrandFk: '',
			idLineFk: '',
			ean: '',
			healthRegister: '',
			priceSale: '',
			cpe: '',
			marketPrice: '',
			idUnitMeasureSaleFk: '',
			isheavy: '',
			unitweight: '',
			observation: '',
			efectivo: '',
			maxProducVenta: '',
			is5050: '',
			nameKitchen:'',
			idUnitMeasurePurchaseFk:'',
			adicionals:''
		});
		form.resetFields();
		click ? setClick(false) : setClick(true);
	};

	const AddObsequio=()=>{

	}

	const columns = [
		{
			title: 'Producto',
			dataIndex: 'numberOrden',
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Forma de Pago',
			dataIndex: 'facturaAfip',
		},
		{
			title: 'Cantidad',
			dataIndex: 'facturaAfip',
		},
		{
			title: 'Condicion',
			dataIndex: 'facturaAfip',
		},
		
	];


	const codeListRequest = async (business = 1) => {
		let code = [];
		const response = await requestHandler.get(
			`/api/v2/product/list/0/0/${business}`
		);
		if (response.isLeft()) {
			return;
		}
		const value = response.value.getValue().data;
		setProducts(value);
		console.log(products)
		if (props.update) {
			for (let i = 0; i < value?.length; i++) {
				if (product.barCode !== value[i].barCode) {
					setC(code.push(value[i].barCode));
				}
			}
		} else {
			for (let i = 0; i < value?.length; i++) {
				setC(code.push(value[i].barCode));
			}
		}
		setC(code);
	};

	const getUnit= async ()=>{
		const response = await requestHandler.get(
			`/api/v2/utils/unitmeasure`
		);

		
		const value = response.value.getValue().response;
		setUnits(value)
	}

	const getObsequio = async (response) => {

		console.log(response)

		console.log(response.Obsequio)
		/*let currentIs5051 = 
		currentIs5051
*/
	//alert(newIs5051)

	};

	const fileProgress = (fileInput) => {
		return new Promise((resolve, reject) => {
			const img = new window.Image();
			img.src = window.URL.createObjectURL(fileInput);
			img.onload = () => {
				const isValidSize = img.width <= 600 && img.height <= 600;
				setIsValidImgSize(isValidSize);
				if (isValidSize) {
					setFile(fileInput);
					setIsFileSelected(true);
					resolve(fileInput);
				} else {
					message.error('La resolución debe ser menor a 600x600');
					reject(new Error('Invalid image size'));
				}
			};
		});
	};

	const uploadProps = {
		beforeUpload: async (file) => {
			try {
				await fileProgress(file);
				const isJpgOrPng =
					file.type === 'image/jpeg' ||
					file.type === 'image/png' ||
					file.type === 'image/jpeg';
				if (!isJpgOrPng) {
					message.error('Solo puedes subir imágenes JPG/PNG!');
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				console.log(`El tamaño del archivo es: ${file.size / 1024 / 1024} MB`);
				if (!isLt2M) {
					message.error('El tamaño máximo es 2MB!');
					return false;
				}
				let isValid = isJpgOrPng && isLt2M;
				if (isValid) {
					console.log(file);
					setFile(file);
					setIsFileSelected(true);
					return true;
				}
			} catch (error) {
				console.error(error);
				return false;
			}
		},
		onChange: (info) => {
			let newFileList = [...info.fileList];
			newFileList = newFileList.slice(-1);

			if (newFileList.length === 0) {
				setFileList([]);
				setFile(null);
				setIsFileSelected(false);
				return message.success('Archivo eliminado');
			}
			setFileList(newFileList);
			if (newFileList[0].status == 'done') {
				if (!isValidImgSize) {
					setFileList([]);
					return;
				}
				setFile(newFileList[0].originFileObj);
				setIsFileSelected(true);
				setLoading(true);
				message.success(`${newFileList[0].name} ha sido cargado`);
			} else if (newFileList[0].status == 'error') {
				message.error('Ha ocurrido un error');
			}
			setLoading(false);
		},
	};

	const onSubmit = async () => {
		setLoading(true);
		const words = chips.map((chip) => chip);
		const words2 = chips2.map((chip) => chip);
		const adicionales = {
		  idProductAdicionals: arregloObsequios.id,
		  idProductFk: arregloObsequios.id,
		  idProductAdicionalFk: arregloObsequios.productPromo
		}
		console.log(adicionales)
		let Arreglo=[]
		Arreglo.push({adicionales:adicionales})
		console.log
		let currentIs5050 = [];
		try {
		  currentIs5050 = JSON.parse(product.is5050);
		} catch (error) {
		  console.error('Error parsing product.is5050:', error);
		}
		let AdicionalString = [];
		try {
			AdicionalString = JSON.parse(Arreglo);
		} catch (error) {
		  console.error('Error parsing adicionales:', error);
		}
	  
		let CurrentpercentageOfProfit = [];
		try {
		  CurrentpercentageOfProfit = JSON.parse(product.nameKitchen);
		} catch (error) {
		  console.error('Error parsing product.nameKitchen:', error);
		}
		console.log(AdicionalString)
		const newIs5050 = JSON.stringify([...currentIs5050, ...words]);
		const productObsequio = JSON.stringify([CurrentpercentageOfProfit, ...words2]);
		const ObsequioLista = JSON.stringify([AdicionalString]);
	  console.log(ObsequioLista);
		const updatedProduct = {
		  ...product,
		  adicionals: productObsequio,
		  is5050: newIs5050,
		  nameKitchen: productObsequio,
		  idSucursalFk: selectedBusiness.idSucursal,
		};
		
		await props.handleRequest(updatedProduct, file);
		setProduct(updatedProduct);
		
		getObsequio(product)
		setLoading(false);
		if (!props.update) {
		  return onReset();
		}
		window.location.reload();
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

	if (!product) {
		return <div>Cargando...</div>;
	}

	

	const addProms= async () =>{
		/*const res = await requestHandler.post(
			`/api/v2/add/adicional/product/category`,
			{
				idAdicionalCategoryFk: arregloObsequios.productPromo, //Listado de productos
  				  idProductFk: arregloObsequios.id,  //Id del prodducto que sera recibido
				min: arregloObsequios.condicion,
  				max: arregloObsequios.cantidad,  
				order: arregloObsequios.Paymode
			}
		);		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
*/
	}

	useEffect(()=>{		
		setArregloObsequios({
		...arregloObsequios,
		id: currentProduct?.idProduct,
	})
	console.log(currentProduct)
},[products])


useEffect(()=>{
	
		setChips2([{obsequios:arregloObsequios}]);
	
	console.log(chips2)
},[arregloObsequios])








	const handleSwitchChange = (value) => {
		setProduct({ ...product, isPromo: value ? '1' : '0' });
	};

	const handleSwitchChange2 = (value) => {
		console.log(value);
		setObsequio(value ? '1' : '0');

	};

	const categoryListRequest = async (business = 1) => {
		setLoading(true);
		try {
			await getCategories(business);
			await getSubCategories(business);
			await getLines(business);
			await getUnit()
		} catch (error) {
			message.error('Error al cargar las categorias');
		}
	};

	const brandListRequest = async (business = 1) => {
		setLoading(true);
		try {
			await getBrands(business);
		} catch (error) {
			message.error('Error al cargar las marcas');
		}
	};

	useEffect(() => {
		getProductRequest(id);
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
			codeListRequest(selectedBusiness.idSucursal);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness, id]);

	const handleDelete = (index) => {
		let is5050Array = JSON.parse(product.is5050);
		is5050Array.splice(index, 1);
		setProduct({ ...product, is5050: JSON.stringify(is5050Array) });
	};

	useEffect(() => {
		click ? onReset() : '';
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [click]);

	const handleReturn = () => {
		router.push('/dashboard/products');
		setLoading(true);
	};
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			setChips([...chips, { word: inputValue }]);
			setInputValue('');
			event.preventDefault();
		}
	};
	const AddList = ()=>{
		promos
	}

	useEffect(() => {
		// Este código se ejecutará cada vez que `product.is5050` cambie
	}, [product.is5050]);

	useEffect(() => {
		getUnit()
	}, []);

	return (
		<div className="flex flex-col">
			<section className="flex justify-between items-center my-6">
				<Button
					onClick={handleReturn}
					className="p-6 rounded-full flex justify-center items-center"
				>
					<LeftOutlined className="text-2xl mb-1" />
				</Button>
				<h2 className="text-4xl">
					{props.update ? 'Actualizar Producto' : 'Agregar Producto'}
				</h2>
				<div></div>
			</section>
			<Card className="shadow-xl rounded-2xl">
				<Form
					name="addProduct"
					initialValues={{
						nameProduct: product.nameProduct,
						barCode: product.barCode,
						idProductFamilyFk: product.idProductFamilyFk,
						idProductSubFamilyFk: product.idProductSubFamilyFk,
						ean: product.ean,
						healthRegister: product.healthRegister,
						priceSale: product.priceSale,
						cpe: product.cpe,
						marketPrice: product.marketPrice,
						idUnitMeasureSaleFk: product.idUnitMeasureSaleFk,
						isheavy: product.isheavy,
						unitweight: product.unitweight,
						observation: product.observation,
						efectivo: product.efectivo,
						maxProducVenta: product.maxProducVenta,

						nameKitchen:JSON.stringify(chips2),
						idUnitMeasurePurchaseFk:product.idUnitMeasurePurchaseFk

					}}
					onFinish={onSubmit}
					autoComplete="off"
					form={form}
				>
					<Row>
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							<Form.Item
								label="Nombre"
								name="nameProduct"
								style={{
									padding: '0 .5rem',
								}}
								rules={[
									{
										required: true,
										message: 'Ingresa un nombre',
									},
								]}
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
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
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							<Form.Item
								style={{
									padding: '0 .5rem',
								}}
								label="Código"
								name="barCode"
								rules={[
									{
										required: true,
										message: 'Ingresa un código',
									},
									({}) => ({
										validator(_, value) {
											if (!value || !c?.includes(value)) {
												return Promise.resolve();
											}
											return Promise.reject(
												new Error('Este código ya se encuentra en uso')
											);
										},
									}),
								]}
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
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
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							<Form.Item
								style={{
									padding: '0 .5rem',
								}}
								label="Categoría"
								name="idProductFamilyFk"
								rules={[
									{
										required: true,
										message: 'Elige una categoría',
									},
								]}
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
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
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							<Form.Item
								style={{
									padding: '0 .5rem',
								}}
								label="Marca"
								name="idProductSubFamilyFk"
								rules={[
									{
										required: true,
										message: 'Elige una marca',
									},
								]}
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
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
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							<Form.Item
								label="EAN13"
								name="ean"
								style={{
									padding: '0 .5rem',
								}}
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
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
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							<Form.Item
								label="Codigo interno"
								name="efectivo"
								style={{
									padding: '0 .5rem',
								}}
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
							>
								<Input
									value={product.efectivo}
									onChange={(e) =>
										setProduct({
											...product,
											efectivo: e.target.value,
										})
									}
								/>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							<Form.Item
								label="Peso neto"
								name="maxProducVenta"
								value={product.maxProducVenta}
								style={{
									padding: '0 .5rem',
								}}
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
							>
								<Input
									value={product.maxProducVenta}
									onChange={(e) =>
										setProduct({
											...product,
											maxProducVenta: e.target.value,
										})
									}
								/>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							<Form.Item
								style={{
									padding: '0 .5rem',
								}}
								label="Registro Sanitario"
								name="healthRegister"
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
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
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							<Form.Item
								style={{
									padding: '0 .5rem',
								}}
								label="Precio"
								name="priceSale"
								rules={[
									{
										required: true,
										message: 'Ingresa un precio',
									},
									{
										pattern: /^(?!0*(\.0+)?$)\d+(\.\d{1,2})?$/,
										message: 'Ingresa un precio valido',
									},
								]}
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
							>
								<Input
									addonBefore="$"
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
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							<Form.Item
								label="CPE"
								name="cpe"
								style={{
									padding: '0 .5rem',
								}}
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
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
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							<Form.Item
								name="isPromo"
								label="Promoción"
								style={{
									padding: '0 .5rem',
								}}
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
							>
								<Switch
									className="bg-gray-300"
									checked={product.isPromo == 1}
									onChange={handleSwitchChange}
								/>
							</Form.Item>
						</Col>
						{product.isPromo == '1' && (
							<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
								<Form.Item
									label="Precio"
									style={{
										padding: '0 .5rem',
									}}
									name="marketPrice"
									rules={[
										{
											required: product.isPromo == 1,
											message: 'Ingresa un precio para promoción',
										},
									]}
									labelCol={{
										md: { span: 10 },
										sm: { span: 6 },
									}}
									wrapperCol={{
										md: { span: 14 },
										sm: { span: 18 },
									}}
								>
									<Input
										addonBefore="$"
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
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							<Form.Item
								style={{
									padding: '0 .5rem',
								}}
								label="Unidad de Medida Adicional"
								name="idUnitMeasurePurchaseFk"

								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
							>
								<Select
									value={product.idUnitMeasurePurchaseFk}
									onChange={(v) =>
										setProduct({
											...product,
											idUnitMeasurePurchaseFk: v,
										})
									}
								>
									{units?.map((u) => (
										<Select.Option key={u.idUnitMeasureFk} value={u.idUnitMeasureFk}>
											{u.unitMeasure}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
						{product.idUnitMeasurePurchaseFk && (
								<Form.Item
									style={{
										padding: '0 .5rem',
									}}
									label="Unidades/Caja"
									name="isheavy"
									value={product.isheavy}
									labelCol={{
										md: { span: 10 },
										sm: { span: 6 },
									}}
									wrapperCol={{
										md: { span: 14 },
										sm: { span: 18 },
									}}
								>
									<Input
										value={product.isheavy}
										onChange={(e) =>
											setProduct({
												...product,
												isheavy: e.target.value,
											})
										}
									/>
								</Form.Item>
							)}
							</Col>
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
						<Form.Item
								style={{
									padding: '0 .5rem',
								}}
								label="Medida"
								name="idUnitMeasureSaleFk"
								rules={[
									{
										required: true,
										message: 'Elige una medida',
									},
								]}
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
							>
								<Select
									value={product.idUnitMeasureSaleFk}
									onChange={(v) =>
										setProduct({
											...product,
											idUnitMeasureSaleFk: v,
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

						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							{product.idUnitMeasureSaleFk == 3 && (
								<Form.Item
									style={{
										padding: '0 .5rem',
									}}
									label="Peso Unitario"
									name="unitweight"
									rules={[
										{
											required: true,
											message: 'Especifica el peso de cada unidad',
										},
									]}
									required={product.idUnitMeasureSaleFk === 3}
									labelCol={{
										md: { span: 10 },
										sm: { span: 6 },
									}}
									wrapperCol={{
										md: { span: 14 },
										sm: { span: 18 },
									}}
								>
									<Input
										type="number"
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

						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							

							<Form.Item
								label="Palabras clave"
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
							>
								<Stack direction="row" spacing={1}>
									{product.is5050 &&
										Array.isArray(JSON.parse(product.is5050)) &&
										JSON.parse(product.is5050).map((item, index) => (
											<Chip
												key={index}
												label={item.word}
												onDelete={() => handleDelete(index)}
											/>
										))}
								</Stack>

								<Stack direction="row" spacing={1}>
									{chips.map((chip, index) => (
										<div key={index}>{chip.word}</div>
									))}
								</Stack>
								<Input
									style={{ marginTop: '1rem' }}
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									onKeyPress={handleKeyPress}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={24}>
							<Form.Item
								label="Observación"
								name="observation"
								style={{
									padding: '0 .5rem',
								}}
								labelCol={{
									md: { span: 5 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 19 },
									sm: { span: 18 },
								}}
							>
								<Input.TextArea
									rows={3}
									cols={3}
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
					<Row>
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
							<Form.Item
								name="Obsequio"
								label="Obsequio"
								style={{
									padding: '0 .5rem',
								}}
								labelCol={{
									md: { span: 10 },
									sm: { span: 6 },
								}}
								wrapperCol={{
									md: { span: 14 },
									sm: { span: 18 },
								}}
							>
								<Switch
									className="bg-gray-300"
									checked={obsequio == 1 }
									onChange={handleSwitchChange2}
								/>
							</Form.Item>
						</Col>
						{obsequio == '1' && (
							<>
								<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
									<Form.Item
										style={{
											padding: '0 .5rem',
										}}
										label="Productos"
										name="IdProduct"
										rules={[
											{
												required: true,
												message: 'Elige un Producto',
											},
										]}
										labelCol={{
											md: { span: 10 },
											sm: { span: 6 },
										}}
										wrapperCol={{
											md: { span: 14 },
											sm: { span: 18 },
										}}
									>
									
										<Select
											value={arregloObsequios.productPromo}
											onChange={(v) =>
												setArregloObsequios({
													...arregloObsequios,
													productPromo: v,
												})
											}
										>
											{products &&
												products.map((c, i) => (
													<Select.Option key={c.idProduct} value={c.idProduct}>
														{c.nameProduct}
													</Select.Option>
												))}
										</Select>

									</Form.Item>
								</Col>
								<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span:12 }}>
									<Form.Item
										label="Forma de Pago"
										style={{
											padding: '0 .5rem',
										}}
										name="Paymode"
										rules={[
											{
												required: obsequio == 1,
												message: 'Ingresa una modalidad de pago',
											},
										]}
										labelCol={{
											md: { span: 10 },
											sm: { span: 6 },
										}}
										wrapperCol={{
											md: { span: 14 },
											sm: { span: 18 },
										}}
									>
										<Select
											value={arregloObsequios.Paymode}
											onChange={(v) =>
												setArregloObsequios({
													...arregloObsequios,
													Paymode: v,
												})
											}
										>
											<Select.Option value={'Contado'}>
												Contado
											</Select.Option>
											<Select.Option value={'Credito'}>
												Credito
											</Select.Option>
											)
										</Select>
									</Form.Item>
								</Col>
								<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
									<Form.Item
										label="Cantidad"
										style={{
											padding: '0 .5rem',
										}}
										name="Cantidad"
										rules={[
											{
												required: obsequio == 1,
												message: 'Ingresa una Cantidad',
											},
										]}
										labelCol={{
											md: { span: 10 },
											sm: { span: 6 },
										}}
										wrapperCol={{
											md: { span: 14 },
											sm: { span: 18 },
										}}
									>
											<Input
										type="number"
										value={arregloObsequios.cantidad}
										onChange={(e) =>
											setArregloObsequios({
												...arregloObsequios,
												cantidad: e.target.value,
											})
										}
									/>
									</Form.Item>
								</Col>
								<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span:12 }}>
									<Form.Item
										label="Condicion"
										style={{
											padding: '0 .5rem',
										}}
										name="Condicion"
										rules={[
											{
												required: obsequio == 1,
												message: 'Ingresa una Condicion',
											},
										]}
										labelCol={{
											md: { span: 10 },
											sm: { span: 6 },
										}}
										wrapperCol={{
											md: { span: 14 },
											sm: { span: 18 },
										}}
									>
										<Select
											value={arregloObsequios.condicion}
											onChange={(v) =>
												setArregloObsequios({
													...arregloObsequios,
													condicion: v,
												})
											}
										>
											<Select.Option value={'Mayor que'}>
												Mayor que
											</Select.Option>
											<Select.Option value={'Mayor e igual que'}>
												Mayor e igual que
											</Select.Option>
											<Select.Option value={'Menor que'}>
												Menor que
											</Select.Option>
											<Select.Option value={'Menor e igual que'}>
												Menor e igual que
											</Select.Option>
											)
										</Select>
									</Form.Item>
								</Col>
								<Col
							sm={{ span: 10, offset: 4 }}
							xs={{ span: 10, offset: 4 }}
							lg={{ span: 7, offset: 17  }}
							md={{ span: 7, offset: 17  }}
						>
								<Form.Item>
								<Button block onClick={addProms} type="success">
									Agregar Obsequio
								</Button>
							</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span:20,offset:4 }}  >
							<Table   columns={columns}/>
							</Col>
							</>
						)}
					</Row>
					<Row>
						<Col
							sm={{ span: 10, offset: 0 }}
							xs={{ span: 10, offset: 0 }}
							lg={{ span: 7, offset: 5 }}
							md={{ span: 7, offset: 5 }}
						>
							<Form.Item
								style={{ marginTop: '1rem' }}
								rules={[
									{
										required: true,
										message: 'Sube una imagen',
									},
								]}
							>
								{currentProduct && currentProduct.urlImagenProduct && (
									<img
										style={{
											maxWidth: '150px',
											height: 'auto',
											marginBottom: '10px',
										}}
										src={`${ip}:${generalContext?.api_port}/product/${currentProduct.urlImagenProduct}`}
									/>
								)}
								<Upload
									name="avatar"
									className="avatar-uploader"
									listType="picture"
									fileList={fileList}
									accept=".png,.jpg"
									{...uploadProps}
								>
									<Button icon={<UploadOutlined />}>Subir imagen</Button>
								</Upload>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col
							sm={{ span: 10, offset: 0 }}
							xs={{ span: 10, offset: 0 }}
							lg={{ span: 7, offset: 5 }}
							md={{ span: 7, offset: 5 }}
						>
							<Form.Item>
								<Button block onClick={onReset} type="warning">
									Limpiar
								</Button>
							</Form.Item>
						</Col>
						<Col
							sm={{ span: 10, offset: 4 }}
							xs={{ span: 10, offset: 4 }}
							lg={{ span: 7, offset: 5 }}
							md={{ span: 7, offset: 5 }}
						>
							<Form.Item>
								<Button htmlType="submit" type="success" block>
									{props.update ? 'Actualizar' : 'Agregar'}
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Card>
		</div>
	);
};

export default ProductForm;
