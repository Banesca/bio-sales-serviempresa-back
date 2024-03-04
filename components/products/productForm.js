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
	Space,
} from 'antd';
import {
	ArrowLeftOutlined,
	DeleteOutlined,
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
	const [listRegalos, setListRegalos] = useState([]);
	const [listRegalos2, setListRegalos2] = useState([]);
	const [listRegalos3, setListRegalos3] = useState([]);
	const [deleteListRegalos, setDeleteListRegalos] = useState(null);
	const [deleteadicional, setDeleteadicional] = useState([]);
	const [prelistAdicional, setPrelistAdicional] = useState(null);
	const [listTable, setListTable] = useState(null);
	const [deleteList, setDeleteList] = useState([]);
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
		cantidadAregalar:'',
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
		listpromo: props.product.listpromo || '',
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
			listpromo:'',
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
			dataIndex: 'id',
			key:1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Forma de Pago',
			dataIndex: 'Paymode',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Cantidad',
			dataIndex: 'cantidad',
			key: 3,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Condicion',
			dataIndex: 'condicion',
			key: 4,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Cantidad a regalar',
			dataIndex: 'cantidadAregalar',
			key: 4,
			render: (text) => <p>{text}</p>,
		},
		
		{
			title: 'Acciones',
			dataIndex: 'productPromo',
			key: 5,
			render: (text, index) => ( 
			<Space>
				<Button type="primary" danger onClick={() => handleOpenDeleteModal(text)}>
					<DeleteOutlined />
				</Button>
			</Space>
		)
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
		//console.log(products)
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
		//console.log(value)
		setUnits(value)
	}

	const handleOpenDeleteModal=(id)=>{
		//console.log(id)
		let filteredArray = deleteListRegalos ? deleteListRegalos.filter(item => item.productPromo !== id )  : listRegalos.filter(item => item.productPromo !== id);
		let filteredArray3 = deleteListRegalos ? deleteListRegalos.filter(item => item.productPromo !== id )  : listRegalos3.filter(item => item.productPromo !== id);
		let filteredArray2 = deleteadicional ? deleteadicional.filter(item => item.idProduct !== id) : product.adicionals.filter(item => item.idProduct !== id);
		setListRegalos(filteredArray)
		setListRegalos3(filteredArray3)
		setDeleteList(filteredArray2)
		
		/*//console.log(filteredArray2)
		//console.log(filteredArray.length)
		//console.log(filteredArray2.length)
		//console.log(filteredArray)
		//console.log(product?.adicionals)*/
	}

	
	
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
				//console.log(`El tamaño del archivo es: ${file.size / 1024 / 1024} MB`);
				if (!isLt2M) {
					message.error('El tamaño máximo es 2MB!');
					return false;
				}
				let isValid = isJpgOrPng && isLt2M;
				if (isValid) {
					//console.log(file);
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
		let lastStep=''
		let step2=''
		let newIs5050=''
		let Arreglo=[]
		let currentIs5050 = [];
		let CurrentpercentageOfProfit = [];
		let CurrentpercentageOfProfit2 = [];
		const adicionales = {idProductAdicionalFk: arregloObsequios.productPromo}
		Arreglo.push(adicionales)
		let productObsequio =null
		let ObsequioLista =null
		try {
		  currentIs5050 = JSON.parse(product.is5050);
		} catch (error) {
		  console.error('Error parsing product.is5050:', error);
		}

		if (Array.isArray(currentIs5050)) {
			 newIs5050 = JSON.stringify(currentIs5050.concat(words));
		  } else {
			newIs5050 = words;
		  }

		try {
		  CurrentpercentageOfProfit = JSON.parse(product.listpromo);
		} catch (error) {
		  console.error('Error parsing product.listpromo:', error);
		}


		try {
		  CurrentpercentageOfProfit2 = JSON.parse(product.adicionals);
		} catch (error) {
		  console.error('Error parsing product.listpromo:', error);
		}

		

		//console.log(deleteListRegalos)
		//console.log(listRegalos)
		////console.log(CurrentpercentageOfProfit2)
		////console.log(currentIs5050)
		////console.log(words2)
		////console.log(words2.length)
		//CurrentpercentageOfProfit.push(words2)


	  ////console.log(ObsequioLista);

		
		if(listRegalos2.length> 1){
			productObsequio = JSON.stringify(listRegalos);
			ObsequioLista = adicionales ?  JSON.stringify(product.adicionals.concat(Arreglo)) : JSON.stringify(product.adicionals);	
			//console.log('aqui 1')
		} else {
			productObsequio = JSON.stringify(listRegalos3);
			ObsequioLista = adicionales ?  JSON.stringify(product.adicionals.concat(Arreglo)) : JSON.stringify(product.adicionals);	
			//console.log('aqui 2')
		}

		
	  
	    
	  

	  //console.log(productObsequio)
	  //console.log(ObsequioLista)
	 // //console.log(productObsequio);
		const updatedProduct = {
		  ...product,
		  adicionals: ObsequioLista,
		  is5050:newIs5050 ,
		  listpromo: productObsequio,
		  idSucursalFk: selectedBusiness.idSucursal,
		};
		
		await props.handleRequest(updatedProduct, file);
		setProduct(updatedProduct);
		

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

	useEffect(()=>{
		if(arregloObsequios.id!=='' && arregloObsequios.productPromo!==null && arregloObsequios.cantidad!=='' && arregloObsequios.condicion!==''  && arregloObsequios.cantidadAregalar!=='' && arregloObsequios.Paymode!=='' && listRegalos2.length<1){
			setListRegalos3(listRegalos3.concat(arregloObsequios))
		}
		//console.log(listRegalos3)
	},[arregloObsequios])

	const addProms= () =>{
		if(arregloObsequios.id!=='' && arregloObsequios.productPromo!==null && arregloObsequios.cantidad!=='' && arregloObsequios.cantidadAregalar!=='' && arregloObsequios.condicion!=='' && arregloObsequios.Paymode!==''){
			setListRegalos(listRegalos?.concat(arregloObsequios))
			setListRegalos2(listRegalos?.concat(arregloObsequios))
		//let arr=prelistAdicional?.concat(listRegalos)
		//console.log(prelistAdicional)
		////console.log(arr)
	} else {
		//console.log('no')
	}}

	useEffect(()=>{		
		setArregloObsequios({
		...arregloObsequios,
	})
	////console.log(currentProduct)
	
},[products])


useEffect(()=>{

		setChips2([arregloObsequios]);
		const productos=products?.find(product=>product.idProduct===arregloObsequios?.productPromo)
		arregloObsequios.id=productos?.nameProduct

		//console.log(currentProduct)
		/*
		//console.log(arregloObsequios);
		//console.log(typeof(product.listpromo)) 
		//console.log(listRegalos) 
		//console.log(chips2)*/
},[arregloObsequios])





useEffect(()=>{
	//product.listpromo==='' ? null :  setListRegalos(JSON?.parse(product?.listpromo)) 
	//product.adicionals==='' ? null :  setDeleteList(JSON?.parse(product?.adicionals)) 
	/*//console.log(product.listpromo)
	//console.log(product.adicionals)
	//console.log(listRegalos)
	//console.log(deleteList)*/

		//console.log(listRegalos)
		////console.log(arr)

		//console.log(deleteListRegalos)
		
},[listRegalos])





useEffect(() => {
    if (product.listpromo !== '') {
        try {
            const parsedListPromo = JSON.parse(product.listpromo);
            setListRegalos(parsedListPromo);
            setListRegalos3(parsedListPromo);
        } catch (error) {
            console.error('Error parsing listpromo:', error);
			setListRegalos([])
			setListRegalos3([])
        }
    }
	if (product.adicionals !== '') {
        try {
            const parsedListPromo = JSON.parse(product.adicionals);
            setDeleteList(parsedListPromo);
        } catch (error) {
            console.error('Error parsing adicionals:', error);
        }
    }
}, []);


	const handleSwitchChange = (value) => {
		setProduct({ ...product, isPromo: value ? '1' : '0' });
	};

	const handleSwitchChange2 = (value) => {
		//console.log(value);
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

						listpromo:JSON.stringify(chips2),
						idUnitMeasurePurchaseFk:product.idUnitMeasurePurchaseFk

					}}
					onFinish={onSubmit}
					autoComplete="off"
					form={form}
				>
									<Row>
						<Col
							sm={{ span: 10, offset: 0 }}
							xs={{ span: 10, offset: 0 }}
							lg={{ span: 5, offset: 19 }}
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
								label="Agregar Obsequio"
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
						</Row>
						<Row>
						{obsequio == '1' && (
							<>
								<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
									<Form.Item
										style={{
											padding: '0 .5rem',
											color: 'white',
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
													productPromo: v
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
										name="Paymode"
										rules={[
											{
												required: obsequio == 1,
												message: 'Ingresa una modalidad de pago',
											},
										]}
										labelCol={{
											md: { span: 6 },
											sm: { span: 6 },
										}}
										wrapperCol={{
											md: { span: 16 },
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
											<Select.Option value={'Ambas'}>
												Ambas
											</Select.Option>
											)
										</Select>
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
											md: { span: 6},
											sm: { span: 12 },
										}}
										wrapperCol={{
											md: { span: 16 },
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
								<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
									<Form.Item
										label="Cantidad a regalar"
										style={{
											padding: '0 .5rem',
										}}
										name="cantidadAregalar"
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
										min={0}
										value={arregloObsequios.cantidadAregalar}
										onChange={(e) =>
											setArregloObsequios({
												...arregloObsequios,
												cantidadAregalar: e.target.value,
											})
										}
									/>
									</Form.Item>
								</Col>
								<Col
							sm={{ span: 10 }}
							xs={{ span: 10 }}
							lg={{ span: 8,  offset:3}}
							md={{ span: 8, offset:3 }}
						>
								<Form.Item>
								<Button block onClick={addProms} type="success">
									Agregar Obsequio
								</Button>  
							</Form.Item>
							</Col>
							

							</>
						)}
						{listRegalos?.length>0  ?
						<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span:20,offset:4 }}  >
							<Table columns={columns} dataSource={listRegalos}/>
						</Col> : <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span:20,offset:4 }} ></Col>
						}
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
